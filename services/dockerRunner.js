const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { spawn } = require('child_process');

const LOCAL_C_COMPILER = process.env.C_COMPILER || 'gcc';
const LOCAL_EXECUTION_FALLBACK_ENABLED =
    process.env.ALLOW_LOCAL_EXECUTION === 'true' ||
    process.env.DEMO_MODE === 'true';
const PREFER_LOCAL_EXECUTION = process.env.PREFER_LOCAL_EXECUTION === 'true';
const READY_CACHE_TTL_MS = 15000;
const READY_FAILURE_CACHE_TTL_MS = 3000;
const COMPILE_CACHE_TTL_MS = 5 * 60 * 1000;
const COMPILE_CACHE_MAX_ENTRIES = 12;
const readinessCache = {
    docker: { expiresAt: 0, value: null, promise: null },
    local: { expiresAt: 0, value: null, promise: null }
};
const compileCache = new Map();

function ensureTempRoot() {
    const tempRoot = path.join(__dirname, '..', 'temp_builds');
    if (!fs.existsSync(tempRoot)) {
        fs.mkdirSync(tempRoot, { recursive: true });
    }
    return tempRoot;
}

function ensureCompileCacheDir() {
    const cacheDir = path.join(ensureTempRoot(), '.compile_cache');
    if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
    }
    return cacheDir;
}

function hashSource(code) {
    return crypto.createHash('sha256').update(String(code || '')).digest('hex');
}

function getCompileCacheKey(workspace, backend) {
    if (!workspace?.sourceHash || !backend) return '';
    return `${backend}:${workspace.sourceHash}`;
}

function pruneCompileCache() {
    const now = Date.now();
    for (const [key, entry] of compileCache.entries()) {
        if (!entry?.binaryPath || entry.expiresAt <= now || !fs.existsSync(entry.binaryPath)) {
            if (entry?.binaryPath && fs.existsSync(entry.binaryPath)) {
                try { fs.rmSync(entry.binaryPath, { force: true }); } catch (_) {}
            }
            compileCache.delete(key);
        }
    }

    if (compileCache.size <= COMPILE_CACHE_MAX_ENTRIES) {
        return;
    }

    const evictable = [...compileCache.entries()]
        .sort((a, b) => (a[1].lastUsedAt || 0) - (b[1].lastUsedAt || 0));
    while (compileCache.size > COMPILE_CACHE_MAX_ENTRIES && evictable.length) {
        const [key, entry] = evictable.shift();
        if (entry?.binaryPath && fs.existsSync(entry.binaryPath)) {
            try { fs.rmSync(entry.binaryPath, { force: true }); } catch (_) {}
        }
        compileCache.delete(key);
    }
}

function restoreCompiledBinaryFromCache(workspace, backend) {
    pruneCompileCache();
    const key = getCompileCacheKey(workspace, backend);
    if (!key || !compileCache.has(key) || !workspace?.tmpDir) {
        return false;
    }

    const entry = compileCache.get(key);
    if (!entry?.binaryPath || !fs.existsSync(entry.binaryPath)) {
        compileCache.delete(key);
        return false;
    }

    const target = path.join(workspace.tmpDir, 'prog');
    fs.copyFileSync(entry.binaryPath, target);
    try { fs.chmodSync(target, 0o755); } catch (_) {}
    entry.lastUsedAt = Date.now();
    return true;
}

function cacheCompiledBinary(workspace, backend) {
    const key = getCompileCacheKey(workspace, backend);
    const sourceBinary = workspace?.tmpDir ? path.join(workspace.tmpDir, 'prog') : '';
    if (!key || !sourceBinary || !fs.existsSync(sourceBinary)) {
        return;
    }

    const cacheDir = ensureCompileCacheDir();
    const cachePath = path.join(cacheDir, `${backend}-${workspace.sourceHash}.prog`);
    fs.copyFileSync(sourceBinary, cachePath);
    try { fs.chmodSync(cachePath, 0o755); } catch (_) {}
    compileCache.set(key, {
        binaryPath: cachePath,
        expiresAt: Date.now() + COMPILE_CACHE_TTL_MS,
        lastUsedAt: Date.now()
    });
    pruneCompileCache();
}

function cloneProbeResult(result) {
    return result ? { ...result } : result;
}

function cacheResult(key, result) {
    const ttl = result?.ok ? READY_CACHE_TTL_MS : READY_FAILURE_CACHE_TTL_MS;
    readinessCache[key].value = cloneProbeResult(result);
    readinessCache[key].expiresAt = Date.now() + ttl;
    readinessCache[key].promise = null;
    return cloneProbeResult(result);
}

async function withReadinessCache(key, loader) {
    const cache = readinessCache[key];
    if (cache.value && cache.expiresAt > Date.now()) {
        return cloneProbeResult(cache.value);
    }
    if (cache.promise) {
        return cache.promise;
    }
    cache.promise = Promise.resolve()
        .then(loader)
        .then((result) => cacheResult(key, result))
        .catch((err) => {
            cache.promise = null;
            throw err;
        });
    return cache.promise;
}

function runDockerProbe(args, timeoutMs = 5000) {
    return new Promise((resolve) => {
        let stdout = '';
        let stderr = '';
        let done = false;
        const finish = (ok, out = '') => {
            if (done) return;
            done = true;
            resolve({ ok, out: out.trim() });
        };
        const child = spawn('docker', args, { stdio: ['ignore', 'pipe', 'pipe'] });
        const timeout = setTimeout(() => {
            try { child.kill('SIGKILL'); } catch (_) {}
            finish(false, 'docker command timed out');
        }, timeoutMs);
        child.stdout.on('data', (d) => { stdout += d.toString(); });
        child.stderr.on('data', (d) => { stderr += d.toString(); });
        child.on('error', (err) => {
            clearTimeout(timeout);
            finish(false, err.message || 'docker command failed');
        });
        child.on('close', (code) => {
            clearTimeout(timeout);
            finish(code === 0, stderr || stdout);
        });
    });
}

async function ensureDockerReady() {
    return withReadinessCache('docker', async () => {
        const info = await runDockerProbe(['info'], 5000);
        if (!info.ok) {
            return {
                ok: false,
                message: `❌ Docker daemon unavailable.\n${info.out || 'Run: docker info'}`
            };
        }
        const image = await runDockerProbe(['image', 'inspect', 'c-runner'], 5000);
        if (!image.ok) {
            return {
                ok: false,
                message: '❌ Docker image "c-runner" not found.\nRun:\n  docker build -t c-runner - <<\'EOF\'\n  FROM gcc:13\n  WORKDIR /workspace\n  EOF'
            };
        }
        return { ok: true };
    });
}

function runLocalProbe(args, timeoutMs = 5000) {
    return new Promise((resolve) => {
        let stdout = '';
        let stderr = '';
        let done = false;
        const finish = (ok, out = '') => {
            if (done) return;
            done = true;
            resolve({ ok, out: out.trim() });
        };
        const child = spawn(LOCAL_C_COMPILER, args, { stdio: ['ignore', 'pipe', 'pipe'] });
        const timeout = setTimeout(() => {
            try { child.kill('SIGKILL'); } catch (_) {}
            finish(false, `${LOCAL_C_COMPILER} probe timed out`);
        }, timeoutMs);
        child.stdout.on('data', (d) => { stdout += d.toString(); });
        child.stderr.on('data', (d) => { stderr += d.toString(); });
        child.on('error', (err) => {
            clearTimeout(timeout);
            finish(false, err.message || `${LOCAL_C_COMPILER} probe failed`);
        });
        child.on('close', (code) => {
            clearTimeout(timeout);
            finish(code === 0, stderr || stdout);
        });
    });
}

async function ensureLocalCompilerReady() {
    return withReadinessCache('local', async () => {
        const compiler = await runLocalProbe(['--version'], 5000);
        if (!compiler.ok) {
            return {
                ok: false,
                message: `❌ Local compiler "${LOCAL_C_COMPILER}" unavailable.\n${compiler.out || `Install ${LOCAL_C_COMPILER} or set C_COMPILER.`}`
            };
        }
        return { ok: true };
    });
}

async function resolveExecutionBackend(preferredBackend = '') {
    const normalized = String(preferredBackend || '').trim().toLowerCase();
    if (normalized === 'docker') {
        const docker = await ensureDockerReady();
        return docker.ok
            ? { ok: true, backend: 'docker' }
            : { ok: false, message: docker.message };
    }
    if (normalized === 'local') {
        const local = await ensureLocalCompilerReady();
        return local.ok
            ? { ok: true, backend: 'local' }
            : { ok: false, message: local.message };
    }

    if (PREFER_LOCAL_EXECUTION && LOCAL_EXECUTION_FALLBACK_ENABLED) {
        const local = await ensureLocalCompilerReady();
        if (local.ok) {
            return {
                ok: true,
                backend: 'local',
                notice: '⚙️ Using local gcc execution (PREFER_LOCAL_EXECUTION=true).'
            };
        }
    }

    const docker = await ensureDockerReady();
    if (docker.ok) {
        return { ok: true, backend: 'docker' };
    }

    if (!LOCAL_EXECUTION_FALLBACK_ENABLED) {
        return {
            ok: false,
            message: [
                docker.message,
                '❌ Local gcc fallback is disabled.\nSet ALLOW_LOCAL_EXECUTION=true for trusted local development.'
            ].filter(Boolean).join('\n\n')
        };
    }

    const local = await ensureLocalCompilerReady();
    if (local.ok) {
        return {
            ok: true,
            backend: 'local',
            notice: '⚠️ Docker is unavailable, falling back to local gcc execution.'
        };
    }

    return {
        ok: false,
        message: [docker.message, local.message].filter(Boolean).join('\n\n')
    };
}

/**
 * Writes the already-instrumented code to a temp workspace directory.
 * NOTE: This file lives in services/dockerRunner.js
 *       __dirname = /your/project/services
 *       path.join(__dirname, '..', 'temp_builds') = /your/project/temp_builds  ✓
 */
function createWorkspace(code) {
    const tempRoot = ensureTempRoot();

    const base = `build_${Date.now()}`;
    let tmpDir = path.join(tempRoot, base);
    let attempt = 0;
    while (fs.existsSync(tmpDir)) {
        attempt += 1;
        tmpDir = path.join(tempRoot, `${base}_${attempt}`);
    }
    fs.mkdirSync(tmpDir, { recursive: true });
    try { fs.chmodSync(tmpDir, 0o755); } catch (_) {}

    // fix.h: disables stdout buffering so TRACE output flushes immediately.
    // Without this, printf output is buffered and may never arrive before the
    // process exits, causing the terminal to show nothing.
    const fixCode = `#include <stdio.h>
__attribute__((constructor)) void init() {
    setvbuf(stdout, NULL, _IONBF, 0);
    setvbuf(stderr, NULL, _IONBF, 0);
}
`;

    fs.writeFileSync(path.join(tmpDir, 'main.c'), code);
    fs.writeFileSync(path.join(tmpDir, 'fix.h'), fixCode);
    try { fs.chmodSync(path.join(tmpDir, 'main.c'), 0o644); } catch (_) {}
    try { fs.chmodSync(path.join(tmpDir, 'fix.h'), 0o644); } catch (_) {}

    return { tmpDir, sourceHash: hashSource(code) };
}

/**
 * Compiles main.c inside a Docker container (async/non-blocking).
 * This avoids blocking Node's event loop, so Socket.IO heartbeats keep flowing.
 */
async function compileInDocker(workspace) {
    if (!workspace?.tmpDir || !fs.existsSync(workspace.tmpDir)) {
        return {
            success: false,
            compilerOutput: `❌ Workspace missing before compile: ${workspace?.tmpDir || '(none)'}`
        };
    }

    const probe = await ensureDockerReady();
    if (!probe.ok) {
        return {
            success: false,
            compilerOutput: probe.message
        };
    }

    const compileCmd = [
        'run', '--rm',
        // NO -i flag here — we don't need stdin for compilation
        '-v', `${workspace.tmpDir}:/workspace`,
        'c-runner',
        'sh', '-lc',
        'gcc -include /workspace/fix.h /workspace/main.c -o /workspace/prog && chmod 755 /workspace/prog'
    ];

    return new Promise((resolve) => {
        let stdout = '';
        let stderr = '';
        let timedOut = false;
        let settled = false;
        const finish = (payload) => {
            if (settled) return;
            settled = true;
            resolve(payload);
        };

        const child = spawn('docker', compileCmd, { stdio: ['ignore', 'pipe', 'pipe'] });
        const timeout = setTimeout(() => {
            timedOut = true;
            try { child.kill('SIGKILL'); } catch (_) {}
            finish({
                success: false,
                compilerOutput: '❌ Compile timeout — docker compile process did not finish in 30s. Check Docker daemon health and c-runner image.\n  Run: docker info'
            });
        }, 30000);

        child.stdout.on('data', (d) => { stdout += d.toString(); });
        child.stderr.on('data', (d) => { stderr += d.toString(); });

        child.on('error', (err) => {
            clearTimeout(timeout);
            finish({
                success: false,
                compilerOutput: '❌ Docker error: ' + err.message
            });
        });

        child.on('close', (code) => {
            clearTimeout(timeout);
            if (timedOut) {
                finish({
                    success: false,
                    compilerOutput: '❌ Compile timeout — is Docker running? Is the c-runner image built?\n  Run: docker build -t c-runner - <<\'EOF\'\n  FROM gcc:13\n  WORKDIR /workspace\n  EOF'
                });
                return;
            }
            finish({
                success: code === 0,
                compilerOutput: stderr || stdout || (code === 0 ? '' : `❌ Compile failed with exit ${code} and no diagnostic output.`)
            });
        });
    });
}

async function compileLocally(workspace) {
    if (!workspace?.tmpDir || !fs.existsSync(workspace.tmpDir)) {
        return {
            success: false,
            compilerOutput: `❌ Workspace missing before compile: ${workspace?.tmpDir || '(none)'}`
        };
    }

    const probe = await ensureLocalCompilerReady();
    if (!probe.ok) {
        return {
            success: false,
            compilerOutput: probe.message
        };
    }

    const mainPath = path.join(workspace.tmpDir, 'main.c');
    const fixHeaderPath = path.join(workspace.tmpDir, 'fix.h');
    const progPath = path.join(workspace.tmpDir, 'prog');

    return new Promise((resolve) => {
        let stdout = '';
        let stderr = '';
        let timedOut = false;
        let settled = false;
        const finish = (payload) => {
            if (settled) return;
            settled = true;
            resolve(payload);
        };

        const child = spawn(
            LOCAL_C_COMPILER,
            ['-include', fixHeaderPath, mainPath, '-o', progPath],
            {
                cwd: workspace.tmpDir,
                stdio: ['ignore', 'pipe', 'pipe']
            }
        );
        const timeout = setTimeout(() => {
            timedOut = true;
            try { child.kill('SIGKILL'); } catch (_) {}
            finish({
                success: false,
                compilerOutput: `❌ Compile timeout — ${LOCAL_C_COMPILER} did not finish in 30s.`
            });
        }, 30000);

        child.stdout.on('data', (d) => { stdout += d.toString(); });
        child.stderr.on('data', (d) => { stderr += d.toString(); });

        child.on('error', (err) => {
            clearTimeout(timeout);
            finish({
                success: false,
                compilerOutput: `❌ Local compiler error: ${err.message}`
            });
        });

        child.on('close', (code) => {
            clearTimeout(timeout);
            if (timedOut) {
                finish({
                    success: false,
                    compilerOutput: `❌ Compile timeout — ${LOCAL_C_COMPILER} did not finish in 30s.`
                });
                return;
            }
            if (code === 0) {
                try { fs.chmodSync(progPath, 0o755); } catch (_) {}
            }
            finish({
                success: code === 0,
                compilerOutput: stderr || stdout || (code === 0 ? '' : `❌ Compile failed with exit ${code} and no diagnostic output.`)
            });
        });
    });
}

async function compileWorkspace(workspace, preferredBackend = '') {
    const backend = await resolveExecutionBackend(preferredBackend);
    if (!backend.ok) {
        return {
            success: false,
            backend: preferredBackend ? normalizedBackend(preferredBackend) : '',
            compilerOutput: backend.message
        };
    }

    if (restoreCompiledBinaryFromCache(workspace, backend.backend)) {
        return {
            success: true,
            compilerOutput: '',
            backend: backend.backend,
            backendNotice: backend.notice || ''
        };
    }

    const result = backend.backend === 'docker'
        ? await compileInDocker(workspace)
        : await compileLocally(workspace);

    if (result.success) {
        cacheCompiledBinary(workspace, backend.backend);
    }

    return {
        ...result,
        backend: backend.backend,
        backendNotice: backend.notice || ''
    };
}

function spawnExecution(workspace, backend = 'docker') {
    if (!workspace?.tmpDir || !fs.existsSync(workspace.tmpDir)) {
        return {
            ok: false,
            error: `Workspace missing before execution: ${workspace?.tmpDir || '(none)'}`
        };
    }

    if (backend === 'local') {
        const binaryPath = path.join(workspace.tmpDir, 'prog');
        const child = spawn(binaryPath, [], {
            cwd: workspace.tmpDir,
            stdio: ['pipe', 'pipe', 'pipe']
        });
        return { ok: true, child };
    }

    const child = spawn('docker', [
        'run', '--rm',
        '-i',
        '--memory', '64m',
        '--pids-limit', '64',
        '--cpus', '0.5',
        '--network', 'none',
        '--read-only',
        '--cap-drop=ALL',
        '--security-opt', 'no-new-privileges',
        '--tmpfs', '/tmp:rw,nosuid,size=16m',
        '--workdir', '/',
        '-v', `${workspace.tmpDir}:/workspace`,
        'c-runner',
        '/workspace/prog'
    ]);
    return { ok: true, child };
}

function normalizedBackend(value) {
    const backend = String(value || '').trim().toLowerCase();
    return backend === 'local' ? 'local' : 'docker';
}

module.exports = {
    createWorkspace,
    compileInDocker,
    compileWorkspace,
    ensureDockerReady,
    ensureLocalCompilerReady,
    resolveExecutionBackend,
    spawnExecution
};
