# MemFlow AI

![Hackathon Ready](https://img.shields.io/badge/hackathon-ready-0a7cff)
![Node.js 20+](https://img.shields.io/badge/node-20%2B-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/backend-Express-111111?logo=express&logoColor=white)
![Socket.IO](https://img.shields.io/badge/realtime-Socket.IO-010101?logo=socketdotio&logoColor=white)
![Contributions Welcome](https://img.shields.io/badge/contributions-welcome-brightgreen)

MemFlow AI is a browser-based C programming workspace that combines lessons, code execution, step-by-step runtime visualization, memory inspection, multilingual learning, and AI-assisted explanations in one product.

It is designed to be easy to demo in a hackathon setting and practical to grow as an open-source project.

## Why This Project Stands Out

- Learning and doing happen in one loop: read a concept, run code, inspect memory, ask questions.
- The compiler experience is not just output-based; it shows execution steps and variable state over time.
- The product is multilingual from the UI level upward, which makes it more accessible than a typical devtool demo.
- The architecture scales from a simple local demo mode to an AWS-backed multi-user deployment.
- The repository now includes contributor docs, issue templates, PR templates, CI, and a roadmap for outside collaborators.

## What Judges Can Evaluate Quickly

- Educational value: guided C topics plus live experimentation.
- Technical depth: Express, Socket.IO, compiler execution flow, memory visualization, and optional AWS integrations.
- Product thinking: multilingual support, account profiles, progress tracking, AI tutoring, and export flows.
- Deployment maturity: Docker support, manual AWS deployment, remote execution mode, and repo automation.

## Core Features

- Structured C programming lessons and topic navigation.
- In-browser C editor with run/stop controls.
- Step-by-step execution timeline.
- Memory cards, memory map, and pointer visualization.
- AI chat for general questions and line-by-line explanations.
- Multilingual UI with Hindi, Bengali, Telugu, Tamil, and Marathi support.
- User profiles with saved preferences and learning progress.
- Downloadable code and lesson pages.

Detailed frontend notes:

- [DEMO.md](./DEMO.md)
- [ROADMAP.md](./ROADMAP.md)
- [CONTRIBUTING.md](./CONTRIBUTING.md)
- [SECURITY.md](./SECURITY.md)
- [public/functions.md](./public/functions.md)
- [public/about.md](./public/about.md)

## Demo In 3 Minutes

This is the fastest local path for a hackathon demo.

### 1. Install dependencies

```bash
npm install
```

### 2. Create env file

```bash
cp .env.example .env
```

### 3. Enable local demo mode

Set these values in `.env`:

```env
DEMO_MODE=true
EXECUTION_MODE=local
ALLOW_LOCAL_EXECUTION=true
PREFER_LOCAL_EXECUTION=true
```

### 4. Start the app

```bash
npm run dev
```

Open `http://localhost:3000`.

If `gcc` is available locally, the app can compile directly on the host. If not, use Docker as the local execution backend.

For a judge-friendly walkthrough, use [DEMO.md](./DEMO.md).

## Architecture At A Glance

1. The browser loads a single-page frontend from `public/index.html`, `public/index.js`, and `public/index.css`.
2. Express serves static assets, auth endpoints, profile APIs, chat APIs, and app routes.
3. Socket.IO powers the run/visualize loop between the client and the execution backend.
4. `services/dockerRunner.js` selects local or containerized execution and manages temporary build workspaces.
5. Optional AWS integrations add Cognito auth, DynamoDB-backed profiles, and Bedrock-powered explanations.

## Repository Map

```text
.
|-- public/
|   |-- index.html
|   |-- index.js
|   |-- index.css
|   |-- login.html
|   |-- callback.html
|   |-- regional.html
|   |-- lessons-hi.js
|   |-- i18n/
|   |-- functions.md
|   `-- about.md
|-- services/
|   `-- dockerRunner.js
|-- src/
|   |-- authMiddleware.js
|   `-- sessionManager.js
|-- .github/
|   |-- workflows/ci.yml
|   |-- ISSUE_TEMPLATE/
|   `-- pull_request_template.md
|-- CONTRIBUTING.md
|-- CODE_OF_CONDUCT.md
|-- SECURITY.md
|-- ROADMAP.md
|-- DEMO.md
|-- Dockerfile
|-- package.json
|-- .env.example
`-- server.js
```

## Local Development

### Prerequisites

- Node.js 20+
- npm
- One execution backend:
  - local `gcc`, recommended for fast local iteration
  - or Docker for isolated local compilation

### Commands

```bash
npm install
npm run dev
npm run validate
```

### Environment Modes

#### Fast local UI/demo mode

```env
DEMO_MODE=true
EXECUTION_MODE=local
ALLOW_LOCAL_EXECUTION=true
PREFER_LOCAL_EXECUTION=true
```

#### Full local mode with AWS auth

```env
AWS_REGION=...
COGNITO_USER_POOL_ID=...
COGNITO_CLIENT_ID=...
COGNITO_CLIENT_SECRET=...
COGNITO_DOMAIN=...
COGNITO_REDIRECT_URI=http://localhost:3000/callback.html
DYNAMODB_PROFILE_TABLE=...
BEDROCK_MODEL_ID=...
```

## Production Path

This repo already supports a more serious deployment story:

- Docker image for the app server
- manual AWS setup for auth, storage, AI, and hosting
- Cognito for auth
- DynamoDB for profile storage
- Bedrock for AI responses
- Remote execution mode for isolating the compiler from the web app

Useful commands:

```bash
docker build -t memflow-ai .
```

## Open Collaboration

This project is ready for outside contributors. High-value areas include:

- better lesson content and examples
- translation coverage and QA
- execution runner hardening
- test coverage and CI expansion
- frontend UX polish and accessibility
- memory visualization enhancements
- contributor documentation and demo assets

Start with [CONTRIBUTING.md](./CONTRIBUTING.md) and [ROADMAP.md](./ROADMAP.md).

## Tech Stack

- Node.js
- Express
- Socket.IO
- AWS Cognito
- AWS DynamoDB
- AWS Bedrock
- Docker
- Monaco Editor

## Validation And CI

This repo includes:

- `npm run validate` for JavaScript syntax checks across the main app files
- a GitHub Actions CI workflow
- issue templates and a PR template
- Dependabot updates for npm and GitHub Actions

## Maintainer Checklist Before Publishing

- add your real GitHub repository URL in this README if desired
- add screenshots or a demo GIF near the top of the page
- choose and publish a project license before accepting significant third-party code
- enable GitHub Discussions if you want community Q and A
- create labels such as `good first issue`, `help wanted`, `bug`, and `docs`
