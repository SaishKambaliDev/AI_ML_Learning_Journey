# Demo Guide

Use this file when you are presenting the project to judges, mentors, or potential contributors.

## Two-Minute Demo Flow

### 1. Start on the home page

Show that MemFlow AI is not only a compiler. It is a guided C learning workspace with:

- lessons
- suggested topics
- chat access
- compiler and visualize modes

### 2. Open a lesson

Pick a topic such as variables, loops, functions, or pointers.

Explain the product loop:

1. learn the idea
2. try code immediately
3. inspect how execution changes memory

### 3. Open the compiler

Run a small C program and point out:

- in-browser editing
- terminal output
- step navigation
- active line highlighting

### 4. Open the memory visualization

Step through the run and show:

- variable cards
- memory map
- pointer relationships
- stack and heap style views

This is the strongest product moment in the demo.

### 5. Use AI

Highlight a few lines and click the AI explanation flow, or ask for an explanation of the current execution step.

This shows that the project is not only visual but also explanatory.

### 6. Switch language

Change the UI language to demonstrate accessibility and broader reach.

### 7. Close with the deployment story

Mention that the same app supports:

- local demo mode for quick judging
- AWS-backed auth and profiles
- optional Bedrock integration
- Docker and manual AWS deployment

## Demo Mode Setup

If you need the fastest local presentation path:

```env
DEMO_MODE=true
EXECUTION_MODE=local
ALLOW_LOCAL_EXECUTION=true
PREFER_LOCAL_EXECUTION=true
```

Then run:

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Suggested Demo Program

Use a short example that shows both value changes and memory relationships:

```c
#include <stdio.h>

int main() {
    int x = 10;
    int y = 20;
    int *p = &x;
    x = x + y;
    printf("%d\n", x);
    return 0;
}
```

## Judge-Friendly Talking Points

- It teaches concepts and shows runtime behavior, not just final output.
- It supports both beginners and more advanced memory-focused learning.
- It is demoable locally without cloud setup, but it also has a real production path.
- The repository is prepared for outside contributors with CI, templates, and project docs.
