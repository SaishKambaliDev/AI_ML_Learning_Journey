# MemFlow AI Design

## 1. Overview

MemFlow AI is designed as a single Node.js web application with a browser-based frontend and optional AWS service integrations.

The design goal is to keep the product easy to demo locally while still supporting a more serious multi-user deployment model.

## 2. High-Level Architecture

### 2.1 Main Components

- frontend application in `public/`
- Express server in `server.js`
- execution backend selection in `services/dockerRunner.js`
- auth middleware in `src/authMiddleware.js`
- session isolation in `src/sessionManager.js`
- optional AWS service integrations

### 2.2 Core Runtime Model

1. The browser loads the main SPA shell from `index.html`.
2. `index.js` manages routing, UI state, compiler workflow, memory views, and chat behavior.
3. Express serves static files and backend APIs.
4. Socket.IO carries live execution output and step events between the frontend and backend.
5. The backend compiles and runs code using local execution, Docker, or a remote runner.

## 3. Frontend Design

### 3.1 Main Areas

- home page with suggestions and entry points
- lesson/topic view
- compiler/editor view
- visualize/memory view
- AI chat workspace
- account and language controls

### 3.2 Frontend Responsibilities

- client-side route handling for `/`, `/compiler`, and `/visualize`
- UI language switching
- topic rendering
- code editing and run controls
- execution step navigation
- memory rendering
- chat session handling
- download/export actions

## 4. Backend Design

### 4.1 Express Server Responsibilities

- serve static frontend assets
- serve SPA shell routes
- provide auth endpoints
- provide profile endpoints
- provide AI/chat endpoints
- initialize and secure Socket.IO connections

### 4.2 Session Model

- each authenticated user has isolated run state
- session cleanup logic helps prevent stale compiler processes
- socket auth and HTTP auth share the same identity model in production mode

## 5. Authentication Design

### 5.1 Production Auth Flow

1. User opens `login.html`.
2. The app redirects to Cognito Hosted UI.
3. Cognito returns an authorization code to `callback.html`.
4. The backend exchanges the code for tokens.
5. The frontend stores tokens and sends them with HTTP and socket requests.

### 5.2 Demo Mode

- demo mode bypasses Cognito for local development and hackathon demos
- a demo user context is injected by the backend

## 6. Execution And Visualization Design

### 6.1 Code Execution

- the client emits `runCode` over Socket.IO
- the server compiles and runs the submitted C source
- plain output is streamed back to the terminal
- structured markers are emitted for execution steps and input prompts

### 6.2 Execution Step Model

The frontend interprets emitted step payloads and uses them to:

- build execution history
- highlight active lines
- render variable state
- enable step navigation
- render memory-oriented views

### 6.3 Input Handling

- if runtime input is required, the backend emits an input-needed event
- the frontend shows an input dock and sends values back through the socket

## 7. Data And AI Design

### 7.1 Profile Data

User profile data may include:

- name and email
- theme
- preferred language
- completed topics
- progress metrics
- recommended topics

### 7.2 Chat And Explanation Data

- general chat uses backend AI endpoints
- execution explanation uses the current code and step history
- chat state is stored client-side and may also be persisted server-side for authenticated users

## 8. Deployment Design

## 8.1 Local Development

- Node.js app server
- local `gcc` or Docker
- optional demo mode
- no AWS services required for UI-only or basic local demos

## 8.2 Manual AWS Deployment

Terraform is not required for this repository setup.

Recommended manual AWS mapping:

- Cognito User Pool and App Client for auth
- DynamoDB table for user profiles and optionally chat/session persistence
- Bedrock model access for AI endpoints
- ECS, EC2, or another compute target for the Node.js app
- optional separate runner service if using remote execution
- Route 53 and ACM if using a custom HTTPS domain

## 8.3 Infrastructure Note

The application runtime depends on environment variables and AWS resources, not on Terraform.

## 9. Design Tradeoffs

- Single-server structure keeps the project easier to demo and reason about.
- Optional AWS integrations keep the local path simple.
- Socket-based execution makes the visualization experience much stronger than request-response only execution.
- Manual AWS setup gives more control, but also requires more direct infrastructure work.

## 10. Future Design Improvements

- stronger execution isolation
- more automated testing
- clearer observability around compile and socket failures
- richer lesson authoring structure
- more scalable separation of web app and runner services
