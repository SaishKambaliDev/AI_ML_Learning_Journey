/**
 * server.js — MemFlow AI Visualizer (AWS Multi-User Edition)
 *
 * Auth flow:
 *   1. User visits /login.html → redirected to Cognito Hosted UI
 *   2. Cognito redirects back to /callback with ?code=...
 *   3. /api/auth/callback exchanges code for tokens, returns id_token to client
 *   4. Client stores token in localStorage, attaches it to every request/socket
 *   5. requireAuth middleware verifies every API call
 *   6. requireAuthSocket verifies every socket connection
 *   7. sessionManager.js isolates each user's Docker process + history
 */

require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const dockerRunner = require('./services/dockerRunner');
const { requireAuth, requireAuthSocket } = require('./src/authMiddleware');
const sessionManager = require('./src/sessionManager');
let DynamoDBClient;
let DynamoDBDocumentClient;
let GetCommand;
let PutCommand;
let dynamoModulesAvailable = false;
let BedrockRuntimeClient;
let InvokeModelCommand;
let bedrockModulesAvailable = false;
try {
    ({ DynamoDBClient } = require('@aws-sdk/client-dynamodb'));
    ({ DynamoDBDocumentClient, GetCommand, PutCommand } = require('@aws-sdk/lib-dynamodb'));
    dynamoModulesAvailable = true;
} catch (_) {
    dynamoModulesAvailable = false;
}
try {
    ({ BedrockRuntimeClient, InvokeModelCommand } = require('@aws-sdk/client-bedrock-runtime'));
    bedrockModulesAvailable = true;
} catch (_) {
    bedrockModulesAvailable = false;
}

const app = express();
const server = http.createServer(app);
const DEMO_MODE = process.env.DEMO_MODE === 'true';
const isProd = process.env.NODE_ENV === 'production';
const socketAllowedOrigins = new Set(
    [process.env.APP_URL, 'http://localhost:3000', 'http://127.0.0.1:3000']
        .filter(Boolean)
);
const isPrivateOrLoopbackHostname = (hostname = '') => {
    const host = String(hostname || '').toLowerCase();
    if (!host) return false;
    if (host === 'localhost' || host === '::1' || host === '[::1]' || host.endsWith('.local')) return true;
    if (/^127\.\d+\.\d+\.\d+$/.test(host)) return true;
    if (/^10\.\d+\.\d+\.\d+$/.test(host)) return true;
    if (/^192\.168\.\d+\.\d+$/.test(host)) return true;
    const match172 = host.match(/^172\.(\d+)\.\d+\.\d+$/);
    if (match172) {
        const octet = Number(match172[1]);
        if (octet >= 16 && octet <= 31) return true;
    }
    return false;
};
const io = new Server(server, {
    cors: {
        origin: (origin, cb) => {
            // Allow server-to-server/no-origin and all origins in demo mode for local dev.
            if (!origin) return cb(null, true);
            if (DEMO_MODE) return cb(null, true);
            if (!isProd) {
                try {
                    const parsed = new URL(origin);
                    if (isPrivateOrLoopbackHostname(parsed.hostname)) {
                        return cb(null, true);
                    }
                } catch (_) {}
            }
            if (socketAllowedOrigins.has(origin)) return cb(null, true);
            return cb(new Error(`CORS blocked for origin: ${origin}`), false);
        },
        credentials: true
    },
    pingInterval: 25000,
    pingTimeout: 120000
});
const DEMO_USER = Object.freeze({
    sub: 'demo-user',
    email: 'demo@memflow.ai',
    name: 'Demo User'
});

const withOptionalDemoAuth = (authMiddleware) => {
    if (!DEMO_MODE) return authMiddleware;
    return (req, _res, next) => {
        req.user = DEMO_USER;
        next();
    };
};

const withOptionalDemoSocketAuth = (socketAuthMiddleware) => {
    if (!DEMO_MODE) return socketAuthMiddleware;
    return (socket, next) => {
        socket.user = DEMO_USER;
        next();
    };
};

const requireAuthMaybeDemo = withOptionalDemoAuth(requireAuth);
const requireAuthSocketMaybeDemo = withOptionalDemoSocketAuth(requireAuthSocket);

if (DEMO_MODE) {
    console.warn('[Auth] DEMO_MODE enabled: authentication checks are bypassed and demo user context is injected.');
}

const BEDROCK_MODEL_ID = process.env.BEDROCK_MODEL_ID || 'anthropic.claude-3-haiku-20240307-v1:0';
const bedrockEnabled = bedrockModulesAvailable && !!process.env.AWS_REGION;
const bedrockClient = bedrockEnabled
    ? new BedrockRuntimeClient({ region: process.env.AWS_REGION })
    : null;
const PROFILE_TABLE = process.env.DYNAMODB_PROFILE_TABLE || '';
const dynamoEnabled = dynamoModulesAvailable && !!PROFILE_TABLE;
const EXECUTION_MODE = (process.env.EXECUTION_MODE || 'local').toLowerCase(); // local | remote
const RUNNER_API_URL = process.env.RUNNER_API_URL || '';
const ddbDocClient = dynamoEnabled
    ? DynamoDBDocumentClient.from(new DynamoDBClient({ region: process.env.AWS_REGION || 'us-east-1' }))
    : null;
if (dynamoEnabled) {
    console.log(`[ProfileStore] DynamoDB enabled (table=${PROFILE_TABLE}).`);
} else {
    const reason = !dynamoModulesAvailable
        ? 'AWS SDK dependencies missing'
        : 'DYNAMODB_PROFILE_TABLE not set';
    console.log(`[ProfileStore] Using in-memory profile store (${reason}).`);
}
if (bedrockEnabled) {
    console.log(`[AI] AWS Bedrock enabled (model=${BEDROCK_MODEL_ID}).`);
} else {
    const reason = !bedrockModulesAvailable
        ? 'AWS Bedrock SDK dependencies missing'
        : 'AWS_REGION not set';
    console.log(`[AI] Bedrock disabled (${reason}).`);
}
if (EXECUTION_MODE === 'remote') {
    console.log(`[Runner] Remote execution enabled (${RUNNER_API_URL || 'RUNNER_API_URL missing'})`);
} else if (process.env.PREFER_LOCAL_EXECUTION === 'true') {
    console.log('[Runner] Local execution enabled (preferring host gcc).');
} else {
    console.log('[Runner] Local docker execution enabled');
}

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'), {
    etag: true,
    maxAge: isProd ? '1h' : 0,
    setHeaders: (res, filePath) => {
        const ext = path.extname(filePath).toLowerCase();
        if (ext === '.html') {
            res.setHeader('Cache-Control', 'no-store, max-age=0');
            return;
        }
        if (!isProd && (ext === '.css' || ext === '.js' || ext === '.json')) {
            res.setHeader('Cache-Control', 'no-store, max-age=0');
            return;
        }
        if (ext === '.css' || ext === '.js') {
            res.setHeader(
                'Cache-Control',
                isProd ? 'public, max-age=3600' : 'public, max-age=0, must-revalidate'
            );
        }
    }
}));
const sendAppShell = (_req, res) => {
    res.setHeader('Cache-Control', 'no-store, max-age=0');
    res.setHeader('Pragma', 'no-cache');
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
};
app.get(['/compiler', '/visualize'], sendAppShell);
app.use((req, res, next) => {
    const started = Date.now();
    res.on('finish', () => {
        const ms = Date.now() - started;
        console.log(`[HTTP] ${req.method} ${req.originalUrl} -> ${res.statusCode} (${ms}ms)`);
    });
    next();
});

const ALL_TOPIC_IDS = [
    'intro', 'syntax', 'compile', 'comments',
    'datatypes', 'variables', 'constants', 'operators',
    'ifelse', 'switch', 'for', 'while', 'dowhile', 'break',
    'functions', 'scope', 'recursion', 'args',
    'pointers', 'arrays', 'strings', 'malloc', 'ptr2d',
    'struct', 'union', 'enum', 'typedef',
    'stdio', 'fileio', 'format',
    'preprocessor', 'bitops', 'funcptr', 'memory'
];
const TOPIC_ID_SET = new Set(ALL_TOPIC_IDS);
const profiles = new Map();
const C_CONTROL_WORDS = new Set(['if', 'for', 'while', 'switch', 'return', 'do', 'else', 'case', 'sizeof']);

const FUNCTION_TO_TOPICS = {
    printf: ['stdio', 'format'],
    scanf: ['stdio', 'format'],
    malloc: ['malloc', 'pointers', 'memory'],
    calloc: ['malloc', 'memory'],
    free: ['malloc', 'memory'],
    fopen: ['fileio', 'stdio'],
    fclose: ['fileio'],
    fread: ['fileio'],
    fwrite: ['fileio'],
    fgets: ['strings', 'stdio'],
    strlen: ['strings'],
    strcpy: ['strings'],
    strcat: ['strings'],
    atoi: ['datatypes', 'operators'],
    memset: ['memory', 'arrays']
};

const TOPIC_RECOMMENDATION_SNIPPETS = {
    intro: '#include <stdio.h>\nint main() {\n    printf("Hello, MemFlow AI!\\n");\n    return 0;\n}',
    stdio: '#include <stdio.h>\nint main() {\n    int x;\n    printf("Enter x: ");\n    scanf("%d", &x);\n    printf("x = %d\\n", x);\n    return 0;\n}',
    format: '#include <stdio.h>\nint main() {\n    int age = 21;\n    float score = 91.5f;\n    printf("age=%d score=%.1f\\n", age, score);\n    return 0;\n}',
    pointers: '#include <stdio.h>\nint main() {\n    int x = 10;\n    int *p = &x;\n    *p = 42;\n    printf("x=%d *p=%d\\n", x, *p);\n    return 0;\n}',
    malloc: '#include <stdio.h>\n#include <stdlib.h>\nint main() {\n    int *arr = (int*)malloc(3 * sizeof(int));\n    if (!arr) return 1;\n    arr[0]=1; arr[1]=2; arr[2]=3;\n    printf("%d %d %d\\n", arr[0], arr[1], arr[2]);\n    free(arr);\n    return 0;\n}',
    arrays: '#include <stdio.h>\nint main() {\n    int a[4] = {2,4,6,8};\n    int i;\n    for (i = 0; i < 4; i++) printf("%d\\n", a[i]);\n    return 0;\n}',
    functions: '#include <stdio.h>\nint add(int a, int b) { return a + b; }\nint main() {\n    printf("%d\\n", add(3, 5));\n    return 0;\n}',
    for: '#include <stdio.h>\nint main() {\n    int i;\n    for (i = 0; i < 5; i++) printf("%d\\n", i);\n    return 0;\n}',
    while: '#include <stdio.h>\nint main() {\n    int i = 0;\n    while (i < 3) { printf("%d\\n", i); i++; }\n    return 0;\n}',
    strings: '#include <stdio.h>\n#include <string.h>\nint main() {\n    char s[20] = \"MemFlow\";\n    printf(\"len=%lu\\n\", strlen(s));\n    return 0;\n}',
    fileio: '#include <stdio.h>\nint main() {\n    FILE *f = fopen(\"tmp.txt\", \"w\");\n    if (!f) return 1;\n    fprintf(f, \"hello\\n\");\n    fclose(f);\n    return 0;\n}',
    memory: '#include <stdio.h>\n#include <stdlib.h>\nint main() {\n    int *p = (int*)calloc(2, sizeof(int));\n    if (!p) return 1;\n    p[0] = 7;\n    printf(\"%d\\n\", p[0]);\n    free(p);\n    return 0;\n}'
};

const SUPPORTED_PROFILE_LANGUAGES = Object.freeze({
    en: 'English',
    hi: 'Hindi',
    bn: 'Bengali',
    te: 'Telugu',
    ta: 'Tamil',
    mr: 'Marathi'
});

const LOCALIZED_TEXT = {
    en: {
        question_required: 'Question is required.',
        c_only: 'Please type C-related questions only.',
        no_response_generated: 'No response generated.',
        ai_error_prefix: 'AI Error: ',
        recommendation_foundation: 'Recommended foundational practice',
        recommendation_because_used: 'Because you used: {{items}}',
        explain_no_step: 'Run the code and select a step to get an explanation.',
        explain_step_intro: 'Step {{step}} focuses on line {{line}}.',
        explain_var_value: 'Variable `{{name}}` currently holds `{{value}}`.',
        explain_var_type: 'Observed type: `{{type}}`.',
        explain_var_addr: 'Tracked address: `{{addr}}`.',
        explain_next_focus: 'Focus on how the next statement changes memory or output.',
        local_general_title: 'C learning assistant (local fallback):',
        local_general_line1: 'Ask about pointers, loops, arrays, functions, memory, structs, or debugging.',
        local_general_line2: 'I can give syntax, examples, and step-by-step explanations.',
        local_pointer_title: 'Pointers store memory addresses, not direct values.',
        local_pointer_example: 'Example:',
        local_pointer_tip: 'Use & to get an address and * to dereference it.',
        local_memory_title: 'Dynamic memory in C:',
        local_memory_1: '1. Allocate with malloc/calloc',
        local_memory_2: '2. Check for NULL',
        local_memory_3: '3. Use memory carefully',
        local_memory_4: '4. Call free(ptr) exactly once',
        local_memory_tip: 'Avoid memory leaks and double-free errors.',
        local_loop_title: 'Loop quick guide:',
        local_loop_1: '- for: known iteration count',
        local_loop_2: '- while: condition-based iteration',
        local_loop_3: '- do-while: runs at least once',
        local_loop_tip: 'Track loop variable updates to avoid infinite loops.',
        local_function_title: 'C functions:',
        local_function_1: '- Declare return type and parameters clearly',
        local_function_2: '- Keep each function focused on one task',
        local_function_3: '- Return status/data explicitly',
        local_function_4: '- Use pointers when you need in-place updates'
    },
    hi: {
        question_required: 'प्रश्न आवश्यक है।',
        c_only: 'कृपया केवल C से जुड़े प्रश्न पूछें।',
        no_response_generated: 'कोई उत्तर तैयार नहीं हुआ।',
        ai_error_prefix: 'AI त्रुटि: ',
        recommendation_foundation: 'अनुशंसित आधारभूत अभ्यास',
        recommendation_because_used: 'क्योंकि आपने यह उपयोग किया: {{items}}',
        explain_no_step: 'विस्तृत समझ पाने के लिए कोड चलाएँ और एक स्टेप चुनें।',
        explain_step_intro: 'स्टेप {{step}} में लाइन {{line}} पर ध्यान है।',
        explain_var_value: 'वेरिएबल `{{name}}` की वर्तमान वैल्यू `{{value}}` है।',
        explain_var_type: 'देखा गया प्रकार: `{{type}}`।',
        explain_var_addr: 'ट्रैक किया गया पता: `{{addr}}`।',
        explain_next_focus: 'अगला स्टेटमेंट मेमरी या आउटपुट को कैसे बदलता है, उस पर ध्यान दें।',
        local_general_title: 'C सीखने का सहायक (लोकल फॉलबैक):',
        local_general_line1: 'पॉइंटर, लूप, एरे, फ़ंक्शन, मेमरी, स्ट्रक्ट या डिबगिंग के बारे में पूछें।',
        local_general_line2: 'मैं सिंटैक्स, उदाहरण और चरण-दर-चरण समझ दे सकता हूँ।',
        local_pointer_title: 'पॉइंटर सीधे मान नहीं, बल्कि मेमरी एड्रेस रखते हैं।',
        local_pointer_example: 'उदाहरण:',
        local_pointer_tip: 'एड्रेस पाने के लिए & और dereference करने के लिए * का उपयोग करें।',
        local_memory_title: 'C में डायनेमिक मेमरी:',
        local_memory_1: '1. malloc/calloc से मेमरी लें',
        local_memory_2: '2. NULL की जाँच करें',
        local_memory_3: '3. मेमरी का सावधानी से उपयोग करें',
        local_memory_4: '4. free(ptr) केवल एक बार कॉल करें',
        local_memory_tip: 'मेमरी लीक और double-free से बचें।',
        local_loop_title: 'लूप का त्वरित मार्गदर्शक:',
        local_loop_1: '- for: जब iteration count पता हो',
        local_loop_2: '- while: जब condition आधारित चलाना हो',
        local_loop_3: '- do-while: कम-से-कम एक बार चलता है',
        local_loop_tip: 'अनंत लूप से बचने के लिए loop variable पर नज़र रखें।',
        local_function_title: 'C फ़ंक्शन:',
        local_function_1: '- return type और parameters साफ़ रखें',
        local_function_2: '- हर function को एक काम तक सीमित रखें',
        local_function_3: '- status या data को स्पष्ट रूप से return करें',
        local_function_4: '- in-place update के लिए pointers का उपयोग करें'
    },
    bn: {
        question_required: 'প্রশ্ন দেওয়া প্রয়োজন।',
        c_only: 'অনুগ্রহ করে শুধু C-সম্পর্কিত প্রশ্ন করুন।',
        no_response_generated: 'কোনো উত্তর তৈরি হয়নি।',
        ai_error_prefix: 'AI ত্রুটি: ',
        recommendation_foundation: 'প্রস্তাবিত মৌলিক অনুশীলন',
        recommendation_because_used: 'কারণ আপনি ব্যবহার করেছেন: {{items}}',
        explain_no_step: 'ব্যাখ্যা পেতে কোড চালিয়ে একটি ধাপ নির্বাচন করুন।',
        explain_step_intro: 'ধাপ {{step}}-এ লাইন {{line}}-এর উপর ফোকাস করা হচ্ছে।',
        explain_var_value: 'ভেরিয়েবল `{{name}}`-এর বর্তমান মান `{{value}}`।',
        explain_var_type: 'দেখা টাইপ: `{{type}}`।',
        explain_var_addr: 'ট্র্যাক করা ঠিকানা: `{{addr}}`।',
        explain_next_focus: 'পরের statement কীভাবে memory বা output বদলায় তা লক্ষ্য করুন।',
        local_general_title: 'C শেখার সহায়ক (লোকাল fallback):',
        local_general_line1: 'pointer, loop, array, function, memory, struct বা debugging সম্পর্কে জিজ্ঞাসা করুন।',
        local_general_line2: 'আমি syntax, example এবং step-by-step ব্যাখ্যা দিতে পারি।',
        local_pointer_title: 'Pointer সরাসরি মান নয়, memory address ধরে রাখে।',
        local_pointer_example: 'উদাহরণ:',
        local_pointer_tip: 'address পেতে & এবং dereference করতে * ব্যবহার করুন।',
        local_memory_title: 'C-তে dynamic memory:',
        local_memory_1: '1. malloc/calloc দিয়ে allocate করুন',
        local_memory_2: '2. NULL পরীক্ষা করুন',
        local_memory_3: '3. memory সাবধানে ব্যবহার করুন',
        local_memory_4: '4. free(ptr) ঠিক একবার কল করুন',
        local_memory_tip: 'memory leak ও double-free এড়িয়ে চলুন।',
        local_loop_title: 'Loop দ্রুত নির্দেশিকা:',
        local_loop_1: '- for: iteration count জানা থাকলে',
        local_loop_2: '- while: condition-ভিত্তিক loop',
        local_loop_3: '- do-while: অন্তত একবার চলে',
        local_loop_tip: 'infinite loop এড়াতে loop variable খেয়াল রাখুন।',
        local_function_title: 'C function:',
        local_function_1: '- return type ও parameter স্পষ্ট রাখুন',
        local_function_2: '- প্রতিটি function-কে এক কাজের মধ্যে সীমাবদ্ধ রাখুন',
        local_function_3: '- status/data স্পষ্টভাবে return করুন',
        local_function_4: '- in-place update লাগলে pointer ব্যবহার করুন'
    },
    te: {
        question_required: 'ప్రశ్న అవసరం.',
        c_only: 'దయచేసి C‌కు సంబంధించిన ప్రశ్నలనే అడగండి.',
        no_response_generated: 'ఎటువంటి సమాధానం రూపొందలేదు.',
        ai_error_prefix: 'AI లోపం: ',
        recommendation_foundation: 'సూచించిన ప్రాథమిక సాధన',
        recommendation_because_used: 'మీరు ఇవి ఉపయోగించినందున: {{items}}',
        explain_no_step: 'వివరణ కోసం కోడ్‌ను రన్ చేసి ఒక స్టెప్‌ను ఎంచుకోండి.',
        explain_step_intro: 'స్టెప్ {{step}} లో లైన్ {{line}} పై దృష్టి ఉంది.',
        explain_var_value: 'వేరియబుల్ `{{name}}` ప్రస్తుత విలువు `{{value}}`.',
        explain_var_type: 'గమనించిన రకం: `{{type}}`.',
        explain_var_addr: 'ట్రాక్ చేసిన అడ్రస్: `{{addr}}`.',
        explain_next_focus: 'తర్వాతి స్టేట్‌మెంట్ memory లేదా output‌ను ఎలా మార్చుతుందో చూడండి.',
        local_general_title: 'C అభ్యాస సహాయకుడు (లోకల్ ఫాల్‌బ్యాక్):',
        local_general_line1: 'pointerలు, loopలు, arrayలు, functionలు, memory, structలు లేదా debugging గురించి అడగండి.',
        local_general_line2: 'నేను syntax, ఉదాహరణలు మరియు step-by-step వివరణలు ఇవ్వగలను.',
        local_pointer_title: 'Pointerలు నేరుగా values కాదు, memory addressలను నిల్వ చేస్తాయి.',
        local_pointer_example: 'ఉదాహరణ:',
        local_pointer_tip: 'address కోసం & మరియు dereference కోసం * ఉపయోగించండి.',
        local_memory_title: 'C లో dynamic memory:',
        local_memory_1: '1. malloc/calloc తో allocate చేయండి',
        local_memory_2: '2. NULL ను పరిశీలించండి',
        local_memory_3: '3. memoryను జాగ్రత్తగా ఉపయోగించండి',
        local_memory_4: '4. free(ptr) ను ఒక్కసారి మాత్రమే కాల్ చేయండి',
        local_memory_tip: 'memory leak మరియు double-free తప్పించండి.',
        local_loop_title: 'Loop త్వరిత గైడ్:',
        local_loop_1: '- for: iterations సంఖ్య తెలిసినప్పుడు',
        local_loop_2: '- while: condition ఆధారంగా',
        local_loop_3: '- do-while: కనీసం ఒకసారి నడుస్తుంది',
        local_loop_tip: 'infinite loop రాకుండా loop variable మార్పులను గమనించండి.',
        local_function_title: 'C functions:',
        local_function_1: '- return type మరియు parameters స్పష్టంగా ఉంచండి',
        local_function_2: '- ప్రతి function ఒకే పనిపై కేంద్రీకరించండి',
        local_function_3: '- status/data ను స్పష్టంగా return చేయండి',
        local_function_4: '- in-place updates కోసం pointers ఉపయోగించండి'
    },
    ta: {
        question_required: 'கேள்வி அவசியம்.',
        c_only: 'C தொடர்பான கேள்விகளை மட்டும் கேளுங்கள்.',
        no_response_generated: 'பதில் உருவாக்கப்படவில்லை.',
        ai_error_prefix: 'AI பிழை: ',
        recommendation_foundation: 'பரிந்துரைக்கப்பட்ட அடிப்படை பயிற்சி',
        recommendation_because_used: 'நீங்கள் இதைப் பயன்படுத்தியதால்: {{items}}',
        explain_no_step: 'விளக்கம் பெற code-ஐ run செய்து ஒரு step-ஐத் தேர்ந்தெடுக்கவும்.',
        explain_step_intro: 'Step {{step}} இல் line {{line}} மீது கவனம் உள்ளது.',
        explain_var_value: 'Variable `{{name}}` இன் தற்போதைய value `{{value}}`.',
        explain_var_type: 'கவனிக்கப்பட்ட வகை: `{{type}}`.',
        explain_var_addr: 'பதிவான முகவரி: `{{addr}}`.',
        explain_next_focus: 'அடுத்த statement memory அல்லது output-ஐ எப்படி மாற்றுகிறது என்பதை கவனிக்கவும்.',
        local_general_title: 'C கற்றல் உதவியாளர் (local fallback):',
        local_general_line1: 'pointer, loop, array, function, memory, struct அல்லது debugging பற்றி கேளுங்கள்.',
        local_general_line2: 'நான் syntax, examples மற்றும் படிப்படியாக விளக்கம் தரலாம்.',
        local_pointer_title: 'Pointer-கள் நேரடி values அல்ல, memory address-களை வைத்திருக்கும்.',
        local_pointer_example: 'உதாரணம்:',
        local_pointer_tip: 'address பெற & மற்றும் dereference செய்ய * பயன்படுத்தவும்.',
        local_memory_title: 'C-இல் dynamic memory:',
        local_memory_1: '1. malloc/calloc மூலம் allocate செய்யவும்',
        local_memory_2: '2. NULL ஐ சரிபார்க்கவும்',
        local_memory_3: '3. memory-ஐ கவனமாகப் பயன்படுத்தவும்',
        local_memory_4: '4. free(ptr) ஐ ஒருமுறை மட்டுமே அழைக்கவும்',
        local_memory_tip: 'memory leak மற்றும் double-free தவிர்க்கவும்.',
        local_loop_title: 'Loop விரைவு வழிகாட்டி:',
        local_loop_1: '- for: iteration count தெரிந்தால்',
        local_loop_2: '- while: condition அடிப்படையில்',
        local_loop_3: '- do-while: குறைந்தது ஒருமுறை இயங்கும்',
        local_loop_tip: 'infinite loop தவிர்க்க loop variable மாற்றங்களை கவனியுங்கள்.',
        local_function_title: 'C functions:',
        local_function_1: '- return type மற்றும் parameters தெளிவாக இருக்கட்டும்',
        local_function_2: '- ஒவ்வொரு function-ஐ ஒரு வேலையிலேயே வைத்திருங்கள்',
        local_function_3: '- status/data-ஐ தெளிவாக return செய்யுங்கள்',
        local_function_4: '- in-place update க்கு pointers பயன்படுத்துங்கள்'
    },
    mr: {
        question_required: 'प्रश्न आवश्यक आहे.',
        c_only: 'कृपया फक्त C-संबंधित प्रश्न विचारा.',
        no_response_generated: 'कोणतेही उत्तर तयार झाले नाही.',
        ai_error_prefix: 'AI त्रुटी: ',
        recommendation_foundation: 'शिफारस केलेला मूलभूत सराव',
        recommendation_because_used: 'कारण तुम्ही हे वापरले: {{items}}',
        explain_no_step: 'स्पष्टीकरणासाठी कोड चालवा आणि एक step निवडा.',
        explain_step_intro: 'Step {{step}} मध्ये line {{line}} वर लक्ष आहे.',
        explain_var_value: 'Variable `{{name}}` ची सध्याची value `{{value}}` आहे.',
        explain_var_type: 'दिसलेला प्रकार: `{{type}}`.',
        explain_var_addr: 'ट्रॅक केलेला address: `{{addr}}`.',
        explain_next_focus: 'पुढील statement memory किंवा output कसा बदलतो ते पाहा.',
        local_general_title: 'C शिकण्याचा सहाय्यक (local fallback):',
        local_general_line1: 'pointer, loop, array, function, memory, struct किंवा debugging बद्दल विचारा.',
        local_general_line2: 'मी syntax, examples आणि step-by-step स्पष्टीकरण देऊ शकतो.',
        local_pointer_title: 'Pointer थेट values नाहीत; ते memory address साठवतात.',
        local_pointer_example: 'उदाहरण:',
        local_pointer_tip: 'address मिळवण्यासाठी & आणि dereference साठी * वापरा.',
        local_memory_title: 'C मधील dynamic memory:',
        local_memory_1: '1. malloc/calloc ने allocate करा',
        local_memory_2: '2. NULL तपासा',
        local_memory_3: '3. memory काळजीपूर्वक वापरा',
        local_memory_4: '4. free(ptr) एकदाच कॉल करा',
        local_memory_tip: 'memory leak आणि double-free टाळा.',
        local_loop_title: 'Loop झटपट मार्गदर्शक:',
        local_loop_1: '- for: iteration count माहीत असताना',
        local_loop_2: '- while: condition आधारित loop',
        local_loop_3: '- do-while: किमान एकदा चालतो',
        local_loop_tip: 'infinite loop टाळण्यासाठी loop variable बदल लक्षात ठेवा.',
        local_function_title: 'C functions:',
        local_function_1: '- return type आणि parameters स्पष्ट ठेवा',
        local_function_2: '- प्रत्येक function एकाच कामावर केंद्रित ठेवा',
        local_function_3: '- status/data स्पष्टपणे return करा',
        local_function_4: '- in-place update साठी pointers वापरा'
    }
};

function normalizePreferredLanguage(value) {
    const code = String(value || '').trim().toLowerCase();
    return SUPPORTED_PROFILE_LANGUAGES[code] ? code : 'en';
}

function localizeText(language, key, vars = {}) {
    const lang = normalizePreferredLanguage(language);
    const template = (LOCALIZED_TEXT[lang] && LOCALIZED_TEXT[lang][key])
        || LOCALIZED_TEXT.en[key]
        || '';
    return template.replace(/\{\{(\w+)\}\}/g, (_m, name) => (
        Object.prototype.hasOwnProperty.call(vars, name) ? String(vars[name]) : ''
    ));
}

function languageInstruction(language) {
    const name = SUPPORTED_PROFILE_LANGUAGES[normalizePreferredLanguage(language)];
    return `Respond in ${name}. Keep C code, code blocks, variable names, memory addresses, compiler text, and format specifiers unchanged unless the user explicitly asks to translate them.`;
}

function buildLocalizedRecommendationReason(language, usedFns) {
    return localizeText(language, 'recommendation_because_used', { items: usedFns.join(', ') });
}

function generateLocalStepExplanation({ language, step, currentStepIndex }) {
    const lang = normalizePreferredLanguage(language);
    if (!step) {
        return localizeText(lang, 'explain_no_step');
    }
    const lines = [
        localizeText(lang, 'explain_step_intro', {
            step: currentStepIndex + 1,
            line: step.line ?? '?'
        })
    ];
    if (step.name) {
        lines.push(localizeText(lang, 'explain_var_value', {
            name: step.name,
            value: String(step.val ?? '')
        }));
    }
    if (step.type) {
        lines.push(localizeText(lang, 'explain_var_type', { type: step.type }));
    }
    if (step.addr) {
        lines.push(localizeText(lang, 'explain_var_addr', { addr: step.addr }));
    }
    lines.push(localizeText(lang, 'explain_next_focus'));
    return lines.join('\n');
}

function ensureProfile(user) {
    const profile = {
        userId: user.sub,
        name: user.name || (user.email ? user.email.split('@')[0] : 'Learner'),
        email: user.email || 'local@user.dev',
        theme: 'dark',
        preferredLanguage: 'en',
        completedTopics: new Set(),
        functionUsage: {},
        recommendedTopics: [],
        lastExecutionHistory: [],
        chatSessions: []
    };
    updateProfileRecommendations(profile);
    return profile;
}

function sanitizeChatSessions(rawSessions) {
    if (!Array.isArray(rawSessions)) return [];
    return rawSessions
        .filter(session => session && typeof session === 'object')
        .slice(0, 20)
        .map((session, idx) => {
            const rawMessages = Array.isArray(session.messages) ? session.messages : [];
            return {
                id: String(session.id || `chat-${Date.now()}-${idx}`).slice(0, 80),
                title: String(session.title || 'Chat').slice(0, 120),
                messages: rawMessages
                    .filter(msg =>
                        msg &&
                        (msg.role === 'user' || msg.role === 'assistant') &&
                        typeof msg.content === 'string'
                    )
                    .slice(-100)
                    .map(msg => ({
                        role: msg.role,
                        content: String(msg.content).slice(0, 12000)
                    }))
            };
        });
}

function hydrateProfile(raw) {
    if (!raw) return null;
    const profile = {
        userId: raw.userId,
        name: raw.name || (raw.email ? raw.email.split('@')[0] : 'Learner'),
        email: raw.email || 'local@user.dev',
        theme: raw.theme === 'light' ? 'light' : 'dark',
        preferredLanguage: normalizePreferredLanguage(raw.preferredLanguage),
        completedTopics: new Set(Array.isArray(raw.completedTopics) ? raw.completedTopics : []),
        functionUsage: raw.functionUsage && typeof raw.functionUsage === 'object' ? raw.functionUsage : {},
        recommendedTopics: Array.isArray(raw.recommendedTopics) ? raw.recommendedTopics : [],
        lastExecutionHistory: Array.isArray(raw.lastExecutionHistory) ? raw.lastExecutionHistory : [],
        chatSessions: sanitizeChatSessions(raw.chatSessions)
    };
    updateProfileRecommendations(profile);
    return profile;
}

function toStoredProfile(profile) {
    return {
        userId: profile.userId,
        name: profile.name,
        email: profile.email,
        theme: profile.theme,
        preferredLanguage: normalizePreferredLanguage(profile.preferredLanguage),
        completedTopics: [...profile.completedTopics],
        functionUsage: profile.functionUsage,
        recommendedTopics: profile.recommendedTopics,
        lastExecutionHistory: profile.lastExecutionHistory || [],
        chatSessions: sanitizeChatSessions(profile.chatSessions)
    };
}

async function loadProfileFromDynamo(userId) {
    if (!dynamoEnabled) return null;
    try {
        const out = await ddbDocClient.send(new GetCommand({
            TableName: PROFILE_TABLE,
            Key: { userId }
        }));
        return hydrateProfile(out.Item);
    } catch (err) {
        console.error('[DynamoDB] get profile failed:', err.message);
        return null;
    }
}

async function saveProfileToDynamo(profile) {
    if (!dynamoEnabled) return;
    try {
        await ddbDocClient.send(new PutCommand({
            TableName: PROFILE_TABLE,
            Item: toStoredProfile(profile)
        }));
    } catch (err) {
        console.error('[DynamoDB] put profile failed:', err.message);
    }
}

async function ensureProfileForUser(user) {
    const cached = profiles.get(user.sub);
    if (cached) {
        if (user.email) cached.email = user.email;
        if (user.name) cached.name = user.name;
        return cached;
    }

    const loaded = await loadProfileFromDynamo(user.sub);
    if (loaded) {
        if (user.email) loaded.email = user.email;
        if (user.name) loaded.name = user.name;
        profiles.set(user.sub, loaded);
        return loaded;
    }

    const created = ensureProfile(user);
    profiles.set(user.sub, created);
    await saveProfileToDynamo(created);
    return created;
}

async function persistProfile(profile) {
    profiles.set(profile.userId, profile);
    await saveProfileToDynamo(profile);
}

function emitToUser(userId, eventName, payload) {
    const socketId = resolveSocketIdForUser(userId);
    if (!socketId) return false;
    io.to(socketId).emit(eventName, payload);
    return true;
}

function resolveSocketIdForUser(userId, requestedSocketId = '') {
    const candidate = String(requestedSocketId || '').trim();
    if (candidate) {
        const requestedSocket = io.sockets.sockets.get(candidate);
        if (requestedSocket?.user?.sub === userId) {
            return candidate;
        }
    }

    const session = sessionManager.getSession(userId);
    const currentSocketId = String(session?.socketId || '').trim();
    if (!currentSocketId) return null;

    const activeSocket = io.sockets.sockets.get(currentSocketId);
    if (activeSocket?.user?.sub === userId) {
        return currentSocketId;
    }
    return null;
}

function emitOutput(userId, payload) {
    return emitToUser(userId, 'output', payload);
}

function appendOutputToSocketWithHistory(userId, chunk) {
    const text = chunk.toString();
    emitOutput(userId, text);

    const session = sessionManager.getSession(userId);
    if (!session) return;
    const lines = text.split('\n');
    for (const line of lines) {
        if (!line.startsWith('__STEP__')) continue;
        try {
            const stepData = JSON.parse(line.slice('__STEP__'.length));
            sessionManager.addStep(userId, stepData);
        } catch (_) {}
    }
}

async function runCodeViaRemoteRunner(userId, code) {
    if (!RUNNER_API_URL) {
        emitOutput(userId, '❌ Remote runner not configured: set RUNNER_API_URL.\n__DONE__\n');
        return;
    }
    try {
        const resp = await axios.post(`${RUNNER_API_URL.replace(/\/$/, '')}/execute`, { code }, { timeout: 35000 });
        const data = resp.data || {};
        const outputLines = Array.isArray(data.outputLines) ? data.outputLines : [];
        const steps = Array.isArray(data.steps) ? data.steps : [];

        for (const line of outputLines) emitOutput(userId, `${line}\n`);
        for (const step of steps) {
            sessionManager.addStep(userId, step);
            emitOutput(userId, `__STEP__${JSON.stringify(step)}\n`);
        }
        emitOutput(userId, '__DONE__\n');
    } catch (err) {
        emitOutput(userId, `❌ Remote runner failed: ${err.message}\n__DONE__\n`);
    }
}

async function persistLastHistory(userId) {
    const profile = profiles.get(userId);
    if (!profile) return;
    const history = sessionManager.getHistory(userId);
    profile.lastExecutionHistory = Array.isArray(history) ? history.slice(-600) : [];
    await persistProfile(profile);
}

async function executeUserRun({ userId, email, name, sourceCode }) {
    const activeSession = sessionManager.getSession(userId);
    if (!activeSession?.socketId) {
        return { ok: false, error: 'No active socket connection for this user.' };
    }

    sessionManager.startNewRun(userId);
    sessionManager.createOrUpdateSession(userId, email, activeSession.socketId);
    emitOutput(userId, '⚙️ Backend: preparing workspace...\n');

    try {
        const normalizedSource = String(sourceCode || '');
        const profile = profiles.get(userId) || await ensureProfileForUser({ sub: userId, email, name });
        updateProfileFunctionUsage(profile, normalizedSource);
        await persistProfile(profile);

        const unsupportedCommands = detectUnsupportedCommands(normalizedSource);
        if (unsupportedCommands.length > 0) {
            emitOutput(
                userId,
                `⚠️ Partial instrumentation warning:\nThese calls may not be fully instrumented yet: ${unsupportedCommands.join(', ')}.\nExecution will continue.\n`
            );
        }

        if (EXECUTION_MODE === 'remote') {
            const finalCode = instrumentCode(normalizedSource);
            await runCodeViaRemoteRunner(userId, finalCode);
            return { ok: true };
        }

        let instrumentedRun = true;
        let backendNoticeEmitted = false;
        const finalCode = instrumentCode(normalizedSource);
        let workspace = dockerRunner.createWorkspace(finalCode);
        sessionManager.setTmpDir(userId, workspace.tmpDir);
        emitOutput(userId, `⚙️ Backend: compiling instrumented code in ${workspace.tmpDir}\n`);

        let compileResult = await dockerRunner.compileWorkspace(workspace);
        if (compileResult.backendNotice && !backendNoticeEmitted) {
            emitOutput(userId, `${compileResult.backendNotice}\n`);
            backendNoticeEmitted = true;
        }
        if (!compileResult.success) {
            const rawWorkspace = dockerRunner.createWorkspace(normalizedSource);
            emitOutput(userId, `⚙️ Backend: instrumented compile failed, trying raw compile in ${rawWorkspace.tmpDir}\n`);
            const rawCompileResult = await dockerRunner.compileWorkspace(rawWorkspace, compileResult.backend);
            if (rawCompileResult.backendNotice && !backendNoticeEmitted) {
                emitOutput(userId, `${rawCompileResult.backendNotice}\n`);
                backendNoticeEmitted = true;
            }
            if (!rawCompileResult.success) {
                const errorText = [
                    '❌ Compiler Error (instrumented):',
                    compileResult.compilerOutput || '',
                    '',
                    '❌ Compiler Error (raw source):',
                    rawCompileResult.compilerOutput || ''
                ].join('\n');
                emitOutput(userId, `${errorText}\n__DONE__\n`);
                return { ok: false, error: 'Compilation failed.' };
            }

            instrumentedRun = false;
            if (
                workspace?.tmpDir &&
                rawWorkspace?.tmpDir &&
                workspace.tmpDir !== rawWorkspace.tmpDir &&
                fs.existsSync(workspace.tmpDir)
            ) {
                try { fs.rmSync(workspace.tmpDir, { recursive: true, force: true }); } catch (_) {}
            }
            workspace = rawWorkspace;
            compileResult = rawCompileResult;
            sessionManager.setTmpDir(userId, workspace.tmpDir);
            emitOutput(userId, '⚠️ Instrumentation fallback enabled. Running raw C executable with line-level visualization.\n');
            const fallbackSteps = buildFallbackExecutionSteps(normalizedSource);
            for (const step of fallbackSteps) {
                sessionManager.addStep(userId, step);
                emitOutput(userId, `__STEP__${JSON.stringify(step)}\n`);
            }
        }

        const compiledBinary = path.join(workspace.tmpDir, 'prog');
        if (!fs.existsSync(compiledBinary)) {
            emitOutput(userId, '❌ Runtime binary missing: /workspace/prog was not generated.\n__DONE__\n');
            return { ok: false, error: 'Runtime binary missing.' };
        }

        const runtime = dockerRunner.spawnExecution(workspace, compileResult.backend);
        if (!runtime.ok) {
            emitOutput(userId, `❌ ${runtime.error}\n__DONE__\n`);
            return { ok: false, error: runtime.error };
        }

        const child = runtime.child;
        emitOutput(
            userId,
            compileResult.backend === 'local'
                ? '⚙️ Backend: starting local runtime process...\n'
                : '⚙️ Backend: starting runtime container...\n'
        );

        sessionManager.setActiveChild(userId, child);

        const execTimeout = setTimeout(() => {
            child.kill();
            emitOutput(userId, '\n⏱️ Execution timed out (30s limit). Infinite loop or waiting for input too long?\n__DONE__\n');
        }, 30000);

        child.stdout.on('data', (d) => {
            if (instrumentedRun) {
                appendOutputToSocketWithHistory(userId, d);
                return;
            }
            emitOutput(userId, d.toString());
        });

        child.stderr.on('data', (d) => {
            emitOutput(userId, '⚠️ ' + d.toString());
        });

        child.on('error', (err) => {
            clearTimeout(execTimeout);
            if (compileResult.backend === 'local') {
                emitOutput(userId, `\n❌ Local runner failed: ${err.message}\n__DONE__\n`);
                return;
            }
            emitOutput(userId, `\n❌ Docker failed: ${err.message}\nIs Docker running? Try: docker ps\n__DONE__\n`);
        });

        child.on('close', async (code) => {
            clearTimeout(execTimeout);
            emitOutput(userId, `\n✅ Execution complete (exit ${code}).\n__DONE__\n`);
            sessionManager.setActiveChild(userId, null);
            const tmpDir = sessionManager.getSession(userId)?.tmpDir;
            if (tmpDir && fs.existsSync(tmpDir)) {
                fs.rmSync(tmpDir, { recursive: true, force: true });
            }
            sessionManager.setTmpDir(userId, null);
        });

        return { ok: true };
    } catch (err) {
        emitOutput(userId, 'SERVER ERROR: ' + err.message + '\n__DONE__\n');
        return { ok: false, error: err.message };
    }
}

function extractFunctionCalls(code) {
    const stripped = code
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .split('\n')
        .map(line => line.replace(/\/\/.*$/, ''));

    const fns = new Set();
    for (const raw of stripped) {
        const line = raw.trim();
        if (!line || line.startsWith('#')) continue;
        const matches = line.matchAll(/\b([a-zA-Z_]\w*)\s*\(/g);
        for (const m of matches) {
            const fn = m[1];
            if (C_CONTROL_WORDS.has(fn)) continue;
            if (fn === 'main') continue;
            fns.add(fn);
        }
    }
    return [...fns];
}

function updateProfileFunctionUsage(profile, code) {
    const fns = extractFunctionCalls(code || '');
    for (const fn of fns) {
        profile.functionUsage[fn] = (profile.functionUsage[fn] || 0) + 1;
    }
    updateProfileRecommendations(profile);
}

function updateProfileRecommendations(profile) {
    const lang = normalizePreferredLanguage(profile.preferredLanguage);
    const score = {};
    const reasons = {};
    for (const [fn, count] of Object.entries(profile.functionUsage || {})) {
        const topics = FUNCTION_TO_TOPICS[fn] || [];
        for (const topicId of topics) {
            score[topicId] = (score[topicId] || 0) + count;
            reasons[topicId] = reasons[topicId] || new Set();
            reasons[topicId].add(fn);
        }
    }

    const ranked = Object.entries(score)
        .map(([topicId, s]) => {
            const completedPenalty = profile.completedTopics.has(topicId) ? 0.4 : 1;
            return [topicId, s * completedPenalty];
        })
        .sort((a, b) => b[1] - a[1])
        .map(([topicId]) => topicId);

    const fallback = ['intro', 'variables', 'for', 'pointers'];
    const merged = [...new Set([...ranked, ...fallback])].slice(0, 4);
    profile.recommendedTopics = merged.map(topicId => ({
        topicId,
        reason: (reasons[topicId] && reasons[topicId].size > 0)
            ? buildLocalizedRecommendationReason(lang, [...reasons[topicId]].slice(0, 2))
            : localizeText(lang, 'recommendation_foundation'),
        sampleCode: TOPIC_RECOMMENDATION_SNIPPETS[topicId] || TOPIC_RECOMMENDATION_SNIPPETS.intro
    }));
}

function serializeProfile(profile) {
    const completedTopics = [...profile.completedTopics];
    const totalTopics = ALL_TOPIC_IDS.length;
    const progressPercent = Math.min(100, Math.round((completedTopics.length / totalTopics) * 100));
    return {
        userId: profile.userId,
        name: profile.name,
        email: profile.email,
        theme: profile.theme,
        preferredLanguage: normalizePreferredLanguage(profile.preferredLanguage),
        completedTopics,
        completedCount: completedTopics.length,
        totalTopics,
        progressPercent,
        functionUsage: profile.functionUsage,
        recommendedTopics: profile.recommendedTopics || []
    };
}

function isCRelatedQuestion(text) {
    const q = String(text || '').toLowerCase();
    if (!q) return false;
    const cPatterns = [
        /\bc\b/,
        /c language|c programming/,
        /\bgcc\b|printf|scanf|malloc|calloc|free/,
        /pointer|array|struct|enum|typedef/,
        /\bfor\b|\bwhile\b|\bdo\b|\bif\b|\bswitch\b/,
        /function|segmentation fault|stack|heap|#include|main\s*\(/
    ];
    return cPatterns.some(re => re.test(q));
}

function generateLocalModeChatAnswer(question, language = 'en') {
    const lang = normalizePreferredLanguage(language);
    const q = String(question || '').trim();
    const lower = q.toLowerCase();
    if (!isCRelatedQuestion(q)) {
        return localizeText(lang, 'c_only');
    }
    if (/pointer/.test(lower)) {
        return [
            localizeText(lang, 'local_pointer_title'),
            localizeText(lang, 'local_pointer_example'),
            'int x = 10;',
            'int *p = &x;',
            '*p = 42; // now x is 42',
            localizeText(lang, 'local_pointer_tip')
        ].join('\n');
    }
    if (/malloc|calloc|free|dynamic memory/.test(lower)) {
        return [
            localizeText(lang, 'local_memory_title'),
            localizeText(lang, 'local_memory_1'),
            localizeText(lang, 'local_memory_2'),
            localizeText(lang, 'local_memory_3'),
            localizeText(lang, 'local_memory_4'),
            localizeText(lang, 'local_memory_tip')
        ].join('\n');
    }
    if (/for|while|loop/.test(lower)) {
        return [
            localizeText(lang, 'local_loop_title'),
            localizeText(lang, 'local_loop_1'),
            localizeText(lang, 'local_loop_2'),
            localizeText(lang, 'local_loop_3'),
            localizeText(lang, 'local_loop_tip')
        ].join('\n');
    }
    if (/function|return|argument|parameter/.test(lower)) {
        return [
            localizeText(lang, 'local_function_title'),
            localizeText(lang, 'local_function_1'),
            localizeText(lang, 'local_function_2'),
            localizeText(lang, 'local_function_3'),
            localizeText(lang, 'local_function_4')
        ].join('\n');
    }
    return [
        localizeText(lang, 'local_general_title'),
        localizeText(lang, 'local_general_line1'),
        localizeText(lang, 'local_general_line2')
    ].join('\n');
}

async function generateWithBedrock({ systemPrompt, userPrompt, maxTokens = 1200, temperature = 0.3 }) {
    if (!bedrockEnabled) {
        throw new Error('Bedrock is not configured. Set AWS_REGION and install Bedrock SDK dependencies.');
    }
    const payload = {
        anthropic_version: 'bedrock-2023-05-31',
        system: systemPrompt,
        max_tokens: maxTokens,
        temperature,
        messages: [
            { role: 'user', content: [{ type: 'text', text: userPrompt }] }
        ]
    };

    const resp = await bedrockClient.send(new InvokeModelCommand({
        modelId: BEDROCK_MODEL_ID,
        contentType: 'application/json',
        accept: 'application/json',
        body: JSON.stringify(payload)
    }));

    const body = JSON.parse(Buffer.from(resp.body).toString('utf8'));
    const text = Array.isArray(body.content)
        ? body.content.map(part => part.text || '').join('\n').trim()
        : '';
    return text || localizeText('en', 'no_response_generated');
}

// ── AUTH ROUTES (no auth required) ────────────────────────────────────────────

app.get('/health', (_req, res) => {
    res.status(200).json({ ok: true, service: 'memflow-ai' });
});

/**
 * GET /api/auth/config
 * Returns Cognito config needed by the frontend to build the login URL.
 * Never exposes the client secret.
 */
app.get('/api/auth/config', (req, res) => {
    if (DEMO_MODE) {
        return res.json({ demoMode: true });
    }

    res.json({
        region: process.env.AWS_REGION,
        userPoolId: process.env.COGNITO_USER_POOL_ID,
        clientId: process.env.COGNITO_CLIENT_ID,
        domain: process.env.COGNITO_DOMAIN,         // e.g. memflowai.auth.us-east-1.amazoncognito.com
        redirectUri: process.env.COGNITO_REDIRECT_URI // e.g. https://yourdomain.com/callback
    });
});

/**
 * POST /api/auth/callback
 * Exchanges Cognito authorization code for tokens (code → id_token + refresh_token).
 * The client_secret is kept server-side and never sent to the browser.
 */
app.post('/api/auth/callback', async (req, res) => {
    const { code } = req.body;
    if (!code) return res.status(400).json({ error: 'Missing authorization code' });

    try {
        const params = new URLSearchParams({
            grant_type: 'authorization_code',
            client_id: process.env.COGNITO_CLIENT_ID,
            client_secret: process.env.COGNITO_CLIENT_SECRET,
            redirect_uri: process.env.COGNITO_REDIRECT_URI,
            code
        });

        const tokenRes = await axios.post(
            `https://${process.env.COGNITO_DOMAIN}/oauth2/token`,
            params.toString(),
            { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        );

        res.json({
            idToken: tokenRes.data.id_token,
            accessToken: tokenRes.data.access_token,
            refreshToken: tokenRes.data.refresh_token,
            expiresIn: tokenRes.data.expires_in
        });
    } catch (err) {
        console.error('Token exchange error:', err.response?.data || err.message);
        res.status(500).json({ error: 'Token exchange failed' });
    }
});

/**
 * POST /api/auth/refresh
 * Exchanges a refresh_token for a new id_token (silent token renewal).
 */
app.post('/api/auth/refresh', async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ error: 'Missing refreshToken' });

    try {
        const params = new URLSearchParams({
            grant_type: 'refresh_token',
            client_id: process.env.COGNITO_CLIENT_ID,
            client_secret: process.env.COGNITO_CLIENT_SECRET,
            refresh_token: refreshToken
        });

        const tokenRes = await axios.post(
            `https://${process.env.COGNITO_DOMAIN}/oauth2/token`,
            params.toString(),
            { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        );

        res.json({
            idToken: tokenRes.data.id_token,
            accessToken: tokenRes.data.access_token,
            expiresIn: tokenRes.data.expires_in
        });
    } catch (err) {
        res.status(500).json({ error: 'Token refresh failed' });
    }
});

// ── PROTECTED API ROUTES (requireAuth middleware validates JWT) ────────────────

app.post('/api/chat', requireAuthMaybeDemo, async (req, res) => {
    try {
        const profile = profiles.get(req.user.sub) || await ensureProfileForUser(req.user);
        const preferredLanguage = normalizePreferredLanguage(
            req.body?.preferredLanguage || profile?.preferredLanguage
        );
        const question = String(req.body?.question || '').trim();
        if (!question) {
            return res.status(400).json({ answer: localizeText(preferredLanguage, 'question_required') });
        }
        if (!isCRelatedQuestion(question)) {
            return res.json({ answer: localizeText(preferredLanguage, 'c_only') });
        }

        if (!bedrockEnabled) {
            return res.json({ answer: generateLocalModeChatAnswer(question, preferredLanguage) });
        }

        const recentMessages = Array.isArray(req.body?.messages)
            ? req.body.messages
                .filter(m => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
                .slice(-6)
            : [];
        const shortContext = recentMessages
            .map(m => `${m.role}: ${m.content}`.trim())
            .join('\n');

        const asksFor7DayPlan = /7\s*day|seven\s*day/i.test(question) && /plan/i.test(question) && /c\b/i.test(question.toLowerCase());
        const systemPrompt = asksFor7DayPlan
            ? `You are a strict C learning coach. Return a detailed 7-day C learning plan with Day 1..Day 7 sections, daily goals, topics, exercises, and one mini-project by Day 7. Use clear bullet points and practical steps. ${languageInstruction(preferredLanguage)}`
            : `You are a practical C programming mentor. Give concise, accurate, structured guidance with examples. ${languageInstruction(preferredLanguage)}`;

        const basePrompt = asksFor7DayPlan
            ? `Create a complete 7-day C learning plan. Include:
1) daily schedule,
2) core topics,
3) coding drills,
4) checkpoints,
5) expected outcomes.
User request: ${question}`
            : question;
        const userPrompt = shortContext
            ? `Recent conversation (last turns):\n${shortContext}\n\nCurrent user question:\n${basePrompt}`
            : basePrompt;

        const answer = await generateWithBedrock({
            systemPrompt,
            userPrompt,
            maxTokens: asksFor7DayPlan ? 2200 : 1000,
            temperature: asksFor7DayPlan ? 0.4 : 0.3
        });

        res.json({ answer });
    } catch (err) {
        const profile = profiles.get(req.user.sub) || await ensureProfileForUser(req.user);
        const preferredLanguage = normalizePreferredLanguage(profile?.preferredLanguage);
        res.status(500).json({ answer: localizeText(preferredLanguage, 'ai_error_prefix') + err.message });
    }
});

app.post('/api/explain-logic', requireAuthMaybeDemo, async (req, res) => {
    try {
        const profile = profiles.get(req.user.sub) || await ensureProfileForUser(req.user);
        const preferredLanguage = normalizePreferredLanguage(
            req.body?.preferredLanguage || profile?.preferredLanguage
        );
        const { code, history, currentStepIndex } = req.body;
        const idx = Number.isInteger(currentStepIndex) ? currentStepIndex : 0;
        const step = Array.isArray(history) && history[idx] ? history[idx] : null;

        if (!bedrockEnabled) {
            return res.json({
                explanation: generateLocalStepExplanation({
                    language: preferredLanguage,
                    step,
                    currentStepIndex: idx
                })
            });
        }

        const explanation = await generateWithBedrock({
            systemPrompt: `You are a C debugger tutor. Explain code execution at a specific step clearly and concretely for beginners. Mention variable values and what changes next. ${languageInstruction(preferredLanguage)}`,
            userPrompt: `Code:\n${code || ''}\n\nCurrent step index: ${idx}\nStep payload: ${JSON.stringify(step)}\n\nExplain what this step means and what to focus on.`,
            maxTokens: 900,
            temperature: 0.2
        });

        res.json({ explanation });
    } catch (err) {
        const profile = profiles.get(req.user.sub) || await ensureProfileForUser(req.user);
        const preferredLanguage = normalizePreferredLanguage(profile?.preferredLanguage);
        res.status(500).json({ explanation: localizeText(preferredLanguage, 'ai_error_prefix') + err.message });
    }
});

app.get('/api/profile', requireAuthMaybeDemo, async (req, res) => {
    await ensureProfileForUser(req.user);
    const profile = profiles.get(req.user.sub);
    res.json(serializeProfile(profile || ensureProfile(req.user)));
});

app.post('/api/profile/theme', requireAuthMaybeDemo, async (req, res) => {
    await ensureProfileForUser(req.user);
    const theme = req.body?.theme === 'light' ? 'light' : 'dark';
    const profile = profiles.get(req.user.sub) || await ensureProfileForUser(req.user);
    profile.theme = theme;
    await persistProfile(profile);
    res.json(serializeProfile(profile));
});

app.post('/api/profile/language', requireAuthMaybeDemo, async (req, res) => {
    await ensureProfileForUser(req.user);
    const preferredLanguage = normalizePreferredLanguage(req.body?.preferredLanguage);
    const profile = profiles.get(req.user.sub) || await ensureProfileForUser(req.user);
    profile.preferredLanguage = preferredLanguage;
    updateProfileRecommendations(profile);
    await persistProfile(profile);
    res.json(serializeProfile(profile));
});

app.post('/api/profile/topic-complete', requireAuthMaybeDemo, async (req, res) => {
    await ensureProfileForUser(req.user);
    const topicId = String(req.body?.topicId || '').trim();
    const profile = profiles.get(req.user.sub) || await ensureProfileForUser(req.user);
    if (TOPIC_ID_SET.has(topicId)) {
        profile.completedTopics.add(topicId);
        updateProfileRecommendations(profile);
        await persistProfile(profile);
    }
    res.json(serializeProfile(profile));
});

/**
 * GET /api/session/history
 * Returns the stored execution history for the logged-in user's last run.
 * Useful for resuming after a page refresh.
 */
app.get('/api/session/history', requireAuthMaybeDemo, async (req, res) => {
    const userId = req.user.sub;
    const inMemoryHistory = sessionManager.getHistory(userId);
    if (Array.isArray(inMemoryHistory) && inMemoryHistory.length > 0) {
        return res.json({ history: inMemoryHistory });
    }
    const profile = profiles.get(userId) || await ensureProfileForUser(req.user);
    const durableHistory = Array.isArray(profile?.lastExecutionHistory) ? profile.lastExecutionHistory : [];
    return res.json({ history: durableHistory });
});

app.get('/api/chat/sessions', requireAuthMaybeDemo, async (req, res) => {
    await ensureProfileForUser(req.user);
    const profile = profiles.get(req.user.sub) || await ensureProfileForUser(req.user);
    return res.json({ sessions: sanitizeChatSessions(profile.chatSessions) });
});

app.post('/api/chat/sessions', requireAuthMaybeDemo, async (req, res) => {
    await ensureProfileForUser(req.user);
    const profile = profiles.get(req.user.sub) || await ensureProfileForUser(req.user);
    profile.chatSessions = sanitizeChatSessions(req.body?.sessions);
    await persistProfile(profile);
    return res.json({ ok: true, sessions: profile.chatSessions });
});

app.post('/api/run', requireAuthMaybeDemo, async (req, res) => {
    await ensureProfileForUser(req.user);
    const { sub: userId, email, name } = req.user;
    const requestedSocketId = req.body?.socketId;
    const socketId = resolveSocketIdForUser(userId, requestedSocketId);
    if (!socketId) {
        return res.status(409).json({ ok: false, error: 'No active socket connection.' });
    }
    sessionManager.createOrUpdateSession(userId, email, socketId);
    void executeUserRun({
        userId,
        email,
        name,
        sourceCode: req.body?.code
    });
    return res.json({ ok: true });
});

/**
 * GET /api/admin/stats  (restrict to admin group in production)
 * Returns live session stats for monitoring.
 */
app.get('/api/admin/stats', requireAuthMaybeDemo, (req, res) => {
    // In production, check req.user['cognito:groups'] includes 'admins'
    res.json(sessionManager.getStats());
});

// ── SOCKET.IO — per-user isolated execution ────────────────────────────────────

// All socket connections must provide a valid Cognito id_token
io.use(requireAuthSocketMaybeDemo);

io.on('connection', async (socket) => {
    const { sub: userId, email, name } = socket.user;
    console.log(`[Socket] User connected: ${email} (${userId}) socket=${socket.id}`);
    await ensureProfileForUser({ sub: userId, email, name });

    // Create/reconnect session without restoring prior run history.
    const existingSession = sessionManager.getSession(userId);
    if (existingSession) {
        sessionManager.reconnectSession(userId, socket.id);
    } else {
        sessionManager.createOrUpdateSession(userId, email, socket.id);
    }

    // Send user info to the client (for displaying name/email in UI)
    socket.emit('authInfo', { userId, email, name });

    socket.on('runCode', async (data, ack) => {
        if (typeof ack === 'function') {
            try { ack({ ok: true }); } catch (_) {}
        }
        void executeUserRun({
            userId,
            email,
            name,
            sourceCode: data?.code
        });
    });

    socket.on('sendInput', ({ value }) => {
        const activeChild = sessionManager.getSession(userId)?.activeChild;
        if (!activeChild || activeChild.killed || !activeChild.stdin || !activeChild.stdin.writable) {
            socket.emit('output', '\n⚠️ No active program is waiting for input.');
            return;
        }

        // scanf with %d/%s expects a line/token; append newline like pressing Enter.
        activeChild.stdin.write(String(value ?? '') + '\n');
    });

    socket.on('stopCode', () => {
        const activeChild = sessionManager.getSession(userId)?.activeChild;
        if (activeChild && !activeChild.killed) {
            try { activeChild.kill(); } catch (_) {}
        }
    });

    socket.on('disconnect', (reason) => {
        console.log(`[Socket] User disconnected: ${email} (${userId}) reason=${reason || 'unknown'}`);
        // Mark disconnected and keep session alive for quick reconnects.
        // Idle session cleanup is handled by sessionManager cleanup timer.
        sessionManager.markDisconnected(userId, socket.id);
    });
});

function detectUnsupportedCommands(code) {
    const supportedCommands = new Set([
        'main',
        // stdio
        'printf', 'scanf', 'fprintf', 'fscanf', 'snprintf', 'puts', 'putchar', 'getchar',
        // memory/stdlib
        'malloc', 'calloc', 'realloc', 'free', 'memset', 'memcpy', 'memmove',
        // strings
        'strlen', 'strcpy', 'strncpy', 'strcat', 'strncat', 'strcmp', 'strncmp',
        // conversions
        'atoi', 'atof', 'strtol', 'strtoul',
        // file I/O
        'fopen', 'fclose', 'fread', 'fwrite', 'fgets', 'fputs', 'fgetc', 'fputc', 'feof', 'rewind',
        // common math/util
        'abs', 'labs', 'pow', 'sqrt'
    ]);
    const cKeywords = new Set([
        'if', 'for', 'while', 'switch', 'return', 'do',
        'else', 'case'
    ]);

    const stripped = code
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .split('\n')
        .map(line => line.replace(/\/\/.*$/, ''));

    const unsupported = new Set();

    for (const rawLine of stripped) {
        const line = rawLine.trim();
        if (!line || line.startsWith('#')) continue;

        // Skip function definition headers like: int main(...) { ... }
        const funcDef = line.match(/^(?:[a-zA-Z_]\w*[\s\*]+)+([a-zA-Z_]\w*)\s*\([^;]*\)\s*\{?\s*$/);
        if (funcDef) continue;

        const matches = line.matchAll(/\b([a-zA-Z_]\w*)\s*\(/g);
        for (const m of matches) {
            const fn = m[1];
            if (cKeywords.has(fn) || supportedCommands.has(fn)) continue;
            unsupported.add(fn);
        }
    }

    return [...unsupported];
}

function buildFallbackExecutionSteps(sourceCode) {
    const steps = [];
    const lines = String(sourceCode || '').split('\n');
    for (let i = 0; i < lines.length; i++) {
        const lineNo = i + 1;
        const trimmed = lines[i].trim();
        if (!trimmed) continue;
        if (trimmed.startsWith('#')) continue;
        if (trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*')) continue;
        if (trimmed === '{' || trimmed === '}' || trimmed === '};') continue;
        steps.push({
            name: '__exec__',
            val: 0,
            line: lineNo,
            addr: '0x0',
            type: 'exec'
        });
    }
    return steps.slice(0, 400);
}

// ── CODE INSTRUMENTATION ───────────────────────────────────────────────────────

function instrumentCode(userCode) {
    const C_TYPE_PATTERN = String.raw`(?:(?:unsigned|signed|short|long|const|volatile)\s+)*(?:int|float|double|char|long\s+double|size_t|ssize_t|bool|_Bool|struct\s+[a-zA-Z_]\w*|enum\s+[a-zA-Z_]\w*|[a-zA-Z_]\w*)`;
    const pointerDeclRe = new RegExp(`^(${C_TYPE_PATTERN})\\s*\\*\\s*([a-zA-Z_]\\w*)\\s*(=\\s*[^;]+)?;`);
    const arrayDeclRe = new RegExp(`^(${C_TYPE_PATTERN})\\s+([a-zA-Z_]\\w*)\\s*\\[[^\\]]*\\]\\s*(=\\s*[^;]+)?;`);
    const declAssignRe = new RegExp(`^(${C_TYPE_PATTERN})\\s+([a-zA-Z_]\\w*)\\s*=\\s*[^;]+;`);
    const declOnlyRe = new RegExp(`^(${C_TYPE_PATTERN})\\s+([a-zA-Z_]\\w*)\\s*;`);
    const forWithTypeRe = new RegExp(`^for\\s*\\(\\s*(${C_TYPE_PATTERN})\\s+([a-zA-Z_]\\w*)\\s*=`);

    const normalizeCType = (rawType) => String(rawType || '').replace(/\s+/g, ' ').trim().toLowerCase();
    const traceTypeForCType = (rawType) => {
        const t = normalizeCType(rawType);
        if (t.includes('char')) return 'char';
        if (t.includes('float')) return 'float';
        if (t.includes('double')) return 'double';
        return 'int';
    };

    const shouldEmitFallbackExecTrace = (trimmed) => {
        if (!trimmed) return false;
        if (trimmed.startsWith('#')) return false;
        if (trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*')) return false;
        if (trimmed === '{' || trimmed === '}' || trimmed === '};') return false;
        if (/^(if|for|while|switch|else|do)\b/.test(trimmed)) return false;
        if (/^(case\b|default\b)/.test(trimmed)) return false;
        const funcDef = trimmed.match(/^(?:[a-zA-Z_]\w*[\s\*]+)+([a-zA-Z_]\w*)\s*\([^;]*\)\s*\{?\s*$/);
        if (funcDef) return false;
        return /;\s*$/.test(trimmed);
    };

    const emitTraceForType = (varName, lineNumber, varType) => {
        const t = traceTypeForCType(varType);
        if (t === 'float') return `    TRACE_FLOAT("${varName}", ${varName}, ${lineNumber}, &${varName});`;
        if (t === 'double') return `    TRACE_DOUBLE("${varName}", ${varName}, ${lineNumber}, &${varName});`;
        if (t === 'char') return `    TRACE_CHAR("${varName}", ${varName}, ${lineNumber}, &${varName});`;
        return `    TRACE_INT("${varName}", ${varName}, ${lineNumber}, &${varName});`;
    };

    const macroHeader = [
        '#include <stdio.h>',
        '#define TRACE_INT(name, val, line, addr) printf("__STEP__{\\"name\\":\\"%s\\",\\"val\\":%d,\\"line\\":%d,\\"addr\\":\\"%p\\",\\"type\\":\\"int\\"}\\n", name, (int)(val), line, (void*)(addr))',
        '#define TRACE_FLOAT(name, val, line, addr) printf("__STEP__{\\"name\\":\\"%s\\",\\"val\\":%g,\\"line\\":%d,\\"addr\\":\\"%p\\",\\"type\\":\\"float\\"}\\n", name, (double)(val), line, (void*)(addr))',
        '#define TRACE_DOUBLE(name, val, line, addr) printf("__STEP__{\\"name\\":\\"%s\\",\\"val\\":%g,\\"line\\":%d,\\"addr\\":\\"%p\\",\\"type\\":\\"double\\"}\\n", name, (double)(val), line, (void*)(addr))',
        '#define TRACE_CHAR(name, val, line, addr) printf("__STEP__{\\"name\\":\\"%s\\",\\"val\\":%d,\\"line\\":%d,\\"addr\\":\\"%p\\",\\"type\\":\\"char\\"}\\n", name, (int)(val), line, (void*)(addr))',
        '#define TRACE_CSTR(name, val, line, addr) printf("__STEP__{\\"name\\":\\"%s\\",\\"val\\":\\"%s\\",\\"line\\":%d,\\"addr\\":\\"%p\\",\\"type\\":\\"char[]\\"}\\n", name, val, line, (void*)(addr))',
        '#define TRACE_ARRAY(name, arr, line, addr) printf("__STEP__{\\"name\\":\\"%s\\",\\"val\\":\\"%p\\",\\"line\\":%d,\\"addr\\":\\"%p\\",\\"type\\":\\"array\\"}\\n", name, (void*)(arr), line, (void*)(addr))',
        '#define TRACE_EXEC(line) printf("__STEP__{\\"name\\":\\"__exec__\\",\\"val\\":0,\\"line\\":%d,\\"addr\\":\\"%p\\",\\"type\\":\\"exec\\"}\\n", line, (void*)0)',
        '#define TRACE_PTR(name, ptr, line, target, addr) printf("__STEP__{\\"name\\":\\"%s\\",\\"val\\":\\"%p\\",\\"line\\":%d,\\"addr\\":\\"%p\\",\\"type\\":\\"ptr\\",\\"pointsTo\\":\\"%s\\",\\"pointerTo\\":\\"%s\\"}\\n", name, (void*)(ptr), line, (void*)(addr), target, target)',
        '#define TRACE_UNINIT(name, line, addr, vartype) printf("__STEP__{\\"name\\":\\"%s\\",\\"val\\":\\"uninitialized\\",\\"line\\":%d,\\"addr\\":\\"%p\\",\\"type\\":\\"%s\\"}\\n", name, line, (void*)(addr), vartype)',
        ''
    ].join('\n') + '\n';

    // First pass: collect declared variable names so for(i=0;...) style works
    const declaredVars = new Set();
    const pointerVars = new Set();
    const arrayVars = new Set();
    const variableTypes = new Map();
    userCode.split('\n').forEach(line => {
        const t = line.trim();
        const pointerDecl = t.match(pointerDeclRe);
        if (pointerDecl) {
            const baseType = normalizeCType(pointerDecl[1]);
            declaredVars.add(pointerDecl[2]);
            pointerVars.add(pointerDecl[2]);
            variableTypes.set(pointerDecl[2], `${baseType}*`);
            return;
        }
        const arrayDecl = t.match(arrayDeclRe);
        if (arrayDecl) {
            const baseType = normalizeCType(arrayDecl[1]);
            declaredVars.add(arrayDecl[2]);
            arrayVars.add(arrayDecl[2]);
            variableTypes.set(arrayDecl[2], `${baseType}[]`);
            return;
        }
        const m = t.match(declAssignRe) || t.match(declOnlyRe);
        if (m) {
            declaredVars.add(m[2]);
            variableTypes.set(m[2], normalizeCType(m[1]));
        }
    });

    const lines = userCode.split('\n');
    const result = [];

    for (let i = 0; i < lines.length; i++) {
        const originalLine = i + 1;
        const line = lines[i];
        const trimmed = line.trim();

        // ARRAY DECLARATION WITH/WITHOUT ASSIGNMENT: char fullname[] = "Saish";
        const arrayDecl = trimmed.match(arrayDeclRe);
        if (arrayDecl) {
            const baseType = normalizeCType(arrayDecl[1]);
            const varName = arrayDecl[2];
            const hasAssignment = !!arrayDecl[3];
            declaredVars.add(varName);
            arrayVars.add(varName);
            variableTypes.set(varName, `${baseType}[]`);
            result.push(line);
            if (!hasAssignment) {
                result.push(`    TRACE_UNINIT("${varName}", ${originalLine}, ${varName}, "${baseType}[]");`);
            } else if (traceTypeForCType(baseType) === 'char') {
                result.push(`    TRACE_CSTR("${varName}", ${varName}, ${originalLine}, ${varName});`);
            } else {
                result.push(`    TRACE_ARRAY("${varName}", ${varName}, ${originalLine}, ${varName});`);
            }
            continue;
        }

        // FOR LOOP STYLE A: for(int i = 0; ...)
        const forWithType = trimmed.match(forWithTypeRe);
        if (forWithType) {
            const declaredType = normalizeCType(forWithType[1]);
            const varName = forWithType[2];
            declaredVars.add(varName);
            variableTypes.set(varName, declaredType);
            result.push(line);
            const braceIdx = findOpeningBrace(lines, i);
            if (braceIdx > i) {
                for (let j = i + 1; j <= braceIdx; j++) result.push(lines[j]);
                i = braceIdx;
            }
            result.push(emitTraceForType(varName, originalLine, declaredType));
            continue;
        }

        // FOR LOOP STYLE B: for(i = 0; ...) — pre-declared variable
        const forNoType = trimmed.match(/^for\s*\(\s*([a-zA-Z_]\w*)\s*=/);
        if (forNoType) {
            const varName = forNoType[1];
            result.push(line);
            const braceIdx = findOpeningBrace(lines, i);
            if (braceIdx > i) {
                for (let j = i + 1; j <= braceIdx; j++) result.push(lines[j]);
                i = braceIdx;
            }
            if (declaredVars.has(varName)) {
                result.push(emitTraceForType(varName, originalLine, variableTypes.get(varName)));
            }
            continue;
        }

        // DECLARATION WITH ASSIGNMENT: int x = expr;
        const declAssign = trimmed.match(declAssignRe);
        if (declAssign) {
            const declaredType = normalizeCType(declAssign[1]);
            const varName = declAssign[2];
            declaredVars.add(varName);
            variableTypes.set(varName, declaredType);
            result.push(line);
            result.push(emitTraceForType(varName, originalLine, declaredType));
            continue;
        }

        // POINTER DECLARATION WITH ASSIGNMENT: int *ptr = &x;
        const ptrDeclAssign = trimmed.match(pointerDeclRe);
        if (ptrDeclAssign) {
            const varName = ptrDeclAssign[2];
            const rhs = (ptrDeclAssign[3] || '').replace(/^=\s*/, '').trim();
            const targetMatch = rhs.match(/^&\s*([a-zA-Z_]\w*)$/);
            const target = targetMatch ? targetMatch[1] : '';
            const baseType = normalizeCType(ptrDeclAssign[1]);
            declaredVars.add(varName);
            pointerVars.add(varName);
            variableTypes.set(varName, `${baseType}*`);
            result.push(line);
            if (rhs) result.push(`    TRACE_PTR("${varName}", ${varName}, ${originalLine}, "${target}", &${varName});`);
            continue;
        }

        // POINTER DECLARATION ONLY: int *ptr;
        const ptrDeclOnly = trimmed.match(new RegExp(`^(${C_TYPE_PATTERN})\\s*\\*\\s*([a-zA-Z_]\\w*)\\s*;`));
        if (ptrDeclOnly) {
            const baseType = normalizeCType(ptrDeclOnly[1]);
            declaredVars.add(ptrDeclOnly[2]);
            pointerVars.add(ptrDeclOnly[2]);
            variableTypes.set(ptrDeclOnly[2], `${baseType}*`);
            result.push(line);
            continue;
        }

        // DECLARATION ONLY: int i;
        const declOnly = trimmed.match(declOnlyRe);
        if (declOnly) {
            const declaredType = normalizeCType(declOnly[1]);
            const varName = declOnly[2];
            declaredVars.add(varName);
            variableTypes.set(varName, declaredType);
            result.push(line);
            result.push(`    TRACE_UNINIT("${varName}", ${originalLine}, &${varName}, "${declaredType}");`);
            continue;
        }

        // SCANF INPUT: scanf("%d", &i);  -> trace updated variable(s) right after input
        const scanfCall = trimmed.match(/^(?:[a-zA-Z_]\w*\s*=\s*)?scanf\s*\(.*\)\s*;/);
        if (scanfCall) {
            result.push(`    printf("__SCANF__Program waiting for input\\n");`);
            result.push(line);
            const matchedVars = [...trimmed.matchAll(/&\s*([a-zA-Z_]\w*)/g)].map(m => m[1]);
            const uniqueVars = [...new Set(matchedVars)];
            uniqueVars.forEach(varName => {
                if (!declaredVars.has(varName)) return;
                if (pointerVars.has(varName)) {
                    result.push(`    TRACE_PTR("${varName}", ${varName}, ${originalLine}, "", &${varName});`);
                } else {
                    result.push(emitTraceForType(varName, originalLine, variableTypes.get(varName)));
                }
            });
            continue;
        }

        // POINTER ASSIGNMENT: ptr = &x; or ptr = otherPtr;
        const ptrAssign = trimmed.match(/^([a-zA-Z_]\w*)\s*=\s*([^;]+);/);
        if (ptrAssign && !trimmed.startsWith('for') && !trimmed.startsWith('//') && !trimmed.startsWith('return')) {
            const varName = ptrAssign[1];
            const rhs = ptrAssign[2].trim();
            if (pointerVars.has(varName)) {
                const targetMatch = rhs.match(/^&\s*([a-zA-Z_]\w*)$/);
                const target = targetMatch ? targetMatch[1] : '';
                result.push(line);
                result.push(`    TRACE_PTR("${varName}", ${varName}, ${originalLine}, "${target}", &${varName});`);
                continue;
            }
        }

        // PLAIN ASSIGNMENT: x = 3; total += val;
        const assign = trimmed.match(/^([a-zA-Z_]\w*)\s*([+\-*\/%&|^]?=)\s*[^;]+;/);
        if (assign && !trimmed.startsWith('for') && !trimmed.startsWith('//') && !trimmed.startsWith('return')) {
            const varName = assign[1];
            result.push(line);
            if (declaredVars.has(varName)) {
                result.push(emitTraceForType(varName, originalLine, variableTypes.get(varName)));
            }
            continue;
        }

        // INLINE ASSIGNMENTS IN EXPRESSIONS:
        // printf("%d", value = 20);  foo(x += 1, y);
        if (/;/.test(trimmed) && /[+\-*\/%&|^]?=/.test(trimmed) && !trimmed.startsWith('return')) {
            const inlineMatches = [...trimmed.matchAll(/\b([a-zA-Z_]\w*)\s*([+\-*\/%&|^]?=)\s*[^,);]+/g)];
            const inlineVars = [];
            for (const m of inlineMatches) {
                const name = m[1];
                const op = m[2];
                if (!name || op === '==') continue;
                if (!declaredVars.has(name)) continue;
                if (pointerVars.has(name) || arrayVars.has(name)) continue;
                inlineVars.push(name);
            }
            if (inlineVars.length > 0) {
                result.push(line);
                [...new Set(inlineVars)].forEach((name) => {
                    result.push(emitTraceForType(name, originalLine, variableTypes.get(name)));
                });
                continue;
            }
        }

        // INCREMENT / DECREMENT: i++; --j;
        const postfixIncDec = trimmed.match(/^([a-zA-Z_]\w*)\s*(\+\+|--)\s*;/);
        const prefixIncDec = trimmed.match(/^(\+\+|--)\s*([a-zA-Z_]\w*)\s*;/);
        const incDecVar = postfixIncDec ? postfixIncDec[1] : (prefixIncDec ? prefixIncDec[2] : '');
        if (incDecVar) {
            result.push(line);
            if (declaredVars.has(incDecVar) && !pointerVars.has(incDecVar) && !arrayVars.has(incDecVar)) {
                result.push(emitTraceForType(incDecVar, originalLine, variableTypes.get(incDecVar)));
            }
            continue;
        }

        result.push(line);
        if (shouldEmitFallbackExecTrace(trimmed)) {
            result.push(`    TRACE_EXEC(${originalLine});`);
        }
    }

    return macroHeader + result.join('\n');
}

function findOpeningBrace(lines, fromIdx) {
    if (lines[fromIdx].includes('{')) return fromIdx;
    for (let j = fromIdx + 1; j < lines.length; j++) {
        if (lines[j].includes('{')) return j;
    }
    return fromIdx;
}

// ── STARTUP CHECKS ────────────────────────────────────────────────────────────
// Prefer Docker for isolated execution. If it is unavailable, fall back to the
// local compiler in development so the app can still run code.
const { execSync } = require('child_process');
function checkExecutionBackends() {
    if (
        process.env.PREFER_LOCAL_EXECUTION === 'true' &&
        (process.env.ALLOW_LOCAL_EXECUTION === 'true' || process.env.DEMO_MODE === 'true')
    ) {
        try {
            execSync(`${process.env.C_COMPILER || 'gcc'} --version`, { stdio: 'ignore', timeout: 5000 });
            console.log('[Runner] Host gcc execution backend ready.');
            return;
        } catch {
            console.error('\n⚠️  WARNING: PREFER_LOCAL_EXECUTION=true but local gcc is unavailable.');
            console.error('   Falling back to Docker readiness checks.\n');
        }
    }

    try {
        execSync('docker info', { stdio: 'ignore', timeout: 5000 });
        execSync('docker image inspect c-runner', { stdio: 'ignore' });
        console.log('[Runner] Docker execution backend ready (c-runner image found).');
        return;
    } catch {
        console.error('\n⚠️  WARNING: Docker execution backend is not ready.');
    }

    try {
        execSync(`${process.env.C_COMPILER || 'gcc'} --version`, { stdio: 'ignore', timeout: 5000 });
        if (process.env.ALLOW_LOCAL_EXECUTION === 'true' || process.env.DEMO_MODE === 'true') {
            console.error('   Falling back to local gcc execution for this server.');
            console.error('   This is fine for trusted local development, but it is less isolated than Docker.\n');
            return;
        }
        console.error('   Local gcc is installed, but host execution fallback is disabled.');
        console.error('   Set ALLOW_LOCAL_EXECUTION=true for trusted local development if you want to bypass Docker.\n');
    } catch {
        console.error('   No local gcc fallback is available either.');
        console.error('   Install gcc or restore Docker access to enable code execution.');
        console.error('   Docker image bootstrap:');
        console.error('   docker build -t c-runner - <<\'EOF\'');
        console.error('   FROM gcc:13');
        console.error('   WORKDIR /workspace');
        console.error('   EOF\n');
    }
}
checkExecutionBackends();

const PORT = Number(process.env.PORT || 3000);

server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
        console.error(`[Server] Port ${PORT} is already in use.`);
        console.error(`Close the existing process on port ${PORT}, or start this server with PORT=<new-port>.`);
        return;
    }
    throw error;
});

server.listen(PORT, () => {
    console.log(`🚀 MemFlow AI Server live on port ${PORT}`);
});
