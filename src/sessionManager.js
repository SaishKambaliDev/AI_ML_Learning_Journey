/**
 * sessionManager.js
 * Manages isolated execution sessions per authenticated user.
 *
 * Each user (identified by their Cognito sub/userId) gets their own:
 *   - Active Docker child process (killed when they run new code)
 *   - Execution history (their step-through state)
 *   - Temp workspace directory on disk
 *   - Last-active timestamp (for cleanup of idle sessions)
 *
 * This means 100 users running code simultaneously don't interfere with each other.
 */

const fs = require('fs');

// Map<userId, SessionState>
const sessions = new Map();
const MAX_HISTORY_STEPS = 1200;

// Auto-cleanup idle sessions every 10 minutes
const IDLE_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes
setInterval(cleanupIdleSessions, 10 * 60 * 1000);

/**
 * Session shape:
 * {
 *   userId: string,
 *   email: string,
 *   socketId: string,           // current socket connection
 *   activeChild: ChildProcess,  // running Docker process (or null)
 *   executionHistory: [],       // TRACE steps collected from last run
 *   tmpDir: string,             // path to temp build dir (or null)
 *   lastActive: Date
 * }
 */

function getSession(userId) {
    return sessions.get(userId) || null;
}

function createOrUpdateSession(userId, email, socketId) {
    const existing = sessions.get(userId) || {};
    const session = {
        userId,
        email,
        socketId,
        activeChild: existing.activeChild || null,
        executionHistory: existing.executionHistory || [],
        tmpDir: existing.tmpDir || null,
        lastActive: new Date()
    };
    sessions.set(userId, session);
    return session;
}

/**
 * Called when a user starts a new code run.
 * Kills any existing Docker process for this user and clears their history.
 */
function startNewRun(userId) {
    const session = sessions.get(userId);
    if (!session) return;

    // Kill previous Docker process if still running
    if (session.activeChild) {
        try { session.activeChild.kill(); } catch (_) {}
        session.activeChild = null;
    }

    // Clean up previous temp dir
    if (session.tmpDir && fs.existsSync(session.tmpDir)) {
        try { fs.rmSync(session.tmpDir, { recursive: true, force: true }); } catch (_) {}
        session.tmpDir = null;
    }

    session.executionHistory = [];
    session.lastActive = new Date();
}

function setActiveChild(userId, child) {
    const session = sessions.get(userId);
    if (session) {
        session.activeChild = child;
        session.lastActive = new Date();
    }
}

function setTmpDir(userId, tmpDir) {
    const session = sessions.get(userId);
    if (session) session.tmpDir = tmpDir;
}

function addStep(userId, stepData) {
    const session = sessions.get(userId);
    if (session) {
        session.executionHistory.push(stepData);
        if (session.executionHistory.length > MAX_HISTORY_STEPS) {
            session.executionHistory = session.executionHistory.slice(-MAX_HISTORY_STEPS);
        }
        session.lastActive = new Date();
    }
}

function setHistory(userId, history) {
    const session = sessions.get(userId);
    if (!session) return;
    session.executionHistory = Array.isArray(history) ? history : [];
    session.lastActive = new Date();
}

function getHistory(userId) {
    return sessions.get(userId)?.executionHistory || [];
}

/**
 * Called when a user disconnects (but we keep their session alive briefly
 * so they can reconnect and resume stepping through their history).
 */
function markDisconnected(userId, socketId = null) {
    const session = sessions.get(userId);
    if (session) {
        if (socketId && session.socketId && session.socketId !== socketId) {
            session.lastActive = new Date();
            return;
        }
        session.socketId = null;
        session.lastActive = new Date();
    }
}

/**
 * Update socketId when user reconnects (e.g. page refresh).
 * Their execution history is preserved so they can keep stepping.
 */
function reconnectSession(userId, newSocketId) {
    const session = sessions.get(userId);
    if (session) {
        session.socketId = newSocketId;
        session.lastActive = new Date();
    }
}

function cleanupSession(userId) {
    const session = sessions.get(userId);
    if (!session) return;
    if (session.activeChild) {
        try { session.activeChild.kill(); } catch (_) {}
    }
    if (session.tmpDir && fs.existsSync(session.tmpDir)) {
        try { fs.rmSync(session.tmpDir, { recursive: true, force: true }); } catch (_) {}
    }
    sessions.delete(userId);
}

function cleanupIdleSessions() {
    const now = Date.now();
    for (const [userId, session] of sessions.entries()) {
        const idleMs = now - session.lastActive.getTime();
        if (idleMs > IDLE_TIMEOUT_MS && !session.activeChild) {
            console.log(`[SessionManager] Cleaning up idle session for ${session.email}`);
            cleanupSession(userId);
        }
    }
}

function getStats() {
    return {
        totalSessions: sessions.size,
        activeSessions: [...sessions.values()].filter(s => s.socketId !== null).length,
        sessions: [...sessions.values()].map(s => ({
            userId: s.userId,
            email: s.email,
            connected: s.socketId !== null,
            historyLength: s.executionHistory.length,
            lastActive: s.lastActive
        }))
    };
}

module.exports = {
    getSession,
    createOrUpdateSession,
    startNewRun,
    setActiveChild,
    setTmpDir,
    addStep,
    setHistory,
    getHistory,
    markDisconnected,
    reconnectSession,
    cleanupSession,
    getStats
};
