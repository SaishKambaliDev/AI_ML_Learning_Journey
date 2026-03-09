# MemFlow AI Requirements

## 1. Purpose

MemFlow AI is a web platform for learning C programming through lessons, live code execution, step-by-step runtime visualization, memory inspection, and AI-assisted explanations.

This document defines the product and technical requirements for the current version of the project.

## 2. Product Goals

- Help users learn C by combining explanation and experimentation in one interface.
- Make program execution easier to understand through timeline and memory visualization.
- Support multilingual learning for a broader audience.
- Provide a deployment path that works both for local demos and AWS-backed multi-user setups.

## 3. Target Users

- students learning C programming
- beginners who struggle with pointers, variables, and memory flow
- educators or mentors demonstrating C concepts live
- hackathon judges or reviewers evaluating the product quickly

## 4. Functional Requirements

### 4.1 Learning Experience

- The system must provide topic-based C learning content.
- The system must allow users to browse, search, and open lessons.
- The system should support expanding lesson coverage over time.

### 4.2 Compiler And Execution

- The system must let users write C code in the browser.
- The system must allow users to run and stop code execution.
- The system must display program output.
- The system must handle runtime input for programs using `scanf`.

### 4.3 Execution Visualization

- The system must show execution as a sequence of steps.
- The system must allow users to move backward and forward through steps.
- The system must highlight the current source line.
- The system must display variable state across execution steps.

### 4.4 Memory Visualization

- The system must display memory-related state in a user-readable form.
- The system should show variable values, addresses, and pointer relationships.
- The system should provide stack and heap style views where possible.

### 4.5 AI Assistance

- The system must allow users to ask general C-related questions.
- The system must allow users to request explanations for selected lines.
- The system should explain the current execution step and memory changes.

### 4.6 User Accounts And Progress

- The system must support authenticated user sessions in production mode.
- The system should store user theme and language preferences.
- The system should track completed topics and progress.
- The system should support recommended topics based on progress data.

### 4.7 Multilingual Support

- The system must support English.
- The system should support Hindi, Bengali, Telugu, Tamil, and Marathi in the UI.
- The system should allow lesson localization to expand over time.

### 4.8 Export And Persistence

- The system should allow downloading the current code as a `.c` file.
- The system should allow exporting the active lesson/topic as HTML.
- The system should persist chat sessions and profile data for authenticated users.

### 4.9 Deployment Flexibility

- The system must support local demo mode without real AWS auth.
- The system must support production mode with AWS-backed services.
- The system must be deployable with manual AWS setup.
- Terraform is not required for runtime operation.

## 5. Non-Functional Requirements

### 5.1 Usability

- The UI should be understandable for first-time users.
- The product should support desktop and mobile usage.
- The demo path should be quick enough for hackathon presentations.

### 5.2 Performance

- The UI should remain responsive while editing and stepping through code.
- Execution updates should reach the frontend with low visible delay.
- Static assets should load quickly in normal network conditions.

### 5.3 Reliability

- The system should recover from temporary socket disconnects where possible.
- The system should fail clearly when auth, runner, or AI services are unavailable.
- The local demo mode should remain usable even without AWS services.

### 5.4 Security

- Authenticated endpoints must validate user identity in production mode.
- Sensitive credentials must not be committed to source control.
- Code execution should be isolated appropriately for the deployment model.

### 5.5 Maintainability

- The repository should include contributor-facing documentation.
- The codebase should support incremental feature additions.
- The project should remain understandable to outside contributors.

## 6. Technical Requirements

- Node.js 20+
- npm
- Express-based application server
- Socket.IO for real-time execution events
- one execution backend:
  - local `gcc`
  - Docker-based local isolation
  - or a remote runner service

## 7. AWS Requirements For Manual Setup

If AWS is configured manually, the project may require:

- Amazon Cognito for authentication
- DynamoDB for profile persistence
- AWS Bedrock for AI explanation endpoints
- a hosted app target such as ECS, EC2, or another Node-capable environment
- optional runner service hosting if remote execution is used

## 8. Out Of Scope Or Optional

- Terraform is not required.
- Fully automated infrastructure provisioning is optional.
- Large-scale production hardening beyond current repo scope is optional for early demos.
