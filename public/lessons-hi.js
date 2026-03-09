(() => {
  const TOPIC_GROUP_LABELS = {
    "Basics": "बुनियादी बातें",
    "Data & Variables": "डेटा और वेरिएबल्स",
    "Control Flow": "कंट्रोल फ्लो",
    "Functions": "फंक्शन्स",
    "Memory & Pointers": "मेमोरी और पॉइंटर्स",
    "Structures": "स्ट्रक्चर्स",
    "Files & I/O": "फ़ाइलें और I/O",
    "Advanced": "एडवांस्ड"
  };

  const TMETA = {
    intro:{icon:"🚀",title:"सी का परिचय",sub:"इतिहास, महत्व और पहला प्रोग्राम"},
    syntax:{icon:"📝",title:"मूल सिंटैक्स",sub:"एक सी प्रोग्राम की रचना"},
    compile:{icon:"⚙️",title:"कम्पाइल और रन",sub:"gcc और कम्पाइलेशन के चरण"},
    comments:{icon:"💬",title:"कमेंट्स",sub:"सिंगल-लाइन और मल्टी-लाइन कमेंट्स"},
    datatypes:{icon:"🔢",title:"डेटा टाइप्स",sub:"int, float, char, double"},
    variables:{icon:"📦",title:"वेरिएबल्स",sub:"डिक्लेरेशन और इनिशियलाइज़ेशन"},
    constants:{icon:"🔒",title:"कॉन्स्टैंट्स",sub:"const और #define"},
    operators:{icon:"➕",title:"ऑपरेटर्स",sub:"अंकगणितीय, लॉजिकल और बिटवाइज़"},
    ifelse:{icon:"🔀",title:"अगर / अन्यथा",sub:"शर्तों के आधार पर निर्णय"},
    switch:{icon:"🎛️",title:"स्विच",sub:"एक से अधिक रास्तों में चयन"},
    for:{icon:"🔁",title:"For लूप",sub:"गिनती-आधारित दोहराव"},
    while:{icon:"⟳",title:"While लूप",sub:"शर्त आधारित लूप"},
    dowhile:{icon:"↩️",title:"Do While",sub:"पहले चलाओ, फिर शर्त जाँचो"},
    break:{icon:"⛔",title:"Break और Continue",sub:"लूप कंट्रोल स्टेटमेंट्स"},
    functions:{icon:"🧩",title:"फंक्शन्स",sub:"डिफाइन, कॉल और रिटर्न"},
    scope:{icon:"📐",title:"स्कोप और लाइफटाइम",sub:"लोकल और ग्लोबल वेरिएबल्स"},
    recursion:{icon:"🌀",title:"रिकर्शन",sub:"जब फंक्शन खुद को कॉल करे"},
    args:{icon:"📨",title:"फंक्शन आर्ग्युमेंट्स",sub:"वैल्यू और रेफरेंस से पास करना"},
    pointers:{icon:"👉",title:"पॉइंटर्स",sub:"पता, डी-रेफरेंस और *ptr"},
    arrays:{icon:"📋",title:"ऐरेज़",sub:"घोषणा, इंडेक्स और दोहराव"},
    strings:{icon:"🔤",title:"स्ट्रिंग्स",sub:"char ऐरे और string.h"},
    malloc:{icon:"🧠",title:"डायनेमिक मेमोरी",sub:"malloc, calloc और free"},
    ptr2d:{icon:"⬛",title:"2D ऐरे और पॉइंटर्स",sub:"मैट्रिक्स और पॉइंटर गणना"},
    struct:{icon:"🏗️",title:"स्ट्रक्ट्स",sub:"कस्टम डेटा टाइप्स"},
    union:{icon:"🔗",title:"यूनियन्स",sub:"साझा मेमोरी वाले टाइप्स"},
    enum:{icon:"📊",title:"एनम्स",sub:"नाम वाले पूर्णांक स्थिरांक"},
    typedef:{icon:"✏️",title:"टाइपडेफ",sub:"टाइप के वैकल्पिक नाम"},
    stdio:{icon:"🖨️",title:"printf और scanf",sub:"फॉर्मैटेड इनपुट और आउटपुट"},
    fileio:{icon:"📁",title:"फ़ाइल इनपुट/आउटपुट",sub:"fopen, fread, fwrite"},
    format:{icon:"🎨",title:"फॉर्मैट स्पेसिफायर्स",sub:"%d, %f, %s और अन्य"},
    preprocessor:{icon:"#",title:"प्रीप्रोसेसर",sub:"#define, #include, macros"},
    bitops:{icon:"💡",title:"बिट ऑपरेशन्स",sub:"शिफ्ट, मास्क और फ्लैग"},
    funcptr:{icon:"🎯",title:"फंक्शन पॉइंटर्स",sub:"कॉलबैक और डिस्पैच टेबल"},
    memory:{icon:"🗂️",title:"मेमोरी लेआउट",sub:"स्टैक, हीप और डेटा सेगमेंट"},
  };

  const TC = {
    intro:{
      sections:[
        {h:"C क्यों सीखें?",c:`<p>C आपको मेमोरी और हार्डवेयर पर सीधा नियंत्रण देता है। यही भाषा Linux, Windows, गेम इंजनों और कई आधुनिक भाषाओं की बुनियाद है।</p>
        <ul><li>तेज़ मूल मशीन कोड में कम्पाइल होती है</li><li>पॉइंटर्स के ज़रिए सीधा मेमोरी नियंत्रण देती है</li><li>माइक्रोकंट्रोलर से लेकर सुपरकम्प्यूटर तक चल सकती है</li><li>C++, Java, Python, Go और Rust जैसी भाषाओं की नींव समझने में मदद करती है</li></ul>`},
        {h:"आपका पहला C प्रोग्राम",c:`<div class="cblk"><span class="cm">// हर C प्रोग्राम यहाँ से शुरू होता है</span>
<span class="kw">#include</span> <span class="str">&lt;stdio.h&gt;</span>

<span class="kw">int</span> <span class="fn">main</span>() {
    <span class="fn">printf</span>(<span class="str">"Hello, World!\\n"</span>);
    <span class="kw">return</span> <span class="nm">0</span>;
}<div class="cbl">C</div></div>
<button class="trybtn" onclick="tryCode('#include &lt;stdio.h&gt;\\nint main() {\\n    printf(&quot;Hello, World!\\\\n&quot;);\\n    return 0;\\n}')">▶ इसे चलाएं</button>`},
        {h:"यह कैसे काम करता है",c:`<div class="ibox">1. <code style="color:var(--cyan)">#include &lt;stdio.h&gt;</code> स्टैंडर्ड इनपुट/आउटपुट लाइब्रेरी लाता है, जिससे <code style="color:var(--cyan)">printf</code> उपलब्ध होता है।<br>2. <code style="color:var(--cyan)">int main()</code> प्रोग्राम का शुरुआती बिंदु है।<br>3. <code style="color:var(--cyan)">return 0</code> ऑपरेटिंग सिस्टम को बताता है कि प्रोग्राम सफलतापूर्वक पूरा हुआ।</div>`}
      ]
    },
    variables:{
      sections:[
        {h:"वेरिएबल घोषित करना",c:`<p>हर वेरिएबल को उपयोग करने से पहले एक <strong style="color:var(--cyan)">type</strong> चाहिए। C एक सख्त typed भाषा है, इसलिए आपको पहले बताना पड़ता है कि वेरिएबल किस तरह का डेटा रखेगा।</p>
        <div class="cblk"><span class="kw">int</span>    age   = <span class="nm">25</span>;       <span class="cm">// पूर्ण संख्याएँ</span>
<span class="kw">float</span>  price = <span class="nm">9.99</span>;     <span class="cm">// दशमलव (लगभग 6-7 महत्वपूर्ण अंक)</span>
<span class="kw">double</span> pi    = <span class="nm">3.14159</span>;  <span class="cm">// दशमलव (लगभग 15-16 महत्वपूर्ण अंक)</span>
<span class="kw">char</span>   grade = <span class="str">'A'</span>;      <span class="cm">// एक अक्षर (ASCII के रूप में संग्रहित)</span><div class="cbl">C</div></div>
<button class="trybtn" onclick="tryCode('#include &lt;stdio.h&gt;\\nint main() {\\n    int age = 25;\\n    float price = 9.99;\\n    printf(&quot;Age: %d\\\\nPrice: %.2f\\\\n&quot;, age, price);\\n    return 0;\\n}')">▶ इसे विजुअलाइज़ करें</button>`},
        {h:"मेमोरी में type का आकार",c:`<div class="cblk"><span class="kw">char</span>   → <span class="nm">1</span> byte   → -128 से 127
<span class="kw">int</span>    → <span class="nm">4</span> bytes  → -2,147,483,648 से 2,147,483,647
<span class="kw">float</span>  → <span class="nm">4</span> bytes  → लगभग 6-7 महत्वपूर्ण अंक
<span class="kw">double</span> → <span class="nm">8</span> bytes  → लगभग 15-16 महत्वपूर्ण अंक<div class="cbl">sizes</div></div>`},
        {h:"ज़रूरी नियम",c:`<ul><li>नाम अक्षर या underscore से शुरू होना चाहिए</li><li>सिर्फ letters, digits और underscores उपयोग करें</li><li>C case-sensitive है: <code style="color:var(--cyan)">Age</code> और <code style="color:var(--cyan)">age</code> अलग हैं</li></ul>
<div class="wbox">⚠️ किसी वेरिएबल को पढ़ने से पहले उसे initialize करें, वरना उसमें garbage value हो सकती है।</div>`}
      ]
    },
    for:{
      sections:[
        {h:"सिंटैक्स",c:`<p><code style="color:var(--cyan)">for</code> loop तब सबसे उपयोगी होता है जब आपको दोहरावों की संख्या पता हो।</p>
        <div class="cblk"><span class="kw">for</span> (init; condition; update) {
    <span class="cm">// बॉडी तब तक चलती है जब तक condition सही है</span>
}<div class="cbl">C</div></div>
<div class="ibox"><strong>init</strong> शुरुआत में एक बार चलता है, जैसे <code style="color:var(--cyan)">i = 0</code>।<br><strong>condition</strong> हर दोहराव से पहले जाँची जाती है।<br><strong>update</strong> हर दोहराव के बाद चलता है, जैसे <code style="color:var(--cyan)">i++</code>।</div>`},
        {h:"क्लासिक उदाहरण",c:`<div class="cblk"><span class="kw">#include</span> <span class="str">&lt;stdio.h&gt;</span>
<span class="kw">int</span> <span class="fn">main</span>() {
    <span class="kw">int</span> i;
    <span class="kw">for</span>(i = <span class="nm">0</span>; i &lt; <span class="nm">5</span>; i++) {
        <span class="fn">printf</span>(<span class="str">"%d\\n"</span>, i);
    }
    <span class="kw">return</span> <span class="nm">0</span>;
}<div class="cbl">C</div></div>
<button class="trybtn" onclick="tryCode('#include &lt;stdio.h&gt;\\nint main() {\\n    int i;\\n    for(i = 0; i &lt; 5; i++) {\\n        printf(&quot;%d\\\\n&quot;, i);\\n    }\\n    return 0;\\n}')">▶ इसे स्टेप-बाय-स्टेप देखें</button>`},
        {h:"हर दोहराव में क्या होता है",c:`<div class="cblk">i = 0 → 0 &lt; 5? हाँ → 0 प्रिंट → i++
i = 1 → 1 &lt; 5? हाँ → 1 प्रिंट → i++
...
i = 4 → 4 &lt; 5? हाँ → 4 प्रिंट → i++
i = 5 → 5 &lt; 5? नहीं → लूप समाप्त<div class="cbl">trace</div></div>`}
      ]
    },
    pointers:{
      sections:[
        {h:"Pointer क्या है?",c:`<p>Pointer ऐसा वेरिएबल है जो किसी दूसरे वेरिएबल का <strong style="color:var(--cyan)">memory address</strong> store करता है। यह value नहीं, बल्कि value जहाँ RAM में रखी है वह स्थान संभालता है।</p>
        <div class="cblk"><span class="kw">int</span>  x   = <span class="nm">10</span>;    <span class="cm">// x में 10 रखा है</span>
<span class="kw">int</span> *ptr = &amp;x;    <span class="cm">// ptr में x का पता रखा है</span>

<span class="fn">printf</span>(<span class="str">"%d"</span>,  x);    <span class="cm">// → 10     (value)</span>
<span class="fn">printf</span>(<span class="str">"%p"</span>,  ptr);  <span class="cm">// → 0x7ffe (पता)</span>
<span class="fn">printf</span>(<span class="str">"%d"</span>, *ptr);  <span class="cm">// → 10     (पते पर रखी value)</span><div class="cbl">C</div></div>
<button class="trybtn" onclick="tryCode('#include &lt;stdio.h&gt;\\nint main() {\\n    int x = 10;\\n    int *ptr = &x;\\n    printf(&quot;x = %d\\\\n&quot;, x);\\n    printf(&quot;*ptr = %d\\\\n&quot;, *ptr);\\n    *ptr = 42;\\n    printf(&quot;x after *ptr=42: %d\\\\n&quot;, x);\\n    return 0;\\n}')">▶ एडिटर में आज़माएं</button>`},
        {h:"दो मुख्य ऑपरेटर्स",c:`<ul>
          <li><code style="color:var(--cyan)">&amp;</code> — <strong>address-of</strong>: किसी variable का memory address देता है</li>
          <li><code style="color:var(--cyan)">*</code> — <strong>dereference</strong>: address पर जाकर वहाँ रखी value पढ़ता या बदलता है</li>
        </ul>`},
        {h:"Pointers क्यों महत्वपूर्ण हैं?",c:`<ul>
          <li>बड़े data को copy किए बिना functions में भेज सकते हैं</li>
          <li>dynamic memory allocation के लिए ज़रूरी हैं</li>
          <li>linked list, tree और graph जैसी data structures बनती हैं</li>
          <li>string handling और file I/O में इनका व्यापक उपयोग होता है</li>
        </ul>
        <div class="wbox">⚠️ NULL या uninitialized pointer को dereference करने पर program crash हो सकता है।</div>`}
      ]
    },
    functions:{
      sections:[
        {h:"Function की परिभाषा",c:`<div class="cblk"><span class="kw">int</span> <span class="fn">add</span>(<span class="kw">int</span> a, <span class="kw">int</span> b) {
    <span class="kw">return</span> a + b;
}

<span class="kw">int</span> <span class="fn">main</span>() {
    <span class="kw">int</span> result = <span class="fn">add</span>(<span class="nm">3</span>, <span class="nm">4</span>);
    <span class="fn">printf</span>(<span class="str">"%d"</span>, result);  <span class="cm">// 7</span>
    <span class="kw">return</span> <span class="nm">0</span>;
}<div class="cbl">C</div></div>
<button class="trybtn" onclick="tryCode('#include &lt;stdio.h&gt;\\nint add(int a, int b) {\\n    return a + b;\\n}\\nint main() {\\n    int result = add(3, 4);\\n    printf(&quot;Result: %d\\\\n&quot;, result);\\n    return 0;\\n}')">▶ इसे विजुअलाइज़ करें</button>`},
        {h:"रिटर्न टाइप्स",c:`<ul><li><code style="color:#79b8ff">int/float/double/char</code> — उसी type की value लौटाते हैं</li><li><code style="color:#79b8ff">void</code> — कुछ भी return नहीं करता</li><li>return type वही होना चाहिए जो function वास्तव में लौटाए</li></ul>`},
        {h:"Functions क्यों उपयोगी हैं?",c:`<ul><li><strong>पुनः उपयोग</strong> — एक बार लिखो, कई बार इस्तेमाल करो</li><li><strong>व्यवस्थित करना</strong> — बड़ी समस्या को छोटे हिस्सों में बाँटो</li><li><strong>जाँच</strong> — हर function को अलग से परखो</li><li><strong>पढ़ने में सरल</strong> — कोड ज़्यादा साफ़ और समझने योग्य बनता है</li></ul>`}
      ]
    },
    arrays:{
      sections:[
        {h:"Arrays घोषित करना",c:`<div class="cblk"><span class="kw">int</span> nums[<span class="nm">5</span>] = {<span class="nm">10</span>, <span class="nm">20</span>, <span class="nm">30</span>, <span class="nm">40</span>, <span class="nm">50</span>};
<span class="cm">//      [0]  [1]  [2]  [3]  [4]   ← इंडेक्स 0 से शुरू होते हैं!</span>

<span class="fn">printf</span>(<span class="str">"%d"</span>, nums[<span class="nm">0</span>]);  <span class="cm">// → 10</span>
<span class="fn">printf</span>(<span class="str">"%d"</span>, nums[<span class="nm">4</span>]);  <span class="cm">// → 50</span><div class="cbl">C</div></div>
<button class="trybtn" onclick="tryCode('#include &lt;stdio.h&gt;\\nint main() {\\n    int nums[5] = {10, 20, 30, 40, 50};\\n    int i;\\n    for(i = 0; i &lt; 5; i++) {\\n        printf(&quot;nums[%d] = %d\\\\n&quot;, i, nums[i]);\\n    }\\n    return 0;\\n}')">▶ इसे विजुअलाइज़ करें</button>`},
        {h:"मुख्य नियम",c:`<ul><li>सभी elements एक ही type के होते हैं</li><li>size declaration के समय तय होता है, बाद में बढ़ता नहीं</li><li>index 0 से शुरू होकर size-1 पर खत्म होता है</li></ul>
<div class="wbox">⚠️ array bounds के बाहर access करना undefined behavior है। C अपने आप सीमा-जाँच नहीं करता।</div>`}
      ]
    }
  };

  Object.keys(TMETA).forEach((id) => {
    if (!TC[id]) {
      TC[id] = {
        sections: [
          {
            h: "अवधारणा परिचय",
            c: `<p><strong style="color:var(--cyan)">${TMETA[id].title}</strong> C प्रोग्रामिंग का एक महत्वपूर्ण हिस्सा है। नोट्स पढ़ें, उदाहरण कोड चलाएँ, और visualizer में step-by-step execution देखें।</p>
                <div class="ibox">सुझाव: <strong>Run</strong> दबाने के बाद step controls का उपयोग करें और देखें कि variables और memory कैसे बदलते हैं।</div>`
          },
          {
            h: "उदाहरण कोड",
            c: `<div class="cblk"><span class="kw">#include</span> <span class="str">&lt;stdio.h&gt;</span>
<span class="kw">int</span> <span class="fn">main</span>() {
    <span class="cm">// अभ्यास विषय</span>
    <span class="kw">int</span> value = <span class="nm">10</span>;
    <span class="fn">printf</span>(<span class="str">"value = %d\\n"</span>, value);
    <span class="kw">return</span> <span class="nm">0</span>;
}<div class="cbl">C</div></div>
<button class="trybtn" onclick="tryCode('#include &lt;stdio.h&gt;\\nint main() {\\n    // अभ्यास विषय\\n    int value = 10;\\n    printf(&quot;value = %d\\\\n&quot;, value);\\n    return 0;\\n}')">▶ एडिटर में आज़माएं</button>`
          },
          {
            h: "क्या देखें",
            c: `<ul>
                  <li>execution के दौरान current line highlight कैसे बदलती है</li>
                  <li>memory cards में variables कैसे दिखाई देते और बदलते हैं</li>
                  <li>terminal output और execution steps का संबंध कैसे बनता है</li>
                </ul>`
          }
        ]
      };
    }
  });

  window.__MEMFLOW_HI_LESSONS__ = {
    TMETA,
    TC,
    TOPIC_GROUP_LABELS
  };
})();
