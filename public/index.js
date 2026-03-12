/* ─────────────────────────────────────────────
   TOPICS DATA
───────────────────────────────────────────── */
const TOPICS = {
  "Basics":["intro","syntax","compile","comments"],
  "Data & Variables":["datatypes","variables","constants","operators"],
  "Control Flow":["ifelse","switch","for","while","dowhile","break"],
  "Functions":["functions","scope","recursion","args"],
  "Memory & Pointers":["pointers","arrays","strings","malloc","ptr2d"],
  "Structures":["struct","union","enum","typedef"],
  "Files & I/O":["stdio","fileio","format"],
  "Advanced":["preprocessor","bitops","funcptr","memory"]
};

const TMETA = {
  intro:{icon:"🚀",title:"Introduction to C",sub:"History, why C matters, first program"},
  syntax:{icon:"📝",title:"Basic Syntax",sub:"Structure of a C program"},
  compile:{icon:"⚙️",title:"Compiling & Running",sub:"gcc, compilation steps"},
  comments:{icon:"💬",title:"Comments",sub:"Single-line and multi-line"},
  datatypes:{icon:"🔢",title:"Data Types",sub:"int, float, char, double"},
  variables:{icon:"📦",title:"Variables",sub:"Declaration, initialization"},
  constants:{icon:"🔒",title:"Constants",sub:"const and #define"},
  operators:{icon:"➕",title:"Operators",sub:"Arithmetic, logical, bitwise"},
  ifelse:{icon:"🔀",title:"If / Else",sub:"Conditional branching"},
  switch:{icon:"🎛️",title:"Switch",sub:"Multi-branch selection"},
  for:{icon:"🔁",title:"For Loop",sub:"Counted iteration"},
  while:{icon:"⟳",title:"While Loop",sub:"Condition-driven loops"},
  dowhile:{icon:"↩️",title:"Do While",sub:"Execute then check"},
  break:{icon:"⛔",title:"Break & Continue",sub:"Loop control"},
  functions:{icon:"🧩",title:"Functions",sub:"Define, call, return"},
  scope:{icon:"📐",title:"Scope & Lifetime",sub:"Local vs global variables"},
  recursion:{icon:"🌀",title:"Recursion",sub:"Functions calling themselves"},
  args:{icon:"📨",title:"Function Arguments",sub:"Pass by value vs reference"},
  pointers:{icon:"👉",title:"Pointers",sub:"Address, dereference, *ptr"},
  arrays:{icon:"📋",title:"Arrays",sub:"Declaration, indexing, iteration"},
  strings:{icon:"🔤",title:"Strings",sub:"char arrays, string.h"},
  malloc:{icon:"🧠",title:"Dynamic Memory",sub:"malloc, calloc, free"},
  ptr2d:{icon:"⬛",title:"2D Arrays & Pointers",sub:"Matrix, pointer arithmetic"},
  struct:{icon:"🏗️",title:"Structs",sub:"Custom data types"},
  union:{icon:"🔗",title:"Unions",sub:"Shared memory types"},
  enum:{icon:"📊",title:"Enums",sub:"Named integer constants"},
  typedef:{icon:"✏️",title:"Typedef",sub:"Type aliases"},
  stdio:{icon:"🖨️",title:"printf & scanf",sub:"Formatted input/output"},
  fileio:{icon:"📁",title:"File I/O",sub:"fopen, fread, fwrite"},
  format:{icon:"🎨",title:"Format Specifiers",sub:"%d, %f, %s and more"},
  preprocessor:{icon:"#",title:"Preprocessor",sub:"#define, #include, macros"},
  bitops:{icon:"💡",title:"Bit Operations",sub:"Shifts, masks, flags"},
  funcptr:{icon:"🎯",title:"Function Pointers",sub:"Callbacks, dispatch tables"},
  memory:{icon:"🗂️",title:"Memory Layout",sub:"Stack, heap, data segment"},
};

/* ─────────────────────────────────────────────
   TOPIC CONTENT
───────────────────────────────────────────── */
const TC = {
  intro:{
    sections:[
      {h:"Why Learn C?",c:`<p>C gives you direct control over memory and hardware — it's the foundation of Linux, Windows, game engines, and nearly every programming language you use today.</p>
      <ul><li>Compiled to fast native machine code</li><li>Direct memory control via pointers</li><li>Runs on any platform — microcontrollers to supercomputers</li><li>Foundation of C++, Java, Python, Go, and Rust</li></ul>`},
      {h:"Your First C Program",c:`<div class="cblk"><span class="cm">// Every C program starts here</span>
<span class="kw">#include</span> <span class="str">&lt;stdio.h&gt;</span>

<span class="kw">int</span> <span class="fn">main</span>() {
    <span class="fn">printf</span>(<span class="str">"Hello, World!\\n"</span>);
    <span class="kw">return</span> <span class="nm">0</span>;
}<div class="cbl">C</div></div>
<button class="trybtn" onclick="tryCode('#include &lt;stdio.h&gt;\\nint main() {\\n    printf(&quot;Hello, World!\\\\n&quot;);\\n    return 0;\\n}')">▶ Run This</button>`},
      {h:"How It Works",c:`<div class="ibox">1. <code style="color:var(--cyan)">#include &lt;stdio.h&gt;</code> — imports the standard I/O library (gives you printf)<br>2. <code style="color:var(--cyan)">int main()</code> — the entry point; every program starts here<br>3. <code style="color:var(--cyan)">return 0</code> — tells the OS the program finished successfully</div>`}
    ]
  },
  variables:{
    sections:[
      {h:"Declaring Variables",c:`<p>Every variable needs a <strong style="color:var(--cyan)">type</strong> before you can use it. C is strictly typed — you must declare what kind of data a variable will hold.</p>
      <div class="cblk"><span class="kw">int</span>    age   = <span class="nm">25</span>;       <span class="cm">// whole numbers</span>
<span class="kw">float</span>  price = <span class="nm">9.99</span>;     <span class="cm">// decimal (6-7 digits precision)</span>
<span class="kw">double</span> pi    = <span class="nm">3.14159</span>;  <span class="cm">// decimal (15-16 digits precision)</span>
<span class="kw">char</span>   grade = <span class="str">'A'</span>;      <span class="cm">// single character (stored as ASCII)</span><div class="cbl">C</div></div>
<button class="trybtn" onclick="tryCode('#include &lt;stdio.h&gt;\\nint main() {\\n    int age = 25;\\n    float price = 9.99;\\n    printf(&quot;Age: %d\\\\nPrice: %.2f\\\\n&quot;, age, price);\\n    return 0;\\n}')">▶ Visualize This</button>`},
      {h:"Type Sizes in Memory",c:`<div class="cblk"><span class="kw">char</span>   → <span class="nm">1</span> byte   → -128 to 127
<span class="kw">int</span>    → <span class="nm">4</span> bytes  → -2,147,483,648 to 2,147,483,647
<span class="kw">float</span>  → <span class="nm">4</span> bytes  → ~6-7 significant digits
<span class="kw">double</span> → <span class="nm">8</span> bytes  → ~15-16 significant digits<div class="cbl">sizes</div></div>`},
      {h:"Rules",c:`<ul><li>Start with a letter or underscore</li><li>Only letters, digits, underscores — no spaces</li><li>Case-sensitive: <code style="color:var(--cyan)">Age</code> ≠ <code style="color:var(--cyan)">age</code></li></ul>
<div class="wbox">⚠️ Always initialize variables before reading them — uninitialized vars hold garbage values from memory.</div>`}
    ]
  },
  for:{
    sections:[
      {h:"Syntax",c:`<p>The <code style="color:var(--cyan)">for</code> loop is perfect when you know exactly how many iterations you need.</p>
      <div class="cblk"><span class="kw">for</span> (init; condition; update) {
    <span class="cm">// body — runs while condition is true</span>
}<div class="cbl">C</div></div>
<div class="ibox"><strong>init</strong> — runs once at start (e.g. <code style="color:var(--cyan)">i = 0</code>)<br><strong>condition</strong> — checked before each iteration; loop stops when false<br><strong>update</strong> — runs after each iteration (e.g. <code style="color:var(--cyan)">i++</code>)</div>`},
      {h:"Classic Example",c:`<div class="cblk"><span class="kw">#include</span> <span class="str">&lt;stdio.h&gt;</span>
<span class="kw">int</span> <span class="fn">main</span>() {
    <span class="kw">int</span> i;
    <span class="kw">for</span>(i = <span class="nm">0</span>; i &lt; <span class="nm">5</span>; i++) {
        <span class="fn">printf</span>(<span class="str">"%d\\n"</span>, i);
    }
    <span class="kw">return</span> <span class="nm">0</span>;
}<div class="cbl">C</div></div>
<button class="trybtn" onclick="tryCode('#include &lt;stdio.h&gt;\\nint main() {\\n    int i;\\n    for(i = 0; i &lt; 5; i++) {\\n        printf(&quot;%d\\\\n&quot;, i);\\n    }\\n    return 0;\\n}')">▶ Step Through This</button>`},
      {h:"What Happens Each Iteration",c:`<div class="cblk">i = 0 → 0 &lt; 5? YES → print 0 → i++
i = 1 → 1 &lt; 5? YES → print 1 → i++
...
i = 4 → 4 &lt; 5? YES → print 4 → i++
i = 5 → 5 &lt; 5? NO  → loop ends<div class="cbl">trace</div></div>`}
    ]
  },
  pointers:{
    sections:[
      {h:"What Is a Pointer?",c:`<p>A pointer is a variable that stores the <strong style="color:var(--cyan)">memory address</strong> of another variable — not the value itself, but where the value lives in RAM.</p>
      <div class="cblk"><span class="kw">int</span>  x   = <span class="nm">10</span>;    <span class="cm">// x holds the value 10</span>
<span class="kw">int</span> *ptr = &amp;x;    <span class="cm">// ptr holds the ADDRESS of x</span>

<span class="fn">printf</span>(<span class="str">"%d"</span>,  x);    <span class="cm">// → 10     (the value)</span>
<span class="fn">printf</span>(<span class="str">"%p"</span>,  ptr);  <span class="cm">// → 0x7ffe (the address)</span>
<span class="fn">printf</span>(<span class="str">"%d"</span>, *ptr);  <span class="cm">// → 10     (value AT the address)</span><div class="cbl">C</div></div>
<button class="trybtn" onclick="tryCode('#include &lt;stdio.h&gt;\\nint main() {\\n    int x = 10;\\n    int *ptr = &x;\\n    printf(&quot;x = %d\\\\n&quot;, x);\\n    printf(&quot;*ptr = %d\\\\n&quot;, *ptr);\\n    *ptr = 42;\\n    printf(&quot;x after *ptr=42: %d\\\\n&quot;, x);\\n    return 0;\\n}')">▶ Try in Editor</button>`},
      {h:"The Two Operators",c:`<ul>
        <li><code style="color:var(--cyan)">&amp;</code> — <strong>address-of</strong>: gives the memory address of a variable</li>
        <li><code style="color:var(--cyan)">*</code> — <strong>dereference</strong>: follows the address to read/write the value there</li>
      </ul>`},
      {h:"Why Pointers Matter",c:`<ul>
        <li>Pass large data to functions without copying it</li>
        <li>Dynamic memory allocation (malloc/free)</li>
        <li>Build data structures: linked lists, trees, graphs</li>
        <li>Required for string manipulation and file I/O</li>
      </ul>
      <div class="wbox">⚠️ Dereferencing a NULL or uninitialized pointer crashes your program with a segmentation fault.</div>`}
    ]
  },
  functions:{
    sections:[
      {h:"Defining a Function",c:`<div class="cblk"><span class="kw">int</span> <span class="fn">add</span>(<span class="kw">int</span> a, <span class="kw">int</span> b) {
    <span class="kw">return</span> a + b;
}

<span class="kw">int</span> <span class="fn">main</span>() {
    <span class="kw">int</span> result = <span class="fn">add</span>(<span class="nm">3</span>, <span class="nm">4</span>);
    <span class="fn">printf</span>(<span class="str">"%d"</span>, result);  <span class="cm">// 7</span>
    <span class="kw">return</span> <span class="nm">0</span>;
}<div class="cbl">C</div></div>
<button class="trybtn" onclick="tryCode('#include &lt;stdio.h&gt;\\nint add(int a, int b) {\\n    return a + b;\\n}\\nint main() {\\n    int result = add(3, 4);\\n    printf(&quot;Result: %d\\\\n&quot;, result);\\n    return 0;\\n}')">▶ Visualize This</button>`},
      {h:"Return Types",c:`<ul><li><code style="color:#79b8ff">int/float/double/char</code> — returns that type</li><li><code style="color:#79b8ff">void</code> — returns nothing</li><li>Return type must match what you actually return</li></ul>`},
      {h:"Why Functions?",c:`<ul><li><strong>Reuse</strong> — write once, call many times</li><li><strong>Organize</strong> — break big problems into small pieces</li><li><strong>Test</strong> — test each function independently</li><li><strong>Read</strong> — code reads like English: <code style="color:var(--cyan)">int total = sum(a, b)</code></li></ul>`}
    ]
  },
  arrays:{
    sections:[
      {h:"Declaring Arrays",c:`<div class="cblk"><span class="kw">int</span> nums[<span class="nm">5</span>] = {<span class="nm">10</span>, <span class="nm">20</span>, <span class="nm">30</span>, <span class="nm">40</span>, <span class="nm">50</span>};
<span class="cm">//      [0]  [1]  [2]  [3]  [4]   ← indices start at 0!</span>

<span class="fn">printf</span>(<span class="str">"%d"</span>, nums[<span class="nm">0</span>]);  <span class="cm">// → 10</span>
<span class="fn">printf</span>(<span class="str">"%d"</span>, nums[<span class="nm">4</span>]);  <span class="cm">// → 50</span><div class="cbl">C</div></div>
<button class="trybtn" onclick="tryCode('#include &lt;stdio.h&gt;\\nint main() {\\n    int nums[5] = {10, 20, 30, 40, 50};\\n    int i;\\n    for(i = 0; i &lt; 5; i++) {\\n        printf(&quot;nums[%d] = %d\\\\n&quot;, i, nums[i]);\\n    }\\n    return 0;\\n}')">▶ Visualize This</button>`},
      {h:"Key Rules",c:`<ul><li>All elements must be the same type</li><li>Size is fixed at declaration — cannot grow</li><li>Index starts at 0, ends at size-1</li></ul>
<div class="wbox">⚠️ Accessing index out of bounds (e.g. nums[5] when size is 5) causes undefined behavior — C doesn't bounds-check!</div>`}
    ]
  }
};

// Fill stubs for topics without detailed content
Object.values(TMETA).forEach(t => {
  if (!TC[t.id || Object.keys(TMETA).find(k => TMETA[k]===t)]) {
    // handled below
  }
});
Object.keys(TMETA).forEach(id => {
  if (!TC[id]) {
    TC[id] = {
      sections: [
        {
          h: "Concept Overview",
          c: `<p><strong style="color:var(--cyan)">${TMETA[id].title}</strong> is an important part of C programming. Read the notes, run the sample, and step through execution in the visualizer.</p>
              <div class="ibox">Tip: Use <strong>Run</strong> and then step controls to see how variables and memory change line by line.</div>`
        },
        {
          h: "Sample Code",
          c: `<div class="cblk"><span class="kw">#include</span> <span class="str">&lt;stdio.h&gt;</span>
<span class="kw">int</span> <span class="fn">main</span>() {
    <span class="cm">// Practice: ${TMETA[id].title}</span>
    <span class="kw">int</span> value = <span class="nm">10</span>;
    <span class="fn">printf</span>(<span class="str">"value = %d\\n"</span>, value);
    <span class="kw">return</span> <span class="nm">0</span>;
}<div class="cbl">C</div></div>
<button class="trybtn" onclick="tryCode('#include &lt;stdio.h&gt;\\nint main() {\\n    // Practice: ${TMETA[id].title}\\n    int value = 10;\\n    printf(&quot;value = %d\\\\n&quot;, value);\\n    return 0;\\n}')">▶ Try in Editor</button>`
        },
        {
          h: "What To Observe",
          c: `<ul>
                <li>How the current line highlight moves during execution</li>
                <li>How variables appear and update in memory cards</li>
                <li>How output in terminal matches each executed step</li>
              </ul>`
        }
      ]
    };
  }
});

const SUGGESTIONS = [
  {
    icon:"🚀",
    id:"intro",
    title:"Hello World",
    desc:"Write your very first C program",
    sampleCode:"#include <stdio.h>\nint main() {\n    printf(\"Hello, World!\\n\");\n    return 0;\n}\n"
  },
  {
    icon:"📦",
    id:"variables",
    title:"Variables",
    desc:"How C stores data in memory",
    sampleCode:"#include <stdio.h>\nint main() {\n    int age = 25;\n    float price = 9.99f;\n    printf(\"Age: %d\\nPrice: %.2f\\n\", age, price);\n    return 0;\n}\n"
  },
  {
    icon:"🔁",
    id:"for",
    title:"For Loops",
    desc:"Iterate with counted loops",
    sampleCode:"#include <stdio.h>\nint main() {\n    int i;\n    for (i = 0; i < 5; i++) {\n        printf(\"%d\\n\", i);\n    }\n    return 0;\n}\n"
  },
  {
    icon:"👉",
    id:"pointers",
    title:"Pointers",
    desc:"The heart of C programming",
    sampleCode:"#include <stdio.h>\nint main() {\n    int x = 10;\n    int *ptr = &x;\n    printf(\"x = %d\\n\", x);\n    printf(\"*ptr = %d\\n\", *ptr);\n    return 0;\n}\n"
  },
];
const HI_LESSON_SCRIPT_URL = '/lessons-hi.js?v=20260309b';
let suggestedSamples = [];
let terminalWide = false;
let terminalSplitRatio = 0.34;
let terminalSplitBeforeMax = 0.34;
let currentTopicId = null;
let pendingProfileLanguage = 'en';
let profileLanguageSyncInFlight = '';
const UI_LANGUAGE_STORAGE_KEY = 'memflow_ui_language';
const FALLBACK_I18N = {
  'meta.title': 'MemFlow AI — Learn C Programming',
  'nav.home': 'Home',
  'nav.learn': 'Learn',
  'nav.topics': 'Topics',
  'nav.compiler': 'Compiler',
  'nav.visualize': 'Visualize',
  'nav.chat': 'Chat',
  'header.download': 'Download',
  'header.download_code': 'Download Code',
  'header.download_topic': 'Download Topic',
  'account.title': 'Account',
  'profile.theme': 'Theme',
  'profile.language': 'Language',
  'profile.progress': 'Progress',
  'profile.progress_text': '{{percent}}% ({{completed}}/{{total}})',
  'profile.sign_out': 'Sign Out',
  'sidebar.topics_title': 'C Topics',
  'sidebar.search_placeholder': 'Search topics…',
  'home.hero_title_html': 'Learn <em>C</em> step by step.',
  'home.hero_subtitle': 'Write code, run it, and see memory updates clearly.',
  'home.start_coding': 'Start Coding',
  'home.explore_topics': 'Explore Topics',
  'home.start_learning': 'Start Learning',
  'home.recommended_practice': 'Recommended Practice',
  'home.practice': '▶ Practice',
  'home.suggestion_intro_title': 'Hello World',
  'home.suggestion_intro_desc': 'Write your very first C program',
  'home.suggestion_variables_title': 'Variables',
  'home.suggestion_variables_desc': 'How C stores data in memory',
  'home.suggestion_for_title': 'For Loops',
  'home.suggestion_for_desc': 'Iterate with counted loops',
  'home.suggestion_pointers_title': 'Pointers',
  'home.suggestion_pointers_desc': 'The heart of C programming',
  'chat.home_placeholder': 'Ask anything about C… or search a topic',
  'chat.page_placeholder': 'Ask a C question...',
  'chat.open_title': 'Open Chat',
  'chat.note': 'MemFlow AI can make mistakes. Verify important details and test code before relying on results.',
  'chat.reply_added': 'Reply added',
  'chat.unavailable': 'AI unavailable',
  'chat.page_empty': 'Type a C question in the home chat bar to start.',
  'chat.page_title': 'AI Chats',
  'chat.new_chat': '+ New Chat',
  'chat.conversation': '💬 Conversation',
  'chat.default_title_prefix': 'Chat',
  'chat.delete': 'Delete chat',
  'common.copy': 'Copy',
  'common.copied': 'Copied',
  'common.failed': 'Failed',
  'common.close': 'Close',
  'compiler.run': '▶ RUN',
  'compiler.stop': '■ STOP',
  'compiler.prev': '◀ Prev',
  'compiler.next': 'Next ▶',
  'compiler.select_lines': '✂ Select Lines',
  'compiler.selecting_lines': '✂ Selecting Lines',
  'compiler.ask_line_ai': '🤖 Ask Line AI',
  'compiler.memory_view': '🧠 Memory View',
  'compiler.hide_memory_view': '🧠 Hide Memory View',
  'compiler.output': 'Output',
  'compiler.maximize': '⤢ Maximize',
  'compiler.restore': '↙ Restore',
  'compiler.ready': 'Ready',
  'compiler.ready_panel': 'Ready…',
  'compiler.idle': 'Idle',
  'compiler.running': 'Running',
  'compiler.connected': 'connected',
  'compiler.reconnecting': 'reconnecting…',
  'compiler.compiling': 'compiling…',
  'compiler.run_failed': 'run failed',
  'compiler.input_needed': '⌨ input needed',
  'compiler.done': '✓ done',
  'compiler.timeline_loading': 'Compiling and preparing timeline…',
  'compiler.memory_waiting': 'Waiting for first execution step…',
  'compiler.output_hidden': 'Output hidden - drag up',
  'compiler.output_maximized': 'Output maximized - drag or restore',
  'compiler.output_drag': 'Drag to resize output',
  'compiler.program_input': '⌨  Program input',
  'compiler.scanf_placeholder': 'Type value and press Enter…',
  'compiler.send_input': 'Send ↵',
  'compiler.no_stdout': 'Program finished successfully (exit {{exitCode}}). No stdout was produced.{{traceNote}}',
  'compiler.trace_note': ' Timeline captured {{count}} step{{plural}}.',
  'compiler.compile': 'Compile',
  'compiler.line_executed': 'Line executed',
  'debug.step_ai_title': '🤖 Step AI Mentor',
  'debug.default_text': 'Run code → step → click AI for explanation',
  'debug.no_explanations': 'No step explanations yet.',
  'debug.expand_chat': '⤢ Expand',
  'debug.shared_chat_hint': 'Shared with AI Chats. Expand to continue there.',
  'debug.explaining_selection': '🤖 Explaining selected code...',
  'debug.no_explanation': 'No explanation.',
  'debug.ai_unavailable': '⚠️ AI unavailable.',
  'debug.selection_prompt': 'Explain these selected C lines and the memory behavior:',
  'debug.selection_label': 'Selection {{index}}:',
  'debug.select_lines_prompt': 'Select at least one line (or multiple lines) in editor, then click Ask Line AI.',
  'debug.no_line_selected': 'No line selected yet',
  'debug.no_line_selected_toast': 'Select at least one line first',
  'debug.step_prompt': 'Click Select Lines, highlight code, then click Ask Line AI. Or run code and choose a step.',
  'debug.analyzing_step': '🤖 Analyzing step {{step}}…',
  'debug.explain_step_request': 'Explain execution step {{step}} and describe the variable or memory changes.',
  'debug.step_summary_line_executed': 'L{{line}}: {{label}}',
  'debug.step_summary_value': 'L{{line}}: {{name}} = {{value}}',
  'debug.step_summary_fallback': 'Step {{step}}',
  'memory.state': 'Memory State',
  'memory.grid_view': 'Memory Grid View',
  'memory.structure': 'Memory Structure',
  'memory.stack': 'Stack',
  'memory.heap_refs': 'Heap Refs',
  'memory.run_to_populate': 'Run code to populate memory slots.',
  'memory.run_to_generate_grid': 'Run code to generate memory grid visualization.',
  'memory.no_data': 'No data yet.',
  'memory.no_heap': 'No heap references yet.',
  'memory.click_cell': 'Click any memory cell to jump to its visualization step.',
  'memory.execution_timeline_empty': 'Run code to generate an execution timeline.',
  'memory.map_empty': 'Memory map will appear here after execution starts.',
  'memory.overlay_status': 'Step {{step}}/{{total}} · Line L{{line}} · Slots {{slots}}',
  'memory.active_line_detail': 'Active line: L{{line}}\nVariable: {{name}}\nValue: {{value}}\nClick any grid cell to focus a variable and jump to its latest step.',
  'memory.heap_points_to_stack': 'points to stack var {{target}}',
  'memory.heap_points_to': 'points to {{target}}',
  'memory.heap_external': 'external/heap-like address reference',
  'memory.no_stack': 'No stack variables yet.',
  'memory.pointer_note': 'Pointer memory: this slot references {{target}}.',
  'memory.state_note': 'State memory: this slot is used by later statements/output.',
  'memory.selection_address': ' | Address: {{addr}}',
  'memory.selection_synced': 'Visualization synced to latest step for this variable.',
  'memory.selected_detail': 'Selected: {{name}}[{{index}}] = {{value}}\nType: {{type}}{{address}}\n{{note}}\n{{synced}}',
  'hint.idle': 'Idle',
  'hint.running': 'Running',
  'hint.no_selection': 'No lines selected',
  'hint.lines_selected': '{{count}} line(s) selected',
  'hint.run': 'Run',
  'hint.step': 'Step',
  'hint.ask_ai': 'Ask AI',
  'toast.code_downloaded': 'Code downloaded.',
  'toast.topic_downloaded': 'Topic downloaded.',
  'toast.editor_failed': 'Editor failed to load.',
  'toast.socket_not_ready': 'Socket is not ready. Retry once it reconnects.',
  'confirm.leave_workbench': 'Leaving Compiler/Visualize will clear your current code and step visualization. Continue?'
};
const UI_LANGUAGE_META = {
  en: 'English',
  hi: 'हिन्दी',
  bn: 'বাংলা',
  te: 'తెలుగు',
  ta: 'தமிழ்',
  mr: 'मराठी'
};
const ENGLISH_PAGE_PATH = '/';
const ENGLISH_COMPILER_PATH = '/compiler';
const VISUALIZE_PATH = '/visualize';
const WORKBENCH_ROUTE_HASHES = new Set(['compiler', 'visualize']);
const LESSON_ROOT_LABELS = {
  en: 'C Programming',
  hi: 'सी प्रोग्रामिंग'
};
const lessonBundles = {
  en: {
    meta: TMETA,
    content: TC,
    groupLabels: null
  }
};
let currentLanguage = 'en';
let currentTranslations = { ...FALLBACK_I18N };
const i18nCache = { en: { ...FALLBACK_I18N } };
let activeLessonBundle = lessonBundles.en;
let hindiLessonBundlePromise = null;

function normalizeUiLanguage(value) {
  const code = String(value || '').trim().toLowerCase();
  return UI_LANGUAGE_META[code] ? code : 'en';
}

function getTopicMeta(id) {
  return activeLessonBundle.meta[id] || TMETA[id];
}

function getTopicContent(id) {
  return activeLessonBundle.content[id] || TC[id];
}

function getTopicGroupLabel(group) {
  return activeLessonBundle.groupLabels?.[group] || group;
}

function getLessonRootLabel() {
  return LESSON_ROOT_LABELS[currentLanguage] || LESSON_ROOT_LABELS.en;
}

async function ensureHindiLessonBundle() {
  if (lessonBundles.hi) return lessonBundles.hi;
  hindiLessonBundlePromise = hindiLessonBundlePromise || loadScriptOnce(
    HI_LESSON_SCRIPT_URL,
    () => Boolean(window.__MEMFLOW_HI_LESSONS__)
  ).then(() => {
    const source = window.__MEMFLOW_HI_LESSONS__ || {};
    lessonBundles.hi = {
      meta: { ...TMETA, ...(source.TMETA || {}) },
      content: { ...TC, ...(source.TC || {}) },
      groupLabels: source.TOPIC_GROUP_LABELS || null
    };
    return lessonBundles.hi;
  }).catch((err) => {
    console.error('Hindi lesson bundle load failed:', err);
    lessonBundles.hi = lessonBundles.en;
    return lessonBundles.en;
  });
  return hindiLessonBundlePromise;
}

async function ensureLessonBundleForLanguage(lang) {
  const normalized = normalizeUiLanguage(lang);
  activeLessonBundle = normalized === 'hi'
    ? await ensureHindiLessonBundle()
    : lessonBundles.en;
  return activeLessonBundle;
}

function refreshLessonContent() {
  buildSidebar();
  buildSugg();
  ensureDiscoveryContent();
  const topicPage = document.getElementById('tpage');
  if (currentTopicId && topicPage && topicPage.style.display !== 'none') {
    openTopic(currentTopicId, { skipComplete: true, syncRoute: false, confirmLeave: false });
  }
}

function getNormalizedPathname(pathname = window.location.pathname) {
  const value = String(pathname || '').trim() || '/';
  if (value === '/') return value;
  return value.replace(/\/+$/, '') || '/';
}

function getRequestedLanguageFromPage() {
  const params = new URLSearchParams(window.location.search);
  return normalizeUiLanguage(params.get('lang') || localStorage.getItem(UI_LANGUAGE_STORAGE_KEY) || 'en');
}

function getExplicitRequestedLanguage() {
  const params = new URLSearchParams(window.location.search);
  const rawParam = String(params.get('lang') || '').trim().toLowerCase();
  if (UI_LANGUAGE_META[rawParam]) return rawParam;
  try {
    const rawStored = String(localStorage.getItem(UI_LANGUAGE_STORAGE_KEY) || '').trim().toLowerCase();
    if (UI_LANGUAGE_META[rawStored]) return rawStored;
  } catch (_) {}
  return '';
}

function getCurrentRouteHash() {
  return String(window.location.hash || '').replace(/^#/, '');
}

function isWorkbenchRouteHash(hash = getCurrentRouteHash()) {
  return WORKBENCH_ROUTE_HASHES.has(String(hash || '').trim().toLowerCase());
}

function isCompilerPathRoute() {
  const pathname = getNormalizedPathname();
  return pathname === ENGLISH_COMPILER_PATH || pathname === VISUALIZE_PATH;
}

function getCurrentAppUrl() {
  return `${getNormalizedPathname()}${window.location.search}${window.location.hash}`;
}

function getActiveWorkbenchRouteHash() {
  const pathname = getNormalizedPathname();
  if (pathname === VISUALIZE_PATH) return 'visualize';
  if (pathname === ENGLISH_COMPILER_PATH) return 'compiler';
  const hash = getCurrentRouteHash();
  return isWorkbenchRouteHash(hash) ? hash : '';
}

function setAppUrl(target, { replace = false } = {}) {
  const current = getCurrentAppUrl();
  if (current === target) return false;
  window.history[replace ? 'replaceState' : 'pushState'](null, '', target);
  return true;
}

function getCurrentAppPath() {
  return `${window.location.pathname}${window.location.search}${window.location.hash}`;
}

function buildLoginRedirectUrl() {
  return `/login.html?next=${encodeURIComponent(getCurrentAppPath())}`;
}

function buildLanguagePageUrl(lang, routeHash = window.location.hash) {
  const normalized = normalizeUiLanguage(lang);
  const params = new URLSearchParams(window.location.search);
  if (normalized === 'en') {
    params.delete('lang');
  } else {
    params.set('lang', normalized);
  }
  const query = params.toString();
  const normalizedRoute = String(routeHash || '').replace(/^#/, '').trim().toLowerCase();
  const path = normalizedRoute === 'visualize'
    ? VISUALIZE_PATH
    : (normalizedRoute === 'compiler' ? ENGLISH_COMPILER_PATH : ENGLISH_PAGE_PATH);
  const suffix = path === ENGLISH_PAGE_PATH && routeHash ? routeHash : '';
  return `${path}${query ? `?${query}` : ''}${suffix}`;
}

function syncLanguageUrl(lang, { replace = true } = {}) {
  const normalized = normalizeUiLanguage(lang);
  const routeHash = isCompilerPathRoute()
    ? `#${getActiveWorkbenchRouteHash() || 'compiler'}`
    : (window.location.hash || '');
  return setAppUrl(buildLanguagePageUrl(normalized, routeHash), { replace });
}

function t(key, vars = {}) {
  const template = currentTranslations[key] || FALLBACK_I18N[key] || key;
  return String(template).replace(/\{\{(\w+)\}\}/g, (_m, name) => (
    Object.prototype.hasOwnProperty.call(vars, name) ? String(vars[name]) : ''
  ));
}

function setText(id, key, vars) {
  const el = document.getElementById(id);
  if (el) el.textContent = t(key, vars);
}

function setHtml(id, key, vars) {
  const el = document.getElementById(id);
  if (el) el.innerHTML = t(key, vars);
}

function setPlaceholder(id, key, vars) {
  const el = document.getElementById(id);
  if (el) el.placeholder = t(key, vars);
}

function setTitle(id, key, vars) {
  const el = document.getElementById(id);
  if (el) el.title = t(key, vars);
}

async function loadLanguagePack(lang) {
  const normalized = normalizeUiLanguage(lang);
  if (i18nCache[normalized]) return i18nCache[normalized];
  try {
    const res = await fetch(`/i18n/${normalized}.json`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`i18n ${normalized} load failed`);
    const data = await res.json();
    i18nCache[normalized] = { ...FALLBACK_I18N, ...(data || {}) };
  } catch (_) {
    i18nCache[normalized] = { ...FALLBACK_I18N };
  }
  return i18nCache[normalized];
}

function getLocalizedDefaultSuggestions() {
  return {
    intro: { title: t('home.suggestion_intro_title'), desc: t('home.suggestion_intro_desc') },
    variables: { title: t('home.suggestion_variables_title'), desc: t('home.suggestion_variables_desc') },
    for: { title: t('home.suggestion_for_title'), desc: t('home.suggestion_for_desc') },
    pointers: { title: t('home.suggestion_pointers_title'), desc: t('home.suggestion_pointers_desc') }
  };
}

function getSuggestedSampleCode(topicId) {
  const fallback = SUGGESTIONS.find((entry) => entry.id === topicId)?.sampleCode;
  if (fallback) return fallback;
  return "#include <stdio.h>\nint main() {\n    printf(\"Welcome to Memflow Ai\");\n    return 0;\n}\n";
}

function formatProgressText(profile) {
  return t('profile.progress_text', {
    percent: profile.progressPercent,
    completed: profile.completedCount,
    total: profile.totalTopics
  });
}

function applyTranslations() {
  document.title = t('meta.title');
  document.documentElement.lang = currentLanguage;
  setTitle('logo-home', 'nav.home');
  setText('nav-home', 'nav.home');
  setText('nav-learn', 'nav.learn');
  setText('nav-topics', 'nav.topics');
  setText('nav-compiler', 'nav.compiler');
  setText('nav-visualize', 'nav.visualize');
  setText('nav-chat', 'nav.chat');
  setTitle('account-btn', 'account.title');
  setText('profile-theme-label', 'profile.theme');
  setText('profile-language-label', 'profile.language');
  setText('progress-label', 'profile.progress');
  setText('btn-logout', 'profile.sign_out');
  setText('topics-head-title', 'sidebar.topics_title');
  setPlaceholder('tsearch', 'sidebar.search_placeholder');
  setHtml('hero-title', 'home.hero_title_html');
  setText('hero-subtitle', 'home.hero_subtitle');
  setText('hero-start-btn', 'home.start_coding');
  setText('hero-topics-btn', 'home.explore_topics');
  setPlaceholder('cinput', 'chat.home_placeholder');
  setTitle('copen', 'chat.open_title');
  setText('chat-note', 'chat.note');
  setText('output-label', 'compiler.output');
  setText('scanf-label', 'compiler.program_input');
  setPlaceholder('scanf-input', 'compiler.scanf_placeholder');
  setText('scanf-send', 'compiler.send_input');
  setText('debug-ai-title', 'debug.step_ai_title');
  setText('debug-ai-expand', 'debug.expand_chat');
  setText('memory-state-label', 'memory.state');
  setText('mem-overlay-title', 'memory.grid_view');
  setText('mem-struct-title', 'memory.structure');
  setText('mem-stack-head', 'memory.stack');
  setText('mem-heap-head', 'memory.heap_refs');
  setText('mem-overlay-close', 'common.close');
  setText('chat-page-title', 'chat.page_title');
  setText('chat-new-btn', 'chat.new_chat');
  setText('chat-conversation-title', 'chat.conversation');
  setText('chat-page-close', 'common.close');
  setPlaceholder('cp-input', 'chat.page_placeholder');
  const langSel = document.getElementById('profile-language');
  if (langSel) langSel.value = currentLanguage;
  const themeSel = document.getElementById('profile-theme');
  if (themeSel) themeSel.value = currentTheme;
  const runHint = document.getElementById('hint-run-shortcut');
  if (runHint) runHint.innerHTML = `${esc(t('hint.run'))}: <strong>Ctrl+Enter</strong>`;
  const stepHint = document.getElementById('hint-step-shortcut');
  if (stepHint) stepHint.innerHTML = `${esc(t('hint.step'))}: <strong>Alt+←/→</strong>`;
  const askHint = document.getElementById('hint-askai-shortcut');
  if (askHint) askHint.innerHTML = `${esc(t('hint.ask_ai'))}: <strong>Ctrl+Shift+A</strong>`;
  if (currentProfile) {
    const progText = document.getElementById('acc-prog-text');
    if (progText) progText.textContent = formatProgressText(currentProfile);
  }
  if (typeof window.__applyTerminalSplitLayout === 'function') {
    window.__applyTerminalSplitLayout(false);
  }
  if (!runActive) {
    setTerminalSummary(t('compiler.idle'));
  }
  const activeMessages = getActiveChatMessages();
  if (!activeMessages.length && step < 0) {
    const at = document.getElementById('debug-ai-text');
    if (at) at.textContent = t('debug.default_text');
  } else if (activeMessages.length) {
    const at = document.getElementById('debug-ai-text');
    if (at) at.textContent = t('debug.shared_chat_hint');
  }
  renderExecutionStory();
  renderMemoryMap(buildSnapshotForStep(step) || {}, history_[step]?.name || '');
  renderMemoryInsight(step >= 0 ? history_[step] : null, buildSnapshotForStep(step));
  refreshToolbarLabels();
  buildSugg();
  renderChatWindow();
  renderStepAiHistory();
  updateWorkbenchHint();
  syncNavToCurrentView();
}

async function setUiLanguage(lang, { persist = true } = {}) {
  const normalized = normalizeUiLanguage(lang);
  currentTranslations = await loadLanguagePack(normalized);
  await ensureLessonBundleForLanguage(normalized);
  currentLanguage = normalized;
  if (persist) localStorage.setItem(UI_LANGUAGE_STORAGE_KEY, normalized);
  applyTranslations();
  refreshLessonContent();
  return normalized;
}

function refreshToolbarLabels() {
  const runBtn = document.getElementById('runbtn');
  if (runBtn) runBtn.textContent = runActive ? t('compiler.stop') : t('compiler.run');
  setText('prevbtn', 'compiler.prev');
  setText('nextbtn', 'compiler.next');
  setText('vprev', 'compiler.prev');
  setText('vnext', 'compiler.next');
  setText('mem-prev', 'compiler.prev');
  setText('mem-next', 'compiler.next');
  const selBtn = document.getElementById('selbtn');
  if (selBtn) selBtn.textContent = lineSelectMode ? t('compiler.selecting_lines') : t('compiler.select_lines');
  const memBtn = document.getElementById('membtn');
  if (memBtn) memBtn.textContent = memoryViewOpen ? t('compiler.hide_memory_view') : t('compiler.memory_view');
  setText('askbtn', 'compiler.ask_line_ai');
  setText('xbtn', 'common.close');
}

/* ─────────────────────────────────────────────
   BUILD UI
───────────────────────────────────────────── */
function buildSidebar() {
  const c = document.getElementById('tlist');
  if (!c) return;
  c.innerHTML = '';
  Object.entries(TOPICS).forEach(([grp, ids]) => {
    const g = document.createElement('div');
    g.className = 'tgrp';
    g.innerHTML = `<div class="tghd">${getTopicGroupLabel(grp)}</div>` +
      ids.map(id => {
        const m = getTopicMeta(id);
        return `<div class="ti" data-id="${id}" onclick="openTopic('${id}')">${m.title}</div>`;
      }).join('');
    c.appendChild(g);
  });
}

function addCopyButtonsToTopicSnippets() {
  const blocks = document.querySelectorAll('#tpage .cblk');
  blocks.forEach((block, idx) => {
    if (block.querySelector('.copybtn')) return;
    const btn = document.createElement('button');
    btn.className = 'copybtn';
    btn.type = 'button';
    btn.textContent = t('common.copy');
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      e.stopPropagation();
      const label = block.querySelector('.cbl');
      const code = block.textContent.replace(label ? label.textContent : '', '').trim();
      try {
        await navigator.clipboard.writeText(code);
        btn.textContent = t('common.copied');
        setTimeout(() => { btn.textContent = t('common.copy'); }, 1200);
      } catch (_) {
        btn.textContent = t('common.failed');
        setTimeout(() => { btn.textContent = t('common.copy'); }, 1200);
      }
    });
    block.appendChild(btn);
  });
}

function buildSugg() {
  const grid = document.getElementById('sgrid');
  if (!grid) return;
  const fallbackLocalized = getLocalizedDefaultSuggestions();
  const list = (recommendedTopics && recommendedTopics.length > 0)
    ? recommendedTopics.map(r => {
        const meta = getTopicMeta(r.topicId) || { title: r.topicId, sub: 'Recommended practice' };
        return {
          icon: meta.icon || '📘',
          id: r.topicId,
          title: meta.title,
          desc: r.reason || meta.sub,
          sampleCode: r.sampleCode || getSuggestedSampleCode(r.topicId)
        };
      })
    : SUGGESTIONS.map(s => ({
        ...s,
        title: fallbackLocalized[s.id]?.title || s.title,
        desc: fallbackLocalized[s.id]?.desc || s.desc,
        sampleCode: s.sampleCode || getSuggestedSampleCode(s.id)
      }));

  const label = document.getElementById('sg-label');
  if (label) label.textContent = (recommendedTopics && recommendedTopics.length > 0)
    ? t('home.recommended_practice')
    : t('home.start_learning');
  suggestedSamples = list.map(s => s.sampleCode || getSuggestedSampleCode(s.id));

  grid.innerHTML = list.map((s, idx)=>`
    <div class="sc" style="--d:${70 + idx * 45}ms" onclick="openTopic('${s.id}')">
      <div class="sc-t">${s.title}</div>
      <div class="sc-d">${s.desc}</div>
      ${s.sampleCode ? `<button class="trybtn" onclick="event.stopPropagation(); trySuggested(${idx});">${esc(t('home.practice'))}</button>` : ''}
    </div>`).join('');
}

function ensureDiscoveryContent() {
  const topicList = document.getElementById('tlist');
  const suggestionGrid = document.getElementById('sgrid');
  if (topicList && !topicList.children.length && !String(topicList.innerHTML || '').trim()) {
    buildSidebar();
  }
  if (suggestionGrid && !suggestionGrid.children.length && !String(suggestionGrid.innerHTML || '').trim()) {
    buildSugg();
  }
}

function trySuggested(idx) {
  const code = suggestedSamples[idx];
  if (!code) return;
  tryCode(code);
}


function buildHomeParticles() {
  const host = document.getElementById('home-particles');
  if (!host) return;
  const isMobile = window.innerWidth <= 900;
  const count = isMobile ? 38 : 72;
  let html = '';
  for (let i = 0; i < count; i++) {
    const left = Math.random() * 100;
    const top = Math.random() * 100;
    const delay = (Math.random() * 4).toFixed(2);
    const dur = (3.2 + Math.random() * 3.8).toFixed(2);
    const size = (1 + Math.random() * 2.2).toFixed(2);
    html += `<span class="home-dot" style="left:${left}%;top:${top}%;width:${size}px;height:${size}px;--delay:${delay}s;--dur:${dur}s"></span>`;
  }
  host.innerHTML = html;
}

function filterT(q) {
  q = q.toLowerCase();
  document.querySelectorAll('.ti').forEach(el => {
    el.style.display = el.textContent.toLowerCase().includes(q) ? '' : 'none';
  });
  document.querySelectorAll('.tghd').forEach(hd => {
    const grp = hd.parentElement;
    const vis = [...grp.querySelectorAll('.ti')].some(i => i.style.display !== 'none');
    hd.style.display = vis ? '' : 'none';
  });
}

/* ─────────────────────────────────────────────
   VIEWS
───────────────────────────────────────────── */
function goHome(btn, { syncRoute = true, confirmLeave = true } = {}) {
  if (confirmLeave && !confirmLeaveWorkbench()) return;
  if (syncRoute) {
    setAppUrl(buildLanguagePageUrl(getRequestedLanguageFromPage(), '#home'));
  }
  setTerminalWide(false);
  setNavPill(btn);
  if (rightOpen) closeRight({ syncRoute: false });
  currentTopicId = null;
  document.getElementById('home').style.display = '';
  document.getElementById('tpage').style.display = 'none';
  syncNavToCurrentView();
}

function goLearn(btn, options = {}) {
  setTerminalWide(false);
  openTopic('intro', { ...options, navButton: btn });
}

function goCompiler(btn, { syncRoute = true } = {}) {
  setTerminalWide(false);
  setNavPill(btn);
  openRight('', 'compiler', { syncRoute });
}

function goVisualize(btn, { syncRoute = true } = {}) {
  setTerminalWide(false);
  setNavPill(btn);
  openRight('', 'visualize', { syncRoute });
}

function toggleTopicsFromNav() {
  if (!confirmLeaveWorkbench()) return;
  setTerminalWide(false);
  if (rightOpen) closeRight({ syncRoute: false });
  if (!leftOpen) {
    leftOpen = true;
    document.getElementById('lp').classList.remove('shut');
  } else {
    leftOpen = false;
    document.getElementById('lp').classList.add('shut');
  }
  syncBodyClasses();
}

function confirmLeaveWorkbench() {
  if (!rightOpen && !getActiveWorkbenchRouteHash()) return true;
  return window.confirm(t('confirm.leave_workbench'));
}

function setNavPill(btn) {
  if (chatPageOpen) closeChatPage();
  document.querySelectorAll('.npill[data-route="true"], #nav-chat').forEach(p => p.classList.remove('on'));
  if (btn) btn.classList.add('on');
}

function openTopic(id, { skipComplete = false, syncRoute = true, confirmLeave = true, navButton = null } = {}) {
  if (confirmLeave && !confirmLeaveWorkbench()) return;
  if (syncRoute) {
    setAppUrl(buildLanguagePageUrl(getRequestedLanguageFromPage(), `#topic:${id}`));
  }
  const m = getTopicMeta(id); const c = getTopicContent(id);
  if (!m) return;
  currentTopicId = id;
  if (rightOpen) closeRight({ syncRoute: false });

  document.getElementById('home').style.display = 'none';
  const tp = document.getElementById('tpage');
  tp.style.display = 'block';
  tp.scrollTop = 0;

  let grp = '';
  Object.entries(TOPICS).forEach(([g, ids]) => { if (ids.includes(id)) grp = g; });

  tp.innerHTML = `
    <div class="tbread">${getLessonRootLabel()} › ${getTopicGroupLabel(grp)} › <em>${m.title}</em></div>
    <h1 class="tptitle">${m.title}</h1>
    <p class="tpsub">${m.sub}</p>
    ${c.sections.map(s=>`<div class="tsec"><h3>${s.h}</h3>${s.c}</div>`).join('')}
  `;
  addCopyButtonsToTopicSnippets();

  document.querySelectorAll('.ti').forEach(el => el.classList.toggle('on', el.dataset.id === id));
  setNavPill(navButton || document.getElementById('nav-learn'));
  if (!skipComplete) markTopicComplete(id);
  syncNavToCurrentView();

  if (window.innerWidth <= 900) closeMob();
}

function restoreRouteFromLocation() {
  if (isCompilerPathRoute()) {
    const navId = getNormalizedPathname() === VISUALIZE_PATH ? 'nav-visualize' : 'nav-compiler';
    const action = getNormalizedPathname() === VISUALIZE_PATH ? goVisualize : goCompiler;
    action(document.getElementById(navId), { syncRoute: false });
    return;
  }
  const hash = (window.location.hash || '').replace(/^#/, '');
  if (!hash || hash === 'home') {
    goHome(document.getElementById('nav-home'), { syncRoute: false, confirmLeave: false });
    return;
  }
  if (hash === 'compiler') {
    goCompiler(document.getElementById('nav-compiler'), { syncRoute: false });
    return;
  }
  if (hash === 'visualize') {
    goVisualize(document.getElementById('nav-visualize'), { syncRoute: false });
    return;
  }
  if (hash.startsWith('topic:')) {
    const id = hash.slice('topic:'.length);
    if (getTopicMeta(id)) {
      openTopic(id, { syncRoute: false, confirmLeave: false });
      return;
    }
  }
  goHome(document.getElementById('nav-home'), { syncRoute: false, confirmLeave: false });
}

function tryCode(raw) {
  const ta = document.createElement('textarea');
  ta.innerHTML = raw;
  const code = ta.value;
  openRight(code);
}

/* ─────────────────────────────────────────────
   PANEL CONTROLS
───────────────────────────────────────────── */
let leftOpen = false, rightOpen = false;

function syncBodyClasses() {
  const topicsNav = document.getElementById('nav-topics');
  if (topicsNav) topicsNav.classList.toggle('on', leftOpen);
}

function toggleLeft() {
  leftOpen = !leftOpen;
  document.getElementById('lp').classList.toggle('shut', !leftOpen);
  syncBodyClasses();
}

function toggleRight() {
  rightOpen = !rightOpen;
  const rp = document.getElementById('rp');
  rp.classList.toggle('open', rightOpen);
  rp.classList.remove('big');
  document.getElementById('lp').style.visibility = '';
  document.getElementById('center').style.display = '';
  if (rightOpen) void prepareEditor('', 300);
  syncBodyClasses();
}

function openRight(code, routeHash = 'compiler', { syncRoute = true } = {}) {
  const targetHash = String(routeHash || 'compiler').replace(/^#/, '') || 'compiler';
  if (syncRoute) {
    setAppUrl(buildLanguagePageUrl(getRequestedLanguageFromPage(), `#${targetHash}`));
  }
  rightOpen = true;
  const rp = document.getElementById('rp');
  rp.classList.add('open');
  rp.classList.remove('big');
  document.getElementById('lp').style.visibility = '';
  document.getElementById('center').style.display = '';
  void prepareEditor(code || '', 320);
  syncBodyClasses();
  syncNavToCurrentView();
}

function closeRight({ syncRoute = true } = {}) {
  if (syncRoute) {
    const workbenchRoute = getActiveWorkbenchRouteHash();
    if (workbenchRoute) {
      const fallbackRoute = currentTopicId ? `#topic:${currentTopicId}` : '#home';
      setAppUrl(buildLanguagePageUrl(getRequestedLanguageFromPage(), fallbackRoute));
    }
  }
  setTerminalWide(false);
  rightOpen = false;
  const rp = document.getElementById('rp');
  rp.classList.remove('open');
  rp.classList.remove('big');
  document.getElementById('lp').style.visibility = '';
  document.getElementById('center').style.display = '';
  syncBodyClasses();
  if (syncRoute) syncNavToCurrentView();
}

/* rtab kept for compatibility (chat handler calls it) */
function rtab(t, btn) {
  /* In split-view there are no tab switches; both panes always visible */
  if (editor) setTimeout(() => editor.layout(), 40);
}

/* ─────────────────────────────────────────────
   MOBILE
───────────────────────────────────────────── */
function mobLeft() {
  const lp = document.getElementById('lp');
  const ov = document.getElementById('overlay');
  if (lp.classList.contains('mob')) { closeMob(); return; }
  closeMob();
  lp.classList.add('mob');
  ov.classList.add('on');
}

function mobRight() {
  const rp = document.getElementById('rp');
  const ov = document.getElementById('overlay');
  if (rp.classList.contains('mob')) { closeMob(); return; }
  closeMob();
  rp.classList.add('mob');
  ov.classList.add('on');
  void prepareEditor('', 300);
}

function closeMob() {
  document.getElementById('lp').classList.remove('mob');
  document.getElementById('rp').classList.remove('mob');
  document.getElementById('overlay').classList.remove('on');
}

/* ─────────────────────────────────────────────
   SPLITTER
───────────────────────────────────────────── */
(function(){
  const sp = document.getElementById('spltr');
  const pane = document.getElementById('editor-pane');
  if (!sp || !pane) return;

  const TERMINAL_SPLIT_STORAGE_KEY = 'memflow_terminal_split_ratio_v3';
  const TERMINAL_DEFAULT_RATIO = 0.34;
  const TERMINAL_COLLAPSE_SNAP_RATIO = 0.05;
  const TERMINAL_MAXIMIZE_SNAP_RATIO = 0.96;
  let drag=false, sy=0, sh=0, pointerId=null;

  function clampTerminalRatio(value) {
    if (!Number.isFinite(value)) return TERMINAL_DEFAULT_RATIO;
    return Math.max(0, Math.min(1, value));
  }

  function normalizeTerminalRatio(value) {
    const ratio = clampTerminalRatio(value);
    if (ratio <= TERMINAL_COLLAPSE_SNAP_RATIO) return 0;
    if (ratio >= TERMINAL_MAXIMIZE_SNAP_RATIO) return 1;
    return ratio;
  }

  function readSavedTerminalRatio() {
    try {
      const raw = localStorage.getItem(TERMINAL_SPLIT_STORAGE_KEY);
      if (raw == null) return TERMINAL_DEFAULT_RATIO;
      return normalizeTerminalRatio(Number(raw));
    } catch (_) {
      return TERMINAL_DEFAULT_RATIO;
    }
  }

  function persistTerminalRatio(ratio) {
    try {
      localStorage.setItem(TERMINAL_SPLIT_STORAGE_KEY, String(ratio));
    } catch (_) {}
  }

  function getVisibleDockHeight() {
    const dock = document.getElementById('scanf-dock');
    return dock && dock.classList.contains('on') ? dock.offsetHeight : 0;
  }

  function getAvailableTerminalHeight() {
    return Math.max(0, pane.clientHeight - sp.offsetHeight - getVisibleDockHeight());
  }

  function syncTerminalResizeUi() {
    const wrap = document.getElementById('termwrap');
    const btn = document.getElementById('term-wide-arrow');
    if (!wrap) return;
    const collapsed = terminalSplitRatio === 0;
    wrap.classList.toggle('collapsed', collapsed);
    wrap.classList.toggle('maximized', terminalWide);
    pane.classList.toggle('dragging-terminal', drag);
    sp.classList.toggle('collapsed', collapsed);
    sp.dataset.label = collapsed
      ? t('compiler.output_hidden')
      : (terminalWide ? t('compiler.output_maximized') : t('compiler.output_drag'));
    if (btn) {
      btn.textContent = terminalWide ? t('compiler.restore') : t('compiler.maximize');
      btn.title = terminalWide ? t('compiler.restore') : t('compiler.maximize');
    }
  }

  window.__applyTerminalSplitLayout = function applyTerminalSplitLayout(persist = true) {
    const wrap = document.getElementById('termwrap');
    if (!wrap) return;
    const available = getAvailableTerminalHeight();
    const target = Math.round(available * terminalSplitRatio);
    wrap.style.height = `${target}px`;
    syncTerminalResizeUi();
    if (persist) persistTerminalRatio(terminalSplitRatio);
    const monacoEditor = window.monacoEditorInstance;
    if (monacoEditor) requestAnimationFrame(() => monacoEditor.layout());
  };

  window.__setTerminalSplitRatio = function setTerminalSplitRatio(nextRatio, { persist = true, remember = true } = {}) {
    terminalSplitRatio = normalizeTerminalRatio(nextRatio);
    if (remember && terminalSplitRatio > 0 && terminalSplitRatio < 1) {
      terminalSplitBeforeMax = terminalSplitRatio;
    }
    terminalWide = terminalSplitRatio === 1;
    window.__applyTerminalSplitLayout(persist);
  };

  terminalSplitRatio = readSavedTerminalRatio();
  if (terminalSplitRatio > 0 && terminalSplitRatio < 1) {
    terminalSplitBeforeMax = terminalSplitRatio;
  }
  window.__applyTerminalSplitLayout(false);

  sp.addEventListener('pointerdown', e => {
    drag = true;
    pointerId = e.pointerId;
    sy = e.clientY;
    sh = document.getElementById('termwrap')?.offsetHeight || 0;
    sp.classList.add('drag');
    pane.classList.add('dragging-terminal');
    if (typeof sp.setPointerCapture === 'function') {
      try { sp.setPointerCapture(pointerId); } catch (_) {}
    }
    e.preventDefault();
  });

  document.addEventListener('pointermove', e => {
    if (!drag) return;
    const available = getAvailableTerminalHeight();
    if (!available) return;
    const nextHeight = Math.max(0, Math.min(available, sh + (sy - e.clientY)));
    window.__setTerminalSplitRatio(nextHeight / available, { persist: false });
  });

  function endDrag() {
    if (!drag) return;
    drag = false;
    pointerId = null;
    sp.classList.remove('drag');
    pane.classList.remove('dragging-terminal');
    window.__applyTerminalSplitLayout(true);
  }

  document.addEventListener('pointerup', endDrag);
  document.addEventListener('pointercancel', endDrag);
  window.addEventListener('resize', () => window.__applyTerminalSplitLayout(false));
})();

/* ─────────────────────────────────────────────
   CHAT BAR
───────────────────────────────────────────── */
function ar(el) { el.style.height='auto'; el.style.height=Math.min(el.scrollHeight,90)+'px'; }
function ckd(e) { if (e.key==='Enter'&&!e.shiftKey){ e.preventDefault(); sendChat(); } }

const chatSessions = [];
let activeChatId = null;
let chatPageOpen = false;
const CHAT_LOCAL_KEY_PREFIX = 'memflow_chat_sessions_v1';

function getChatLocalKey() {
  const uid = currentUser?.userId || 'anon';
  return `${CHAT_LOCAL_KEY_PREFIX}:${uid}`;
}

function sanitizeClientChatSessions(rawSessions) {
  if (!Array.isArray(rawSessions)) return [];
  return rawSessions
    .filter(s => s && typeof s === 'object')
    .slice(0, 20)
    .map((s, idx) => ({
      id: String(s.id || `chat-${Date.now()}-${idx}`).slice(0, 80),
      title: String(s.title || 'Chat').slice(0, 120),
      messages: (Array.isArray(s.messages) ? s.messages : [])
        .filter(m => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
        .slice(-100)
        .map(m => ({ role: m.role, content: String(m.content).slice(0, 12000) }))
    }));
}

function applyChatSessions(sessions) {
  const clean = sanitizeClientChatSessions(sessions);
  chatSessions.splice(0, chatSessions.length, ...clean);
  if (!chatSessions.length) {
    activeChatId = null;
  } else if (!chatSessions.some(c => c.id === activeChatId)) {
    activeChatId = chatSessions[0].id;
  }
}

function loadChatSessionsFromLocal() {
  try {
    const raw = JSON.parse(localStorage.getItem(getChatLocalKey()) || '[]');
    applyChatSessions(raw);
  } catch (_) {
    applyChatSessions([]);
  }
}

function persistChatSessionsToLocal() {
  try {
    localStorage.setItem(getChatLocalKey(), JSON.stringify(chatSessions));
  } catch (_) {}
}

async function persistChatSessions() {
  persistChatSessionsToLocal();
  try {
    if (!token) return;
    await authFetch('/api/chat/sessions', {
      method:'POST',
      body: JSON.stringify({ sessions: chatSessions })
    });
  } catch (_) {}
}

async function loadChatSessions() {
  loadChatSessionsFromLocal();
  renderChatSessions();
  renderChatWindow();
  try {
    const res = await authFetch('/api/chat/sessions');
    if (!res.ok) return;
    const data = await res.json().catch(() => ({}));
    const remoteSessions = sanitizeClientChatSessions(data.sessions || []);
    if (remoteSessions.length > 0) {
      applyChatSessions(remoteSessions);
      persistChatSessionsToLocal();
      renderChatSessions();
      renderChatWindow();
      return;
    }
    if (chatSessions.length > 0) {
      await persistChatSessions();
    }
  } catch (_) {}
}

function openChatHub() {
  openChatPage();
}

function openChatPage() {
  const cp = document.getElementById('chat-page');
  const layout = document.getElementById('layout');
  if (!cp || !layout) return;
  chatPageOpen = true;
  layout.style.display = 'none';
  cp.classList.add('on');
  syncNavToCurrentView();
  renderChatSessions();
  renderChatWindow();
}

function closeChatPage() {
  const cp = document.getElementById('chat-page');
  const layout = document.getElementById('layout');
  if (!cp || !layout) return;
  chatPageOpen = false;
  cp.classList.remove('on');
  layout.style.display = 'flex';
  syncNavToCurrentView();
}

function newChat(seedMessage='', { open = true } = {}) {
  const nextIdx = chatSessions.length + 1;
  const id = 'chat-' + Date.now() + '-' + nextIdx;
  const title = seedMessage
    ? seedMessage.slice(0, 28)
    : `${t('chat.default_title_prefix')} ${nextIdx}`;
  chatSessions.unshift({ id, title, messages: [] });
  activeChatId = id;
  renderChatSessions();
  renderChatWindow();
  if (open) openChatPage();
  persistChatSessions();
  return chatSessions[0];
}

function ensureActiveChat(seedMessage = '', { open = false } = {}) {
  let chat = getActiveChat();
  if (!chat) {
    chat = newChat(seedMessage, { open });
  }
  return chat;
}

function getActiveChat() {
  if (!activeChatId) return null;
  return chatSessions.find(c => c.id === activeChatId) || null;
}

function getActiveChatMessages(limit = 0) {
  const messages = Array.isArray(getActiveChat()?.messages) ? getActiveChat().messages : [];
  return limit > 0 ? messages.slice(-limit) : messages;
}

function appendMessageToChat(chat, role, content) {
  if (!chat || !content) return;
  chat.messages.push({ role, content: String(content) });
  if (chat.messages.length > 100) {
    chat.messages.splice(0, chat.messages.length - 100);
  }
}

function renderChatMessageMarkup(message) {
  const role = message.role === 'user' ? 'user' : 'assistant';
  const body = role === 'assistant'
    ? formatAssistantMessage(message.content)
    : `<div class="chat-text">${formatInlineMessage(message.content)}</div>`;
  return `
    <div class="chat-msg ${role}">
      <div class="chat-bubble">${body}</div>
    </div>
  `;
}

function renderChatMessages(host, messages, { emptyText, limit = 0 } = {}) {
  if (!host) return;
  const visible = limit > 0 ? messages.slice(-limit) : messages;
  if (!visible.length) {
    host.innerHTML = `<div class="chat-text">${esc(emptyText || t('chat.page_empty'))}</div>`;
    return;
  }
  host.innerHTML = visible.map(renderChatMessageMarkup).join('');
  host.scrollTop = host.scrollHeight;
}

function syncNavToCurrentView() {
  document.documentElement.dataset.routeMode = getActiveWorkbenchRouteHash() || 'default';
  document.querySelectorAll('.npill[data-route="true"], #nav-chat').forEach((p) => p.classList.remove('on'));
  if (chatPageOpen) {
    const chatBtn = document.getElementById('nav-chat');
    if (chatBtn) chatBtn.classList.add('on');
    refreshHeaderActions();
    return;
  }
  const topicPage = document.getElementById('tpage');
  const hash = (window.location.hash || '').replace(/^#/, '');
  const workbenchRoute = getActiveWorkbenchRouteHash();
  let activeId = 'nav-home';
  if (workbenchRoute === 'visualize') {
    activeId = 'nav-visualize';
  } else if (workbenchRoute === 'compiler' || rightOpen) {
    activeId = 'nav-compiler';
  } else if (hash.startsWith('topic:') || topicPage?.style.display === 'block') {
    activeId = 'nav-learn';
  }
  const activeBtn = document.getElementById(activeId);
  if (activeBtn) activeBtn.classList.add('on');
  refreshHeaderActions();
}

function renderChatSessions() {
  const host = document.getElementById('chat-page-sessions');
  if (!host) return;
  host.innerHTML = chatSessions.map(c => `
    <div class="chat-session-row">
      <button class="chat-tab ${c.id === activeChatId ? 'on' : ''}" onclick="selectChat('${c.id}')" title="${esc(c.title)}">${esc(c.title)}</button>
      <button class="chat-delete" type="button" onclick="deleteChat('${c.id}', event)" title="${esc(t('chat.delete'))}">✕</button>
    </div>
  `).join('');
}

function renderChatWindow() {
  const host = document.getElementById('chat-page-window');
  const messages = getActiveChatMessages();
  const status = document.getElementById('debug-ai-text');
  if (status) {
    status.textContent = messages.length
      ? t('debug.shared_chat_hint')
      : (step < 0 ? t('debug.default_text') : t('debug.step_prompt'));
  }
  if (host) {
    renderChatMessages(host, messages, { emptyText: t('chat.page_empty') });
  }
  renderStepAiHistory();
}

function formatInlineMessage(text) {
  const escaped = esc(String(text || ''));
  return escaped
    .replace(/`([^`]+)`/g, (_m, code) => {
      const safe = code.replace(/'/g, '&#39;');
      return `<span class="chat-inline-code"><code>${code}</code><button class="chat-copy-inline" onclick="copyInlineCode('${safe}')">${esc(t('common.copy'))}</button></span>`;
    })
    .replace(/\n/g, '<br>');
}

function formatAssistantMessage(text) {
  const raw = String(text || '');
  const codeRe = /```([a-zA-Z0-9_-]+)?\n?([\s\S]*?)```/g;
  let out = '';
  let lastIdx = 0;
  let match;

  while ((match = codeRe.exec(raw)) !== null) {
    const before = raw.slice(lastIdx, match.index);
    if (before.trim()) {
      out += `<div class="chat-text">${formatInlineMessage(before)}</div>`;
    }

    const code = match[2] || '';
    out += `
      <div class="chat-code">
        <button class="chat-copy" onclick="copyChatCode(this)">${esc(t('common.copy'))}</button>
        <pre><code>${esc(code).trim()}</code></pre>
      </div>
    `;

    lastIdx = codeRe.lastIndex;
  }

  const rest = raw.slice(lastIdx);
  if (rest.trim() || !out) {
    out += `<div class="chat-text">${formatInlineMessage(rest || raw)}</div>`;
  }

  // If AI returns code-like plain text without fenced blocks, still provide a copy action.
  if (!out.includes('chat-code') && looksLikeCode(raw)) {
    out += `
      <div class="chat-code">
        <button class="chat-copy" onclick="copyChatText(this)">${esc(t('common.copy'))}</button>
        <pre><code>${esc(raw).trim()}</code></pre>
      </div>
    `;
  }

  return out;
}

async function copyChatCode(btn) {
  const codeEl = btn?.parentElement?.querySelector('pre code');
  if (!codeEl) return;
  try {
    await navigator.clipboard.writeText(codeEl.textContent || '');
    btn.textContent = t('common.copied');
    setTimeout(() => { btn.textContent = t('common.copy'); }, 1200);
  } catch (_) {
    btn.textContent = t('common.failed');
    setTimeout(() => { btn.textContent = t('common.copy'); }, 1200);
  }
}

async function copyChatText(btn) {
  const codeEl = btn?.parentElement?.querySelector('pre code');
  if (!codeEl) return;
  try {
    await navigator.clipboard.writeText(codeEl.textContent || '');
    btn.textContent = t('common.copied');
    setTimeout(() => { btn.textContent = t('common.copy'); }, 1200);
  } catch (_) {
    btn.textContent = t('common.failed');
    setTimeout(() => { btn.textContent = t('common.copy'); }, 1200);
  }
}

async function copyInlineCode(code) {
  try {
    await navigator.clipboard.writeText(String(code || ''));
  } catch (_) {}
}

function looksLikeCode(text) {
  const t = String(text || '');
  if (!t.trim()) return false;
  return /#include|int\s+main\s*\(|printf\s*\(|scanf\s*\(|\{[\s\S]*\}|;/.test(t);
}

function selectChat(id) {
  activeChatId = id;
  renderChatSessions();
  renderChatWindow();
  openChatPage();
  persistChatSessionsToLocal();
}

async function deleteChat(id, event) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }
  const idx = chatSessions.findIndex(c => c.id === id);
  if (idx < 0) return;
  chatSessions.splice(idx, 1);
  if (activeChatId === id) {
    activeChatId = chatSessions[0]?.id || null;
  }
  renderChatSessions();
  renderChatWindow();
  await persistChatSessions();
}

function renderStepAiHistory() {
  const host = document.getElementById('debug-ai-history');
  if (!host) return;
  renderChatMessages(host, getActiveChatMessages(10), { emptyText: t('debug.no_explanations') });
}

async function sendChat(source='home') {
  const inp = source === 'chatPage'
    ? document.getElementById('cp-input')
    : document.getElementById('cinput');
  const sendBtn = source === 'chatPage'
    ? document.getElementById('cp-send')
    : document.getElementById('csend');
  if (!inp || !sendBtn) return;
  const q = inp.value.trim();
  if (!q) return;
  inp.value = ''; inp.style.height = '';

  // Otherwise ask AI
  sendBtn.disabled = true; sendBtn.textContent = '…';
  const chat = ensureActiveChat(q, { open: true });
  appendMessageToChat(chat, 'user', q);
  renderChatWindow();
  openChatPage();
  await persistChatSessions();

  try {
    const shortContext = chat.messages.slice(-6);
    const res = await authFetch('/api/chat', {
      method:'POST',
      body:JSON.stringify({ question: q, messages: shortContext, preferredLanguage: currentLanguage })
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.answer || data.error || 'Chat request failed.');
    }
    appendMessageToChat(chat, 'assistant', data.answer || t('debug.no_explanation'));
    const status = document.getElementById('debug-ai-text');
    if (status) status.textContent = t('debug.shared_chat_hint');
    renderChatWindow();
    await persistChatSessions();
    showToast(`💬 ${t('chat.reply_added')}`, '#007acc', 2200);
  } catch(e) {
    appendMessageToChat(chat, 'assistant', `⚠️ ${e.message || t('chat.unavailable')}`);
    renderChatWindow();
    await persistChatSessions();
    showToast(`⚠️ ${t('chat.unavailable')}`);
  } finally {
    sendBtn.disabled = false; sendBtn.textContent = '↑';
  }
}

/* ─────────────────────────────────────────────
   AUTH
───────────────────────────────────────────── */
let socket=null, editor=null, decorations=[], history_=[], step=-1, obuf='', token=null;
let currentTheme='dark';
let currentUser={ userId:'local-dev-123', name:'Tester', email:'tester@local.com' };
let currentProfile=null;
let recommendedTopics=[];
let authConfigPromise=null;
let lineSelectMode = false;
let selectionDecorations = [];
let runActive = false;
let runVisibleTerminalOutput = false;
let runCompletionHandled = false;
let runLastExitCode = null;
let memoryViewOpen = false;
let outputLineContext = null;
let memoryOverlaySelection = null;
let disconnectWarnTimer = null;
let socketErrorCount = 0;
let lastSocketErrorMessage = '';
let socketInitPromise = null;
let runDispatchAcknowledged = false;
let _runDispatchWarnTimeout = null;
const DEFAULT_EDITOR_CODE = '#include <stdio.h>\nint main() {\n    printf("Welcome to Memflow Ai");\n    return 0;\n}';
const MONACO_BASE_URL = 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.36.1/min';
const MONACO_VS_PATH = `${MONACO_BASE_URL}/vs`;
const MONACO_LOADER_URL = `${MONACO_BASE_URL}/vs/loader.min.js`;
const MONACO_CSS_URL = `${MONACO_BASE_URL}/vs/editor/editor.main.min.css`;
const LEADER_LINE_URL = 'https://cdnjs.cloudflare.com/ajax/libs/leader-line/1.0.7/leader-line.min.js';
let monacoLoaderPromise = null;
let monacoEditorPromise = null;
let leaderLinePromise = null;
let pendingEditorValue = DEFAULT_EDITOR_CODE;

async function getAuthConfig() {
  if (!authConfigPromise) {
    authConfigPromise = fetch('/api/auth/config')
      .then(res => res.ok ? res.json() : null)
      .catch(() => null);
  }
  return authConfigPromise;
}

function applyTheme(theme) {
  currentTheme = theme === 'light' ? 'light' : 'dark';
  document.body.classList.toggle('light', currentTheme === 'light');
  const sel = document.getElementById('profile-theme');
  if (sel) sel.value = currentTheme;
  localStorage.setItem('memflow_theme', currentTheme);
}

function initTheme() {
  const saved = localStorage.getItem('memflow_theme');
  applyTheme(saved === 'light' ? 'light' : 'dark');
}

function toggleTheme() {
  applyTheme(currentTheme === 'light' ? 'dark' : 'light');
}

function toggleAccountMenu() {
  const menu = document.getElementById('account-menu');
  if (!menu) return;
  closeQuickLanguageMenu();
  menu.classList.toggle('on');
}

function closeAccountMenu() {
  const menu = document.getElementById('account-menu');
  if (menu) menu.classList.remove('on');
}

function closeQuickLanguageMenu() {
  const menu = document.getElementById('quick-language-menu');
  if (menu) menu.classList.remove('on');
}

function renderQuickLanguageMenu() {
  const host = document.getElementById('quick-language-menu');
  if (!host) return;
  host.innerHTML = Object.entries(UI_LANGUAGE_META).map(([code, label]) => `
    <button class="quick-lang-btn ${code === currentLanguage ? 'on' : ''}" type="button" onclick="selectQuickLanguage('${code}')">
      <span>${esc(label)}</span>
      <span class="quick-lang-check">${code === currentLanguage ? '✓' : ''}</span>
    </button>
  `).join('');
}

function toggleQuickLanguageMenu() {
  const menu = document.getElementById('quick-language-menu');
  if (!menu) return;
  closeAccountMenu();
  renderQuickLanguageMenu();
  menu.classList.toggle('on');
}

async function selectQuickLanguage(lang) {
  const next = normalizeUiLanguage(lang);
  closeQuickLanguageMenu();
  if (next === currentLanguage) return;
  syncProfileLanguageControls(next);
  await onProfileLanguageChange(next);
}

function isTopicViewVisible() {
  const topicPage = document.getElementById('tpage');
  return Boolean(currentTopicId && topicPage && topicPage.style.display !== 'none');
}

function downloadBlobFile(filename, content, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const href = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = href;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(href), 1500);
}

function buildTopicDownloadHtml() {
  const topicPage = document.getElementById('tpage');
  if (!topicPage) return '';
  const clone = topicPage.cloneNode(true);
  clone.querySelectorAll('button').forEach((node) => node.remove());
  clone.querySelectorAll('[onclick]').forEach((node) => node.removeAttribute('onclick'));
  const title = getTopicMeta(currentTopicId)?.title || 'Topic';
  return `<!DOCTYPE html>
<html lang="${esc(currentLanguage)}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(title)} - MemFlow AI</title>
<style>
body{margin:0;padding:32px;background:#07111c;color:#eaf7ff;font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;line-height:1.7}
main{max-width:900px;margin:0 auto}
.tbread{font-size:14px;color:#7fb5c6;margin-bottom:12px}
.tptitle{font-size:34px;line-height:1.15;margin:0 0 10px;color:#ffffff}
.tpsub{font-size:18px;color:#b9dbe7;margin:0 0 26px}
.tsec{margin:0 0 24px;padding:20px 22px;border:1px solid rgba(255,255,255,.12);border-radius:16px;background:rgba(255,255,255,.03)}
.tsec h3{margin:0 0 12px;font-size:20px;color:#9ef3ff}
.cblk{margin:14px 0;padding:16px 18px;border-radius:14px;background:#02070d;border:1px solid rgba(0,229,255,.2);white-space:pre-wrap;font-family:"JetBrains Mono",Consolas,monospace;font-size:14px;line-height:1.7;color:#dcfbff}
.ibox,.wbox{margin-top:12px;padding:14px 16px;border-radius:12px;border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.04)}
.wbox{border-color:rgba(255,184,0,.35);background:rgba(255,184,0,.08)}
ul{padding-left:22px}
code{padding:2px 5px;border-radius:6px;background:rgba(255,255,255,.08);font-family:"JetBrains Mono",Consolas,monospace}
</style>
</head>
<body>
<main>${clone.innerHTML}</main>
</body>
</html>`;
}

function refreshHeaderActions() {
  const headerLanguageCurrent = document.getElementById('header-language-current');
  if (headerLanguageCurrent) headerLanguageCurrent.textContent = UI_LANGUAGE_META[currentLanguage] || UI_LANGUAGE_META.en;
  const downloadKey = isTopicViewVisible()
    ? 'header.download_topic'
    : (rightOpen || getActiveWorkbenchRouteHash() ? 'header.download_code' : 'header.download');
  const downloadLabel = document.getElementById('header-download-label');
  if (downloadLabel) downloadLabel.textContent = t(downloadKey);
  setTitle('header-download-btn', downloadKey);
  setTitle('header-language-btn', 'profile.language');
  renderQuickLanguageMenu();
}

function downloadCurrentCode() {
  if (isTopicViewVisible()) {
    const topicHtml = buildTopicDownloadHtml();
    if (!topicHtml) return;
    downloadBlobFile(`memflow-topic-${currentTopicId || 'lesson'}-${currentLanguage}.html`, topicHtml, 'text/html;charset=utf-8');
    showToast(t('toast.topic_downloaded'), '#00ffaa', 1800);
    return;
  }
  const code = (editor && typeof editor.getValue === 'function')
    ? editor.getValue()
    : (pendingEditorValue || DEFAULT_EDITOR_CODE || '');
  const route = getActiveWorkbenchRouteHash() || 'code';
  downloadBlobFile(`memflow-${route}.c`, String(code || ''), 'text/x-csrc;charset=utf-8');
  showToast(t('toast.code_downloaded'), '#00ffaa', 1800);
}

function getAppliedProfileLanguage() {
  return normalizeUiLanguage(currentProfile?.preferredLanguage || currentLanguage);
}

function syncProfileLanguageControls(selectedLanguage = getAppliedProfileLanguage()) {
  const normalized = normalizeUiLanguage(selectedLanguage);
  pendingProfileLanguage = normalized;
  const langSel = document.getElementById('profile-language');
  if (langSel) langSel.value = normalized;
  const okBtn = document.getElementById('profile-language-ok');
  if (okBtn) {
    const hasChange = normalized !== getAppliedProfileLanguage();
    okBtn.disabled = !hasChange;
    okBtn.classList.toggle('pending', hasChange);
  }
}

async function syncProfileLanguageToUiSelection(targetLanguage, profileLanguage) {
  const target = normalizeUiLanguage(targetLanguage);
  const applied = normalizeUiLanguage(profileLanguage);
  if (!target || target === applied || profileLanguageSyncInFlight === target) return;
  profileLanguageSyncInFlight = target;
  try {
    const res = await authFetch('/api/profile/language', {
      method: 'POST',
      body: JSON.stringify({ preferredLanguage: target })
    });
    if (res.ok) {
      renderProfile(await res.json());
    }
  } catch (_) {
    profileLanguageSyncInFlight = '';
    return;
  }
  profileLanguageSyncInFlight = '';
}

function renderProfile(profile, { preferProfileLanguage = false } = {}) {
  currentProfile = profile;
  recommendedTopics = profile.recommendedTopics || [];
  const preferredLanguage = normalizeUiLanguage(profile.preferredLanguage || currentLanguage);
  const explicitLanguage = getExplicitRequestedLanguage();
  const effectiveLanguage = preferProfileLanguage ? preferredLanguage : (explicitLanguage || preferredLanguage);
  syncLanguageUrl(effectiveLanguage, { replace: true });
  document.getElementById('acc-name').textContent = profile.name || currentUser.name || 'User';
  document.getElementById('acc-email').textContent = profile.email || currentUser.email || '';
  document.getElementById('profile-theme').value = profile.theme || currentTheme;
  syncProfileLanguageControls(effectiveLanguage);
  document.getElementById('acc-prog-text').textContent = formatProgressText(profile);
  document.getElementById('acc-prog-fill').style.width = `${profile.progressPercent}%`;
  applyTheme(profile.theme || currentTheme);
  buildSugg();
  ensureDiscoveryContent();
  void setUiLanguage(effectiveLanguage, { persist: true })
    .then(() => ensureDiscoveryContent());
  if (explicitLanguage && explicitLanguage !== preferredLanguage) {
    void syncProfileLanguageToUiSelection(explicitLanguage, preferredLanguage);
  }
}

async function loadProfile() {
  try {
    const res = await authFetch('/api/profile');
    if (!res.ok) return;
    const profile = await res.json();
    renderProfile(profile);
  } catch (_) {}
}

async function onProfileThemeChange(theme) {
  applyTheme(theme);
  try {
    const res = await authFetch('/api/profile/theme', {
      method:'POST',
      body: JSON.stringify({ theme })
    });
    if (res.ok) renderProfile(await res.json());
  } catch (_) {}
}

function onProfileLanguageSelectChange(preferredLanguage) {
  syncProfileLanguageControls(preferredLanguage);
}

async function applyProfileLanguageChange() {
  const nextLanguage = normalizeUiLanguage(
    pendingProfileLanguage || document.getElementById('profile-language')?.value || getAppliedProfileLanguage()
  );
  if (nextLanguage === getAppliedProfileLanguage()) {
    syncProfileLanguageControls(nextLanguage);
    return;
  }
  const okBtn = document.getElementById('profile-language-ok');
  if (okBtn) okBtn.disabled = true;
  await onProfileLanguageChange(nextLanguage);
}

async function onProfileLanguageChange(preferredLanguage) {
  const applied = normalizeUiLanguage(preferredLanguage);
  localStorage.setItem(UI_LANGUAGE_STORAGE_KEY, applied);
  try {
    const res = await authFetch('/api/profile/language', {
      method:'POST',
      body: JSON.stringify({ preferredLanguage: applied })
    });
    if (res.ok) {
      renderProfile(await res.json(), { preferProfileLanguage: true });
      return;
    }
  } catch (_) {}
  syncLanguageUrl(applied, { replace: true });
  await setUiLanguage(applied, { persist: true });
  syncProfileLanguageControls(applied);
}

async function markTopicComplete(topicId) {
  if (!topicId) return;
  try {
    const res = await authFetch('/api/profile/topic-complete', {
      method:'POST',
      body: JSON.stringify({ topicId })
    });
    if (res.ok) renderProfile(await res.json());
  } catch (_) {}
}

async function getToken() {
  const cfg = await getAuthConfig();
  if (cfg?.demoMode === true) {
    localStorage.setItem('idToken', 'demo-token');
    localStorage.setItem('memflowai_id_token', 'demo-token');
    localStorage.removeItem('memflowai_refresh_token');
    localStorage.removeItem('memflowai_token_expiry');
    return 'demo-token';
  }

  const idToken = localStorage.getItem('memflowai_id_token') || localStorage.getItem('idToken');
  const expiry = parseInt(localStorage.getItem('memflowai_token_expiry') || '0', 10);
  const refreshToken = localStorage.getItem('memflowai_refresh_token');
  if (!idToken) {
    return null;
  }

  if (Date.now() > expiry - 5 * 60 * 1000 && refreshToken) {
    try {
      const res = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken })
      });
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('memflowai_id_token', data.idToken);
        localStorage.setItem('memflowai_token_expiry', Date.now() + data.expiresIn * 1000);
        return data.idToken;
      }
    } catch (_) {}
  }
  return idToken;
}

async function authFetch(u, o={}) {
  const freshToken = await getToken();
  if (!freshToken) {
    logout();
    throw new Error('AUTH_REQUIRED');
  }
  token = freshToken;
  const res = await fetch(u,{
    ...o,
    headers:{
      ...(o.headers||{}),
      'Authorization': `Bearer ${freshToken}`,
      'Content-Type':'application/json'
    }
  });
  if (res.status === 401) {
    logout();
    throw new Error('AUTH_EXPIRED');
  }
  return res;
}

function logout() {
  localStorage.removeItem('idToken');
  localStorage.removeItem('memflowai_id_token');
  localStorage.removeItem('memflowai_refresh_token');
  localStorage.removeItem('memflowai_token_expiry');
  closeAccountMenu();
  location.href = buildLoginRedirectUrl();
}

function loadStylesheetOnce(href) {
  const existing = [...document.querySelectorAll('link[rel="stylesheet"]')].find(link => link.href === href);
  if (existing) return Promise.resolve(existing);
  return new Promise((resolve, reject) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.addEventListener('load', () => resolve(link), { once: true });
    link.addEventListener('error', () => reject(new Error(`Failed to load stylesheet: ${href}`)), { once: true });
    document.head.appendChild(link);
  });
}

function loadScriptOnce(src, testFn) {
  if (typeof testFn === 'function' && testFn()) return Promise.resolve();
  const existing = [...document.scripts].find(script => script.src === src);
  if (existing) {
    if (existing.dataset.loaded === 'true') return Promise.resolve();
    return new Promise((resolve, reject) => {
      existing.addEventListener('load', () => resolve(), { once: true });
      existing.addEventListener('error', () => reject(new Error(`Failed to load script: ${src}`)), { once: true });
    });
  }
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.dataset.loaded = 'false';
    script.addEventListener('load', () => {
      script.dataset.loaded = 'true';
      resolve();
    }, { once: true });
    script.addEventListener('error', () => reject(new Error(`Failed to load script: ${src}`)), { once: true });
    document.head.appendChild(script);
  });
}

function offsetToLineColumn(text, offset) {
  const safeOffset = Math.max(0, Math.min(String(text || '').length, Number(offset) || 0));
  const before = String(text || '').slice(0, safeOffset).split('\n');
  return {
    lineNumber: before.length,
    column: before[before.length - 1].length + 1
  };
}

function lineColumnToOffset(text, lineNumber, column) {
  const lines = String(text || '').split('\n');
  const safeLine = Math.max(1, Math.min(lines.length, Number(lineNumber) || 1));
  const safeColumn = Math.max(1, Number(column) || 1);
  let offset = 0;
  for (let i = 0; i < safeLine - 1; i++) {
    offset += lines[i].length + 1;
  }
  offset += Math.min(lines[safeLine - 1].length, safeColumn - 1);
  return offset;
}

function createFallbackEditor(host) {
  host.innerHTML = '';
  const area = document.createElement('textarea');
  area.className = 'fallback-editor';
  area.spellcheck = false;
  area.value = pendingEditorValue;
  host.appendChild(area);
  const listeners = new Set();
  const notifySelection = () => {
    listeners.forEach((fn) => {
      try { fn(); } catch (_) {}
    });
  };
  ['select', 'click', 'keyup', 'mouseup', 'input'].forEach((eventName) => {
    area.addEventListener(eventName, notifySelection);
  });
  const api = {
    __fallback: true,
    getValue() {
      return area.value;
    },
    setValue(value) {
      area.value = String(value || '');
    },
    layout() {},
    focus() {
      area.focus();
    },
    deltaDecorations() {
      return [];
    },
    revealLineInCenter() {},
    onDidChangeCursorSelection(fn) {
      listeners.add(fn);
      return { dispose: () => listeners.delete(fn) };
    },
    getSelections() {
      const start = offsetToLineColumn(area.value, area.selectionStart);
      const end = offsetToLineColumn(area.value, area.selectionEnd);
      return [{
        startLineNumber: start.lineNumber,
        startColumn: start.column,
        endLineNumber: end.lineNumber,
        endColumn: end.column
      }];
    },
    getModel() {
      return {
        getValueInRange(range) {
          const startOffset = lineColumnToOffset(area.value, range?.startLineNumber, range?.startColumn);
          const endOffset = lineColumnToOffset(area.value, range?.endLineNumber, range?.endColumn);
          return area.value.slice(Math.min(startOffset, endOffset), Math.max(startOffset, endOffset));
        }
      };
    }
  };
  area.focus();
  return api;
}

async function ensureMonacoEditor() {
  if (editor) return editor;
  if (monacoEditorPromise) return monacoEditorPromise;

  monacoEditorPromise = (async () => {
    const host = document.getElementById('editor');
    if (!host) throw new Error('Editor mount not found.');
    try {
      await loadStylesheetOnce(MONACO_CSS_URL);
      monacoLoaderPromise = monacoLoaderPromise || loadScriptOnce(
        MONACO_LOADER_URL,
        () => typeof window.require === 'function' && typeof window.require.config === 'function'
      );
      await monacoLoaderPromise;
      window.require.config({ paths: { vs: MONACO_VS_PATH } });
      await new Promise((resolve, reject) => {
        try {
          window.require(['vs/editor/editor.main'], resolve, reject);
        } catch (err) {
          reject(err);
        }
      });

      editor = monaco.editor.create(host, {
        value: pendingEditorValue,
        language: 'c',
        theme: 'vs-dark',
        automaticLayout: true,
        glyphMargin: true,
        minimap: { enabled: false },
        fontSize: 13,
        lineHeight: 22,
        scrollBeyondLastLine: false,
        fontFamily: "'JetBrains Mono', monospace",
        padding: { top: 10 }
      });
      window.monacoEditorInstance = editor;
    } catch (err) {
      console.error('Monaco load failed, falling back to textarea editor:', err);
      editor = createFallbackEditor(host);
      showToast('Editor CDN failed to load. Using basic editor.', '#ffb800', 2600);
    }
    editor.onDidChangeCursorSelection(() => updateLineSelectionDecorations());
    updateWorkbenchHint();
    return editor;
  })().catch((err) => {
    monacoEditorPromise = null;
    throw err;
  });

  return monacoEditorPromise;
}

function prepareEditor(code, layoutDelay = 0) {
  if (typeof code === 'string' && code.length > 0) {
    pendingEditorValue = code;
  }

  return ensureMonacoEditor()
    .then((instance) => {
      if (typeof code === 'string' && code.length > 0 && instance.getValue() !== code) {
        instance.setValue(code);
      }
      if (typeof window.__applyTerminalSplitLayout === 'function') {
        requestAnimationFrame(() => window.__applyTerminalSplitLayout(false));
      }
      if (layoutDelay >= 0) {
        setTimeout(() => {
          if (typeof window.__applyTerminalSplitLayout === 'function') {
            window.__applyTerminalSplitLayout(false);
          }
          instance.layout();
        }, layoutDelay);
      }
      return instance;
    })
    .catch((err) => {
      console.error('Monaco load failed:', err);
      showToast(t('toast.editor_failed'), '#ff5f57', 2200);
      throw err;
    });
}

async function ensureLeaderLine() {
  if (typeof LeaderLine !== 'undefined') return LeaderLine;
  leaderLinePromise = leaderLinePromise || loadScriptOnce(
    LEADER_LINE_URL,
    () => typeof LeaderLine !== 'undefined'
  );
  await leaderLinePromise;
  return LeaderLine;
}

function attachSocketHandlers(sock) {
  sock.on('connect_error', e => {
    const msg = e?.message || 'socket connect failed';
    lastSocketErrorMessage = msg;
    socketErrorCount += 1;
    setProgStatus(t('compiler.reconnecting'), 'var(--amber)');
    if (!runActive) setTerminalSummary(t('compiler.idle'));
    if (socketErrorCount >= 5) {
      showToast(`Socket reconnecting: ${msg}`, '#ffb800', 1800);
      socketErrorCount = 0;
    }
    if (String(msg).startsWith('AUTH_')) logout();
  });
  sock.on('connect', () => {
    socketErrorCount = 0;
    lastSocketErrorMessage = '';
    if (disconnectWarnTimer) {
      clearTimeout(disconnectWarnTimer);
      disconnectWarnTimer = null;
    }
    setProgStatus(runActive ? t('compiler.running') : t('compiler.connected'), runActive ? 'var(--amber)' : 'var(--green)');
    setTimeout(() => {
      if (!runActive) setProgStatus('', '');
    }, 900);
  });
  sock.on('disconnect', (reason) => {
    if (reason) lastSocketErrorMessage = reason;
    if (disconnectWarnTimer) clearTimeout(disconnectWarnTimer);
    disconnectWarnTimer = setTimeout(() => {
      setProgStatus(t('compiler.reconnecting'), 'var(--amber)');
      if (!runActive) setTerminalSummary(t('compiler.idle'));
      if (reason && reason !== 'transport close' && reason !== 'transport error') {
        showToast(`Socket reconnecting (${reason})`, '#ffb800', 1600);
      }
    }, 1500);
  });
  sock.on('authInfo', ({userId, email, name}) => {
    currentUser = { userId, email, name: name || (email ? email.split('@')[0] : 'User') };
    const accBtn = document.getElementById('account-btn');
    if (accBtn) accBtn.textContent = (currentUser.name || 'U').slice(0,1).toUpperCase();
    loadProfile();
    loadChatSessions();
  });
  sock.on('needInput', ({hint}) => showScanfDock(hint || t('compiler.scanf_placeholder')));
  sock.on('done', () => {
    markRunDispatchAccepted('done');
    forceResetRun();
    setTerminalSummary(t('compiler.idle'));
    loadProfile();
  });
  sock.on('output', (payload) => {
    markRunDispatchAccepted('output');
    handleOut(payload);
  });
}

async function ensureSocketConnection() {
  if (socket) {
    if (!socket.connected) {
      try { socket.connect(); } catch (_) {}
    }
    return socket;
  }
  if (socketInitPromise) return socketInitPromise;
  socketInitPromise = (async () => {
    token = token || await getToken();
    if (!token) {
      location.href = buildLoginRedirectUrl();
      return null;
    }
    const sock = io({
      auth:{ token },
      path: '/socket.io',
      transports: ['polling', 'websocket'],
      rememberUpgrade: false,
      upgrade: true,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 800,
      reconnectionDelayMax: 4000,
      timeout: 12000
    });
    attachSocketHandlers(sock);
    socket = sock;
    return sock;
  })().catch((err) => {
    lastSocketErrorMessage = err?.message || 'socket init failed';
    socketInitPromise = null;
    throw err;
  });
  return socketInitPromise;
}
/* ─────────────────────────────────────────────
   INIT
───────────────────────────────────────────── */
(async()=>{
  initTheme();
  const bootLanguage = getRequestedLanguageFromPage();
  const tokenPromise = getToken();
  syncLanguageUrl(bootLanguage, { replace: true });
  buildSidebar(); buildSugg(); buildHomeParticles();
  ensureDiscoveryContent();

  // Default load state: both side panels closed.
  rightOpen = false;
  leftOpen  = false;
  document.getElementById('lp').classList.add('shut');
  document.getElementById('rp').classList.remove('open');
  syncBodyClasses();
  const initialRunBtn = document.getElementById('runbtn');
  if (initialRunBtn) {
    initialRunBtn.onclick = () => { void runCode(); };
  }
  restoreRouteFromLocation();
  loadChatSessionsFromLocal();
  renderChatSessions(); renderChatWindow();
  renderStepAiHistory();
  updateWorkbenchHint();
  ensureTerminalLayout();
  setTerminalSummary(t('compiler.idle'));
  await setUiLanguage(bootLanguage, { persist: false });
  ensureDiscoveryContent();
  restoreRouteFromLocation();
  window.addEventListener('hashchange', restoreRouteFromLocation);
  window.addEventListener('popstate', restoreRouteFromLocation);
  window.addEventListener('load', () => {
    ensureDiscoveryContent();
    restoreRouteFromLocation();
  });

  token = await tokenPromise;
  if (!token) { location.href = buildLoginRedirectUrl(); return; }
  void ensureSocketConnection();

  document.addEventListener('click', (e) => {
    const wrap = document.getElementById('account-wrap');
    if (wrap && !wrap.contains(e.target)) closeAccountMenu();
    const langWrap = document.getElementById('lang-wrap');
    if (langWrap && !langWrap.contains(e.target)) closeQuickLanguageMenu();
  });
  document.addEventListener('keydown', (e) => {
    const activeTag = (document.activeElement && document.activeElement.tagName) ? document.activeElement.tagName.toLowerCase() : '';
    const inTextInput = activeTag === 'input' || activeTag === 'textarea';
    if (e.key === 'Escape' && memoryViewOpen) {
      e.preventDefault();
      toggleMemoryView(false);
      return;
    }
    if (e.ctrlKey && e.key === 'Enter') {
      e.preventDefault();
      runCode();
      return;
    }
    if (!inTextInput && e.altKey && e.key === 'ArrowRight') {
      e.preventDefault();
      changeStep(1);
      return;
    }
    if (!inTextInput && e.altKey && e.key === 'ArrowLeft') {
      e.preventDefault();
      changeStep(-1);
      return;
    }
    if (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
      e.preventDefault();
      askAI();
    }
  });
})();

/* ─────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────── */
function esc(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

function setProgStatus(txt, col) {
  const el = document.getElementById('prog-status');
  if (el) { el.textContent = txt; el.style.color = col || 'var(--t3)'; }
}

function nextAnimationFrame() {
  return new Promise((resolve) => {
    requestAnimationFrame(() => resolve());
  });
}

function waitForSocketReady(timeoutMs = 4000) {
  if (socket?.connected) return Promise.resolve(true);
  return new Promise((resolve) => {
    let done = false;
    const finish = (ok) => {
      if (done) return;
      done = true;
      clearTimeout(timer);
      if (socket) socket.off('connect', onConnect);
      resolve(ok);
    };
    const onConnect = () => finish(true);
    const timer = setTimeout(() => finish(!!socket?.connected), timeoutMs);
    if (socket) socket.on('connect', onConnect);
    try { socket?.connect(); } catch (_) {}
  });
}

function clearRunDispatchWatchdog() {
  clearTimeout(_runDispatchWarnTimeout);
  _runDispatchWarnTimeout = null;
}

function resetRunDispatchState() {
  runDispatchAcknowledged = false;
  clearRunDispatchWatchdog();
}

function markRunDispatchAccepted(source = 'signal') {
  if (!runActive || runDispatchAcknowledged) return;
  runDispatchAcknowledged = true;
  clearRunDispatchWatchdog();
  setProgStatus(t('compiler.running'), 'var(--amber)');
  setTerminalSummary(t('compiler.running'));
  if (source === 'ack') {
    appendTerminalLine('✅ Backend accepted run request.', null);
  }
}

function scheduleRunDispatchWatchdog() {
  clearRunDispatchWatchdog();
  _runDispatchWarnTimeout = setTimeout(() => {
    if (!runActive || runDispatchAcknowledged) return;
    appendTerminalLine('⚠️ Backend has not confirmed the run request yet. Waiting for compiler output…', null);
    setProgStatus(t('compiler.running'), 'var(--amber)');
    setTerminalSummary(t('compiler.running'));
  }, 5000);
}

/* ─────────────────────────────────────────────
   LEADERLINE POINTER ARROWS
   Draws amber arc arrows from pointer cards to
   the variable they point to.
───────────────────────────────────────────── */
let _lines = [];

function clearArrows() {
  _lines.forEach(l => { try { l.remove(); } catch(_){} });
  _lines = [];
}

async function drawArrows(cardMeta) {
  clearArrows();
  if (!cardMeta.some(c => c.isPtr && c.ptrTarget)) return;
  if (typeof LeaderLine === 'undefined') {
    try {
      await ensureLeaderLine();
    } catch (err) {
      console.warn('LeaderLine load failed:', err);
      return;
    }
  }
  cardMeta.forEach(c => {
    if (!c.isPtr || !c.ptrTarget) return;
    const src = document.getElementById(c.id);
    const dst = document.getElementById(c.ptrTarget);
    if (!src || !dst || src === dst) return;
    /* Elements must be visible for LeaderLine */
    if (!src.offsetParent || !dst.offsetParent) return;
    try {
      const line = new LeaderLine(src, dst, {
        color: 'rgba(255,184,0,.88)',
        size: 2,
        path: 'fluid',
        startSocket: 'bottom',
        endSocket: 'bottom',
        startPlug: 'disc',
        endPlug: 'arrow3',
        endPlugSize: 1.3,
        outline: true,
        outlineColor: 'rgba(0,0,0,.5)',
        outlineSize: .28,
      });
      _lines.push(line);
    } catch(e) { console.warn('Arrow:', e); }
  });
}

/* ─────────────────────────────────────────────
   COMPILER
   Server emits lines over socket 'output' event:
     __STEP__{"line":3,"name":"i","val":10,"addr":"0x7ffe...","type":"int"}
     __STEP__{"line":4,"name":"p","val":"0x7ffe...","type":"ptr","pointsTo":"i"}
     __SCANF__Enter a number:
     __DONE__
   Plain lines go to terminal.
───────────────────────────────────────────── */
function handleOut(data) {
  try {
    obuf += String(data ?? '');
  } catch (_) {
    obuf += '';
  }

  // Some chunks arrive with marker tokens glued directly to user stdout/stderr.
  // Split both before and after markers so the line parser does not lose output.
  obuf = obuf
    .replace(/([^\n])(__STEP__\{)/g, '$1\n$2')
    .replace(/(__STEP__\{[^\n]*\})(?=[^\n])/g, '$1\n')
    .replace(/([^\n])(__SCANF__)/g, '$1\n$2')
    .replace(/(__SCANF__[^\n]*)(?=[^\n])/g, '$1\n')
    .replace(/([^\n])(__DONE__)/g, '$1\n$2')
    .replace(/(__DONE__)(?=[^\n])/g, '$1\n');

  const parts = obuf.split('\n');
  obuf = parts.pop();   /* keep incomplete last line */

  parts.forEach(line => {
    if (line.includes('__STEP__')) {
      try {
        const [before, payload] = line.split('__STEP__');
        if (before && before.trim()) {
          appendTerminalLine(before);
        }
        const s = JSON.parse((payload || '').trim());
        history_.push(s);
        outputLineContext = Number.isInteger(s.line) ? s.line : outputLineContext;
        /* Keep the view on the first step for a new run (1/N). */
        if (step < 0) step = 0;
        enableBtns(true);
      } catch(e){
        console.warn('Bad __STEP__:', line, e);
        const [before] = line.split('__STEP__');
        if (before && before.trim()) {
          appendTerminalLine(before);
        }
      }

    } else if (line.includes('__SCANF__')) {
      const [before, markerHint] = line.split('__SCANF__');
      if (before && before.trim()) {
        appendTerminalLine(before);
      }
      showScanfDock((markerHint || '').trim() || 'Enter value:');

    } else if (line.includes('__DONE__')) {
      const [before] = line.split('__DONE__');
      if (before && before.trim()) {
        appendTerminalLine(before);
      }
      finalizeSuccessfulRun(runLastExitCode || '0');

    } else if (line.includes('✅ Execution complete')) {
      const m = line.match(/exit\s+(-?\d+)/i);
      const exitCode = m ? m[1] : '0';
      runLastExitCode = exitCode;
      finalizeSuccessfulRun(exitCode);

    } else if (line.trim()) {
      appendTerminalLine(line);
    }
  });

  // Safety: if we keep receiving non-newline output, flush it periodically.
  if (obuf.length > 1800 && !obuf.includes('__STEP__') && !obuf.includes('__DONE__') && !obuf.includes('__SCANF__')) {
    appendTerminalLine(obuf);
    obuf = '';
  }

  /* Render once after processing all lines in this chunk */
  try {
    updStep();
    if (step >= 0) renderStep();
  } catch (e) {
    appendTerminalLine(`⚠️ Render error: ${e.message || 'unknown error'}`);
  }
}

/* ─────────────────────────────────────────────
   RUN / STOP
───────────────────────────────────────────── */
async function runCode() {
  try {
    if (!rightOpen) {
      toggleRight();
      await nextAnimationFrame();
    }
    const term = ensureTerminalLayout();
    ensureTerminalVisible();
    if (runActive) {
      const message = 'Run already in progress. Click STOP first.';
      appendTerminalLine(`⚠️ ${message}`, null);
      showToast(message, '#ffb800', 1800);
      return;
    }
    history_ = []; step = -1; obuf = '';
    runVisibleTerminalOutput = false;
    runCompletionHandled = false;
    runLastExitCode = null;
    outputLineContext = null;
    clearArrows();
    if (term.final) term.final.innerHTML = '';
    appendTerminalLine('▶ Starting run...', null);
    setLiveEvent(`<div class="compile-loader"><span>${esc(t('compiler.compile'))}</span><span class="dot"></span><span class="dot"></span><span class="dot"></span></div>`);
    setTerminalSummary(t('compiler.compiling'));
    setProgStatus(t('compiler.compiling'), 'var(--amber)');
    const pendingBtn = document.getElementById('runbtn');
    if (pendingBtn) {
      pendingBtn.classList.add('spinning');
      pendingBtn.textContent = t('compiler.stop');
      pendingBtn.onclick = () => {
        try { socket?.emit('stopCode'); } catch (_) {}
        forceResetRun();
      };
    }
    runActive = true;
    resetRunDispatchState();
    updateWorkbenchHint();
    if (!socket) {
      try {
        await ensureSocketConnection();
      } catch (_) {}
    }
    if (!socket) {
      clearLiveEvents();
      setTerminalSummary(t('compiler.reconnecting'), 'err');
      setProgStatus(t('compiler.reconnecting'), 'var(--amber)');
      const detail = lastSocketErrorMessage ? ` ${lastSocketErrorMessage}` : '';
      appendTerminalLine(`❌ Connection is still starting. Retry in a moment.${detail}`, null);
      showToast(`Connection is still starting. Retry in a moment.${detail}`, '#ffb800', 2600);
      runActive = false;
      resetRun();
      updateWorkbenchHint();
      return;
    }
    if (!editor) {
      try {
        await ensureMonacoEditor();
      } catch (_) {
        clearLiveEvents();
        setTerminalSummary(t('compiler.idle'), 'err');
        setProgStatus(t('compiler.run_failed'), 'var(--red)');
        appendTerminalLine(`❌ ${t('toast.editor_failed')}`, null);
        runActive = false;
        resetRun();
        updateWorkbenchHint();
        return;
      }
    }
    const socketReady = await waitForSocketReady(12000);
    if (!socketReady) {
      clearLiveEvents();
      setTerminalSummary(t('compiler.reconnecting'), 'err');
      setProgStatus(t('compiler.reconnecting'), 'var(--amber)');
      const detail = lastSocketErrorMessage ? ` ${lastSocketErrorMessage}` : '';
      appendTerminalLine(`❌ ${t('toast.socket_not_ready')}${detail}`, null);
      showToast(`${t('toast.socket_not_ready')}${detail}`, '#ff5f57', 2800);
      runActive = false;
      resetRun();
      updateWorkbenchHint();
      return;
    }
    setTerminalSummary(t('compiler.running'));
    document.getElementById('sklist').innerHTML = '';
    const story = document.getElementById('viz-story');
    if (story) story.innerHTML = `<div class="viz-empty">${esc(t('compiler.timeline_loading'))}</div>`;
    const memoryMap = document.getElementById('memory-map');
    if (memoryMap) memoryMap.innerHTML = `<div class="viz-empty">${esc(t('compiler.memory_waiting'))}</div>`;
    renderMemoryInsight(null, null);
    document.getElementById('debug-ai-text').textContent = t('debug.default_text');
    const banner = document.getElementById('step-banner');
    if (banner) banner.classList.remove('on');
    enableBtns(false);
    hideScanfDock();
    setProgStatus(t('compiler.compiling'), 'var(--amber)');
    if (editor && typeof editor.deltaDecorations === 'function') {
      decorations = editor.deltaDecorations(decorations, []);
    }
    updStep();

    appendTerminalLine('▶ Sending run request to backend...', null);
    scheduleRunDispatchWatchdog();
    try {
      socket.emit('runCode', { code: editor.getValue() }, (response = {}) => {
        if (response?.ok === false) {
          resetRunDispatchState();
          forceResetRun();
          setTerminalSummary(t('compiler.idle'), 'err');
          setProgStatus(t('compiler.run_failed'), 'var(--red)');
          appendTerminalLine(`❌ ${response.error || 'Run request failed.'}`, null);
          showToast(response.error || 'Run request failed.', '#ff5f57', 2400);
          return;
        }
        markRunDispatchAccepted('ack');
      });
    } catch (err) {
      resetRunDispatchState();
      forceResetRun();
      setTerminalSummary(t('compiler.idle'), 'err');
      setProgStatus(t('compiler.run_failed'), 'var(--red)');
      appendTerminalLine(`❌ ${err.message || 'Run request failed.'}`, null);
      showToast(err.message || 'Run request failed.', '#ff5f57', 2400);
      return;
    }

    clearTimeout(_runTimeout);
    _runTimeout = setTimeout(() => {
      if (runActive && !runDispatchAcknowledged && !runVisibleTerminalOutput && !history_.length) {
        appendTerminalLine('❌ Compiler backend did not respond to this run request.', null);
        showToast('Compiler backend did not respond to this run request.', '#ff5f57', 2600);
      }
      forceResetRun();
    }, 30000);
  } catch (err) {
    console.error('runCode() failed before dispatch:', err);
    const msg = err?.message || 'Unexpected run error.';
    resetRunDispatchState();
    clearLiveEvents();
    setTerminalSummary(t('compiler.idle'), 'err');
    setProgStatus(t('compiler.run_failed'), 'var(--red)');
    appendTerminalLine(`❌ ${msg}`, null);
    showToast(msg, '#ff5f57', 2600);
    runActive = false;
    resetRun();
    updateWorkbenchHint();
  }
}

let _runTimeout = null;

function forceResetRun() {
  clearTimeout(_runTimeout);
  _runTimeout = null;
  resetRunDispatchState();
  runCompletionHandled = true;
  if (obuf && obuf.trim() && !obuf.includes('__STEP__') && !obuf.includes('__DONE__') && !obuf.includes('__SCANF__')) {
    appendTerminalLine(obuf);
  }
  obuf = '';
  settleCompileLoader();
  clearLiveEvents();
  setTerminalSummary(t('compiler.idle'));
  hideScanfDock();
  setProgStatus(history_.length ? t('compiler.done') : '', history_.length ? 'var(--green)' : '');
  runActive = false;
  updateWorkbenchHint();
  resetRun();
}

function resetRun() {
  const rb = document.getElementById('runbtn');
  if (!rb) return;
  rb.classList.remove('spinning');
  rb.textContent = t('compiler.run');
  rb.onclick = () => { void runCode(); };
}

function enableBtns(on) {
  ['nextbtn','prevbtn','vprev','vnext','mem-prev','mem-next'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.disabled = !on;
  });
}

function toggleLineSelectMode() {
  lineSelectMode = !lineSelectMode;
  const btn = document.getElementById('selbtn');
  const at = document.getElementById('debug-ai-text');
  if (btn) {
    btn.classList.toggle('on', lineSelectMode);
    btn.textContent = lineSelectMode ? t('compiler.selecting_lines') : t('compiler.select_lines');
  }
  if (at) {
    at.textContent = lineSelectMode
      ? t('debug.select_lines_prompt')
      : at.textContent;
  }
  updateLineSelectionDecorations();
  updateWorkbenchHint();
}

function updateLineSelectionDecorations() {
  if (!editor || typeof monaco === 'undefined') return;
  if (!lineSelectMode) {
    selectionDecorations = editor.deltaDecorations(selectionDecorations, []);
    return;
  }
  const decs = [];
  const sels = editor.getSelections() || [];
  sels.forEach(sel => {
    if (!sel) return;
    const start = Math.min(sel.startLineNumber, sel.endLineNumber);
    const end = Math.max(sel.startLineNumber, sel.endLineNumber);
    for (let ln = start; ln <= end; ln++) {
      decs.push({
        range: new monaco.Range(ln, 1, ln, 1),
        options: {
          isWholeLine: true,
          className: 'line-select-highlight',
          linesDecorationsClassName: 'line-select-glyph'
        }
      });
    }
  });
  selectionDecorations = editor.deltaDecorations(selectionDecorations, decs);
  updateWorkbenchHint();
}

function setTerminalWide(on) {
  const btn = document.getElementById('term-wide-arrow');
  const next = !!on;
  if (next === terminalWide) {
    if (btn) {
      btn.textContent = terminalWide ? t('compiler.restore') : t('compiler.maximize');
      btn.title = terminalWide ? t('compiler.restore') : t('compiler.maximize');
    }
    return;
  }
  if (next) {
    if (terminalSplitRatio > 0 && terminalSplitRatio < 1) {
      terminalSplitBeforeMax = terminalSplitRatio;
    }
    if (typeof window.__setTerminalSplitRatio === 'function') {
      window.__setTerminalSplitRatio(1, { persist: true, remember: false });
    }
  } else {
    const restoredRatio =
      terminalSplitBeforeMax > 0 && terminalSplitBeforeMax < 1
        ? terminalSplitBeforeMax
        : 0.34;
    if (typeof window.__setTerminalSplitRatio === 'function') {
      window.__setTerminalSplitRatio(restoredRatio, { persist: true, remember: false });
    }
  }
  if (btn && typeof window.__applyTerminalSplitLayout !== 'function') {
    btn.textContent = terminalWide ? t('compiler.restore') : t('compiler.maximize');
    btn.title = terminalWide ? t('compiler.restore') : t('compiler.maximize');
  }
}

function ensureTerminalVisible(minRatio = 0.28) {
  const nextRatio = terminalWide ? 1 : Math.max(Number(terminalSplitRatio) || 0, minRatio);
  if (typeof window.__setTerminalSplitRatio === 'function') {
    window.__setTerminalSplitRatio(nextRatio, { persist: true, remember: nextRatio > 0 && nextRatio < 1 });
    return;
  }
  const wrap = document.getElementById('termwrap');
  if (wrap && (!wrap.style.height || wrap.style.height === '0px')) {
    wrap.style.height = '34%';
  }
}

function toggleTerminalWide() {
  setTerminalWide(!terminalWide);
}

function getSelectedLineCount() {
  if (!editor) return 0;
  const sels = editor.getSelections() || [];
  let count = 0;
  sels.forEach(sel => {
    if (!sel) return;
    const start = Math.min(sel.startLineNumber, sel.endLineNumber);
    const end = Math.max(sel.startLineNumber, sel.endLineNumber);
    count += Math.max(0, end - start + 1);
  });
  return count;
}

function updateWorkbenchHint() {
  const runState = document.getElementById('hint-run-state');
  const runDot = document.getElementById('hint-run-dot');
  const sel = document.getElementById('hint-selection');
  if (runState) runState.textContent = runActive ? t('hint.running') : t('hint.idle');
  if (runDot) {
    runDot.classList.toggle('run', runActive);
    runDot.classList.toggle('idle', !runActive);
  }
  if (sel) {
    const lines = getSelectedLineCount();
    sel.textContent = lines > 0 ? t('hint.lines_selected', { count: lines }) : t('hint.no_selection');
  }
}

function toggleMemoryView(force) {
  memoryViewOpen = typeof force === 'boolean' ? force : !memoryViewOpen;
  const panel = document.getElementById('memory-overlay');
  const btn = document.getElementById('membtn');
  if (panel) panel.classList.toggle('on', memoryViewOpen);
  if (btn) btn.classList.toggle('on', memoryViewOpen);
  if (btn) btn.textContent = memoryViewOpen ? t('compiler.hide_memory_view') : t('compiler.memory_view');
  if (memoryViewOpen) {
    renderMemoryInsight(step >= 0 ? history_[step] : null, buildSnapshotForStep(step));
  }
}

function renderMemoryInsight(stepData, snap) {
  const body = document.getElementById('mem-overlay-detail');
  const grid = document.getElementById('mem-overlay-grid');
  const sub = document.getElementById('mem-overlay-sub');
  const stepLabel = document.getElementById('mem-overlay-step');
  const stackBody = document.getElementById('mem-stack-body');
  const heapBody = document.getElementById('mem-heap-body');
  if (!body || !grid || !sub || !stepLabel || !stackBody || !heapBody) return;
  if (!stepData || !snap) {
    stepLabel.textContent = '0/0';
    sub.textContent = t('memory.run_to_populate');
    grid.innerHTML = `<div class="viz-empty">${esc(t('memory.run_to_generate_grid'))}</div>`;
    stackBody.innerHTML = `<tr><td colspan="3" class="mem-struct-empty">${esc(t('memory.no_data'))}</td></tr>`;
    heapBody.innerHTML = `<tr><td colspan="3" class="mem-struct-empty">${esc(t('memory.no_heap'))}</td></tr>`;
    body.textContent = t('memory.click_cell');
    memoryOverlaySelection = null;
    return;
  }
  const names = Object.keys(snap).filter(n => n !== '__exec__');
  stepLabel.textContent = `${step + 1}/${history_.length}`;
  sub.textContent = t('memory.overlay_status', {
    step: step + 1,
    total: history_.length,
    line: stepData.line,
    slots: names.length
  });
  grid.innerHTML = '';
  names.forEach((name) => {
    const d = snap[name];
    const cells = buildMemoryCellsFromValue(d);
    const varCard = document.createElement('div');
    varCard.className = 'mem-var' + ((memoryOverlaySelection && memoryOverlaySelection.name === name) ? ' on' : '');
    const head = document.createElement('div');
    head.className = 'mem-var-head';
    head.innerHTML = `<div class="mem-var-name">${esc(name)}</div><div class="mem-var-meta">${esc((d.type || 'value').toUpperCase())}</div>`;
    const row = document.createElement('div');
    row.className = 'mem-cells';
    cells.forEach((cell, idx) => {
      const b = document.createElement('button');
      b.className = 'mem-cell';
      if (memoryOverlaySelection && memoryOverlaySelection.name === name && memoryOverlaySelection.idx === idx) b.classList.add('on');
      b.type = 'button';
      b.innerHTML = `<div class="mem-idx">${esc(cell.idx)}</div><div class="mem-val">${esc(cell.val)}</div>`;
      b.onclick = () => focusMemoryCell(name, idx, d, cell);
      row.appendChild(b);
    });
    varCard.appendChild(head);
    varCard.appendChild(row);
    grid.appendChild(varCard);
  });
  renderMemoryStructureTables(snap);

  if (!memoryOverlaySelection) {
    const name = stepData.name || 'value';
    body.textContent = t('memory.active_line_detail', {
      line: stepData.line,
      name,
      value: String(stepData.val ?? '')
    });
  }
}

function renderMemoryStructureTables(snap) {
  const stackBody = document.getElementById('mem-stack-body');
  const heapBody = document.getElementById('mem-heap-body');
  if (!stackBody || !heapBody) return;
  const names = Object.keys(snap).filter(n => n !== '__exec__');
  const stackRows = [];
  const heapRows = [];
  names.forEach((name) => {
    const d = snap[name] || {};
    const type = String(d.type || 'value');
    const val = String(d.val ?? '');
    const isPtr = type === 'ptr' || /^0x[0-9a-fA-F]{4,}$/i.test(val);
    stackRows.push(`<tr><td>${esc(name)}</td><td>${esc(type)}</td><td>${esc(val)}</td></tr>`);
    if (isPtr) {
      const targetKnown = d.pointsTo && snap[d.pointsTo];
      const note = targetKnown
        ? t('memory.heap_points_to_stack', { target: d.pointsTo })
        : (d.pointsTo ? t('memory.heap_points_to', { target: d.pointsTo }) : t('memory.heap_external'));
      heapRows.push(`<tr><td>${esc(name)}</td><td>${esc(val)}</td><td>${esc(note)}</td></tr>`);
    }
  });
  stackBody.innerHTML = stackRows.length
    ? stackRows.join('')
    : `<tr><td colspan="3" class="mem-struct-empty">${esc(t('memory.no_stack'))}</td></tr>`;
  heapBody.innerHTML = heapRows.length
    ? heapRows.join('')
    : `<tr><td colspan="3" class="mem-struct-empty">${esc(t('memory.no_heap'))}</td></tr>`;
}

function buildSnapshotForStep(stepIndex) {
  if (!history_.length || stepIndex < 0 || stepIndex >= history_.length) return null;
  const snap = {};
  for (let i = 0; i <= stepIndex; i++) {
    const h = history_[i];
    snap[h.name] = { ...h };
  }
  return snap;
}

function buildMemoryCellsFromValue(d) {
  const raw = String(d?.val ?? '');
  const type = String(d?.type || '').toLowerCase();
  if (!raw || raw === 'undefined' || raw === 'null' || raw === 'uninitialized') {
    return [{ idx: '0', val: 'uninit' }];
  }
  if (type.includes('char[]') || type.includes('string') || (/^[^\d][\s\S]{1,80}$/.test(raw) && !/^0x[0-9a-f]+$/i.test(raw))) {
    const chars = [...raw];
    return (chars.length ? chars : ['\\0']).slice(0, 64).map((ch, i) => ({ idx: String(i), val: ch === ' ' ? '␠' : ch }));
  }
  if ((raw.startsWith('[') && raw.endsWith(']')) || (raw.startsWith('{') && raw.endsWith('}'))) {
    const list = raw.replace(/^[\[{]\s*|\s*[\]}]$/g, '').split(',').map(x => x.trim()).filter(Boolean);
    if (list.length) return list.slice(0, 64).map((v, i) => ({ idx: String(i), val: v }));
  }
  if (raw.includes(',') && !/^0x[0-9a-f]+$/i.test(raw)) {
    const list = raw.split(',').map(x => x.trim()).filter(Boolean);
    if (list.length > 1) return list.slice(0, 64).map((v, i) => ({ idx: String(i), val: v }));
  }
  return [{ idx: '0', val: raw }];
}

function focusMemoryCell(name, idx, d, cell) {
  memoryOverlaySelection = { name, idx };
  const body = document.getElementById('mem-overlay-detail');
  if (body) {
    const val = String(d?.val ?? '');
    const isPointer = d?.type === 'ptr' || /^0x[0-9a-fA-F]{4,}$/i.test(val);
    const note = isPointer
      ? t('memory.pointer_note', { target: d.pointsTo || t('memory.heap_external') })
      : t('memory.state_note');
    body.textContent = t('memory.selected_detail', {
      name,
      index: cell.idx,
      value: cell.val,
      type: d?.type || 'value',
      address: d?.addr ? t('memory.selection_address', { addr: d.addr }) : '',
      note,
      synced: t('memory.selection_synced')
    });
  }
  const idxInHistory = findLatestStepForVar(name);
  if (idxInHistory >= 0) {
    step = idxInHistory;
    renderStep();
    updStep();
  } else {
    renderMemoryInsight(step >= 0 ? history_[step] : null, buildSnapshotForStep(step));
  }
}

function findLatestStepForVar(name) {
  for (let i = history_.length - 1; i >= 0; i--) {
    const h = history_[i];
    if (h && h.name === name) return i;
  }
  return -1;
}

function isTerminalNoiseLine(raw) {
  return (
    raw.startsWith('▶ Starting run...') ||
    raw.startsWith('▶ Sending run request to backend...') ||
    raw.startsWith('✅ Backend accepted run request.') ||
    raw.startsWith('✅ Execution complete') ||
    raw.startsWith('⚙️ Backend:') ||
    raw.startsWith('⚙️ Using local gcc execution') ||
    raw.startsWith('⚠️ Docker is unavailable, falling back to local gcc execution.')
  );
}

function appendTerminalLine(text, lineContext = outputLineContext) {
  const { final } = ensureTerminalLayout();
  const raw = String(text || '').trim();
  if (!final || !raw) return;
  if (isTerminalNoiseLine(raw)) return;
  ensureTerminalVisible();
  runVisibleTerminalOutput = true;
  const badge = Number.isInteger(lineContext) ? `<span style="color:#6f8f9f">[L${lineContext}]</span> ` : '';
  final.innerHTML += badge + esc(raw) + '<br>';
  final.scrollTop = final.scrollHeight;
}

function appendTerminalInputEcho(text) {
  const { final } = ensureTerminalLayout();
  const raw = String(text || '').trim();
  if (!final || !raw) return;
  ensureTerminalVisible();
  runVisibleTerminalOutput = true;
  final.innerHTML += `<span style="color:var(--amber)">&gt; ${esc(raw)}</span><br>`;
  final.scrollTop = final.scrollHeight;
}

function appendImplicitRunSuccess(exitCode = '0') {
  if (runVisibleTerminalOutput) return;
  const traceNote = history_.length
    ? t('compiler.trace_note', { count: history_.length, plural: history_.length === 1 ? '' : 's' })
    : '';
  appendTerminalLine(t('compiler.no_stdout', { exitCode, traceNote }), null);
}

function finalizeSuccessfulRun(exitCode = '0') {
  if (runCompletionHandled) return;
  appendImplicitRunSuccess(exitCode);
  forceResetRun();
  setTerminalSummary(t('compiler.idle'));
  setProgStatus(t('compiler.done'), 'var(--green)');
  hideScanfDock();
  loadProfile();
}

function settleCompileLoader() {
  const loader = document.querySelector('#terminal-live .compile-loader');
  if (!loader) return;
  loader.classList.add('done');
}

function ensureTerminalLayout() {
  const terminalEl = document.getElementById('terminal');
  if (!terminalEl) return {};
  let summary = document.getElementById('terminal-summary');
  let live = document.getElementById('terminal-live');
  let final = document.getElementById('terminal-final');
  if (!summary || !live || !final) {
    const existing = terminalEl.innerHTML;
    terminalEl.innerHTML = '';
    summary = document.createElement('div');
    summary.id = 'terminal-summary';
    summary.className = 'terminal-summary';
    summary.textContent = t('compiler.ready');
    live = document.createElement('div');
    live.id = 'terminal-live';
    live.className = 'terminal-live';
    final = document.createElement('div');
    final.id = 'terminal-final';
    final.className = 'terminal-final';
    if (existing && existing.trim() && existing.trim() !== t('compiler.ready_panel')) {
      final.innerHTML = existing;
    } else {
      final.innerHTML = t('compiler.ready_panel');
    }
    terminalEl.appendChild(summary);
    terminalEl.appendChild(live);
    terminalEl.appendChild(final);
  }
  return { terminalEl, summary, live, final };
}

function setTerminalSummary(text, state = '') {
  const { summary } = ensureTerminalLayout();
  if (!summary) return;
  summary.classList.remove('ok', 'err');
  if (state === 'ok') summary.classList.add('ok');
  if (state === 'err') summary.classList.add('err');
  summary.textContent = text;
}

function setLiveEvent(html) {
  const { live } = ensureTerminalLayout();
  if (!live) return;
  live.innerHTML = html || '';
  live.classList.toggle('on', !!(html && String(html).trim()));
}

function clearLiveEvents() {
  setLiveEvent('');
}

/* ─────────────────────────────────────────────
   STEP NAVIGATION
───────────────────────────────────────────── */
function changeStep(d) {
  if (!history_.length) return;
  step = Math.max(0, Math.min(history_.length - 1, step + d));
  renderStep();
  updStep();
}

function jumpToStep(idx) {
  if (!history_.length) return;
  step = Math.max(0, Math.min(history_.length - 1, idx));
  renderStep();
  updStep();
}

function renderExecutionStory() {
  const host = document.getElementById('viz-story');
  if (!host) return;
  if (!history_.length || step < 0) {
    host.innerHTML = `<div class="viz-empty">${esc(t('memory.execution_timeline_empty'))}</div>`;
    return;
  }
  const windowSize = 12;
  const start = Math.max(0, step - Math.floor(windowSize / 2));
  const end = Math.min(history_.length, start + windowSize);
  const chips = [];
  for (let i = start; i < end; i++) {
    const h = history_[i];
    const label = (h.type === 'exec' || h.name === '__exec__')
      ? `L${h.line}`
      : `${h.name}@L${h.line}`;
    chips.push(`<button class="story-chip ${i === step ? 'on' : ''}" onclick="jumpToStep(${i})">${esc(label)}</button>`);
  }
  host.innerHTML = chips.join('');
}

function renderMemoryMap(snap, activeName) {
  const host = document.getElementById('memory-map');
  if (!host) return;
  const names = Object.keys(snap).filter(n => n !== '__exec__');
  if (!names.length) {
    host.innerHTML = `<div class="viz-empty">${esc(t('memory.map_empty'))}</div>`;
    return;
  }
  host.innerHTML = `<div class="map-grid">${
    names.map(name => {
      const d = snap[name];
      const val = String(d.val ?? '');
      const isPtr = d.type === 'ptr' || /^0x[0-9a-fA-F]{4,}$/i.test(val);
      const target = d.pointsTo ? `→ ${d.pointsTo}` : '';
      return `
        <div class="map-cell ${isPtr ? 'ptr' : ''} ${name === activeName ? 'active' : ''}">
          <div class="map-name">${esc(name)}</div>
          <div class="map-val">${esc(val)}</div>
          <div class="map-meta">${esc((d.type || 'value').toUpperCase())} · ${esc(d.addr || '')}</div>
          ${target ? `<div class="map-link">${esc(target)}</div>` : ''}
        </div>
      `;
    }).join('')
  }</div>`;
}

/* ─────────────────────────────────────────────
   RENDER STEP
   Shows ALL variables accumulated up to current step.
   Detects pointers by hex address value.
   Draws LeaderLine arrows on visible DOM.
───────────────────────────────────────────── */
function renderStep() {
  if (step < 0 || !editor) return;
  const s = history_[step];

  /* ── Editor line highlight ── */
  if (typeof monaco !== 'undefined' && typeof editor.deltaDecorations === 'function') {
    decorations = editor.deltaDecorations(decorations, [{
      range: new monaco.Range(s.line, 1, s.line, 1),
      options: {
        isWholeLine: true,
        className: 'line-highlight',
        glyphMarginClassName: 'line-glyph-arrow',
        glyphMarginHoverMessage: { value: `▶ ${s.name} = ${s.val}` }
      }
    }]);
  }
  if (typeof editor.revealLineInCenter === 'function') {
    editor.revealLineInCenter(s.line);
  }

  /* ── Step banner ── */
  const banner = document.getElementById('step-banner');
  if (banner) {
    banner.classList.add('on');
    const el = document.getElementById('sb-line');
    const ec = document.getElementById('sb-code');
    if (el) el.textContent = 'L' + s.line;
    if (ec) ec.textContent = (s.type === 'exec')
      ? t('compiler.line_executed')
      : (s.name + ' = ' + String(s.val));
  }

  /* ── Build cumulative variable snapshot ──
     Every time a variable is re-assigned, update its entry.
     This means all variables seen so far are visible at once. */
  const snap = {};
  for (let i = 0; i <= step; i++) {
    const h = history_[i];
    snap[h.name] = { ...h };
  }
  renderExecutionStory();
  renderMemoryMap(snap, s.name);
  if (memoryViewOpen) renderMemoryInsight(s, snap);

  /* ── Build address→varName lookup ─── */
  const addrToName = {};
  Object.entries(snap).forEach(([n, d]) => {
    /* The address of variable n */
    if (d.addr) addrToName[d.addr] = n;
  });

  /* ── Render memory cards ── */
  clearArrows();
  const list = document.getElementById('sklist');
  list.innerHTML = '';
  const cardMeta = [];

  Object.entries(snap).forEach(([n, d]) => {
    if (d.type === 'exec' || n === '__exec__') return;
    const isActive = (n === s.name);

    /* Detect pointer: explicit type OR value looks like hex address */
    const valStr = String(d.val);
    const isPtr  = (d.type === 'ptr') ||
                   /^0x[0-9a-fA-F]{4,}$/i.test(valStr);

    /* Resolve where pointer points */
    let ptrTargetId = null;
    if (isPtr) {
      const targetName = d.pointsTo          /* server may tell us directly */
                      || addrToName[valStr]; /* or we match by address value */
      if (targetName && snap[targetName]) {
        ptrTargetId = 'skc-' + CSS.escape(targetName);
      }
    }

    const tag    = isPtr ? 'ptr' : guessTag(d.val, d.type);
    const cardId = 'skc-' + CSS.escape(n);

    const card = document.createElement('div');
    card.className = 'skcard' +
      (isActive ? ' active' : '') +
      (isPtr    ? ' is-ptr' : '');
    card.id = cardId;
    card.innerHTML =
      '<div class="sk-name">' +
        (isActive ? '<span class="sk-active-dot"></span>' : '') +
        esc(n) +
      '</div>' +
      '<span class="sk-tag ' + tag + '">' + tag + '</span>' +
      '<div class="sk-val">' + esc(valStr) + '</div>' +
      (d.addr ? '<div class="sk-addr">' + esc(d.addr) + '</div>' : '');

    list.appendChild(card);
    cardMeta.push({ id: cardId, isPtr, ptrTarget: ptrTargetId });
  });

  /* Draw arrows after TWO animation frames so DOM is fully painted */
  requestAnimationFrame(() =>
    requestAnimationFrame(() => { void drawArrows(cardMeta); })
  );

  updStep();
}

function guessTag(val, typeHint) {
  const t = String(typeHint || '').toLowerCase();
  if (t === 'int') return 'int';
  if (t === 'float' || t === 'double') return 'flt';
  if (t === 'char') return 'chr';
  if (t === 'ptr' || t.endsWith('*')) return 'ptr';
  const v = String(val);
  if (/^0x[0-9a-fA-F]+$/i.test(v)) return 'ptr';
  if (v.includes('.'))              return 'flt';
  if (v.length === 1 && isNaN(+v)) return 'chr';
  return 'int';
}

/* ─────────────────────────────────────────────
   STEP COUNTER + BUTTON ENABLE/DISABLE
───────────────────────────────────────────── */
function updStep() {
  const total = history_.length;
  const cur   = total > 0 ? step + 1 : 0;
  const txt   = cur + '/' + total;

  ['slbl','vslbl'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = txt;
  });

  ['prevbtn','vprev'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.disabled = (step <= 0 || !total);
  });
  ['nextbtn','vnext'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.disabled = (step >= total - 1 || !total);
  });
}

/* ─────────────────────────────────────────────
   SCANF DOCK
───────────────────────────────────────────── */
function showScanfDock(hint) {
  const dock  = document.getElementById('scanf-dock');
  const input = document.getElementById('scanf-input');
  const label = document.getElementById('scanf-label');
  if (!dock) return;
  dock.classList.add('on');
  if (label) label.textContent = t('compiler.program_input');
  if (input) {
    input.placeholder = hint || t('compiler.scanf_placeholder');
    input.value = '';
    setTimeout(() => input.focus(), 100);
  }
  if (typeof window.__applyTerminalSplitLayout === 'function') {
    requestAnimationFrame(() => window.__applyTerminalSplitLayout(false));
  }
  setProgStatus(t('compiler.input_needed'), 'var(--amber)');
}

function hideScanfDock() {
  const dock = document.getElementById('scanf-dock');
  if (dock) dock.classList.remove('on');
  if (typeof window.__applyTerminalSplitLayout === 'function') {
    requestAnimationFrame(() => window.__applyTerminalSplitLayout(false));
  }
}

function submitScanf() {
  const input = document.getElementById('scanf-input');
  if (!input || !socket) return;
  const val = input.value;
  if (!val.trim()) return;
  setProgStatus(t('compiler.running'), 'var(--amber)');
  appendTerminalInputEcho(val);
  socket.emit('sendInput', { value: val });
  input.value = '';
  input.focus();
}

/* ─────────────────────────────────────────────
   ASK AI
───────────────────────────────────────────── */
async function askAI() {
  if (!editor) {
    try {
      await ensureMonacoEditor();
    } catch (_) {
      return;
    }
  }
  const at = document.getElementById('debug-ai-text');
  const selections = (editor.getSelections() || [])
    .map(sel => editor.getModel().getValueInRange(sel))
    .map(t => String(t || '').trim())
    .filter(Boolean);
  if (selections.length > 0) {
    const selected = selections
      .map((block, idx) => `${t('debug.selection_label', { index: idx + 1 })}\n${block}`)
      .join('\n\n');
    const visiblePrompt = `${t('debug.selection_prompt')}\n\n${selected}`;
    const chat = ensureActiveChat(visiblePrompt, { open: false });
    appendMessageToChat(chat, 'user', visiblePrompt);
    renderChatWindow();
    await persistChatSessions();
    at.textContent = t('debug.explaining_selection');
    try {
      const shortContext = chat.messages.slice(-6);
      const res = await authFetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify({
          question: visiblePrompt,
          messages: shortContext,
          preferredLanguage: currentLanguage
        })
      });
      if (res.status === 401) { logout(); return; }
      const data = await res.json().catch(() => ({}));
      const explanation = data.answer || t('debug.no_explanation');
      at.textContent = t('debug.shared_chat_hint');
      appendMessageToChat(chat, 'assistant', explanation);
      renderChatWindow();
      await persistChatSessions();
      lineSelectMode = false;
      const selBtn = document.getElementById('selbtn');
      if (selBtn) {
        selBtn.classList.remove('on');
        selBtn.textContent = t('compiler.select_lines');
      }
      updateLineSelectionDecorations();
    } catch (_) {
      at.textContent = t('debug.ai_unavailable');
      appendMessageToChat(chat, 'assistant', t('debug.ai_unavailable'));
      renderChatWindow();
      await persistChatSessions();
    }
    return;
  }
  if (lineSelectMode) {
    at.textContent = t('debug.select_lines_prompt');
    showToast(t('debug.no_line_selected_toast'), '#ffb800', 1800);
    return;
  }
  if (step < 0) {
    at.textContent = t('debug.step_prompt');
    showToast(t('debug.no_line_selected'), '#ffb800', 1800);
    return;
  }
  at.textContent = t('debug.analyzing_step', { step: step + 1 });
  const currentStep = history_[step];
  const stepSummary = currentStep
    ? (currentStep.type === 'exec'
        ? t('debug.step_summary_line_executed', {
            line: currentStep.line,
            label: t('compiler.line_executed')
          })
        : t('debug.step_summary_value', {
            line: currentStep.line,
            name: currentStep.name,
            value: String(currentStep.val)
          }))
    : t('debug.step_summary_fallback', { step: step + 1 });
  const visiblePrompt = `${t('debug.explain_step_request', { step: step + 1 })}\n\n${stepSummary}`;
  const chat = ensureActiveChat(visiblePrompt, { open: false });
  appendMessageToChat(chat, 'user', visiblePrompt);
  renderChatWindow();
  await persistChatSessions();
  try {
    const res = await authFetch('/api/explain-logic', {
      method: 'POST',
      body: JSON.stringify({ code: editor.getValue(), history: history_, currentStepIndex: step, preferredLanguage: currentLanguage })
    });
    if (res.status === 401) { logout(); return; }
    const explanation = (await res.json()).explanation || t('debug.no_explanation');
    at.textContent = t('debug.shared_chat_hint');
    appendMessageToChat(chat, 'assistant', explanation);
    renderChatWindow();
    await persistChatSessions();
  } catch(e) {
    at.textContent = t('debug.ai_unavailable');
    appendMessageToChat(chat, 'assistant', t('debug.ai_unavailable'));
    renderChatWindow();
    await persistChatSessions();
  }
}

/* ─────────────────────────────────────────────
   TOAST
───────────────────────────────────────────── */
function showToast(msg, col='', dur=3200) {
  const t = document.createElement('div');
  t.className='toast';
  if (col) t.style.borderColor=col;
  t.textContent=msg;
  document.body.appendChild(t);
  setTimeout(()=>{ t.style.opacity='0'; setTimeout(()=>t.remove(),380); }, dur);
}
