# MemFlow AI Task List

This file tracks practical work items for product completion, manual AWS setup, and open-source readiness.

## 1. Product Tasks

- [ ] expand lesson coverage for pointers, memory, file I/O, and debugging
- [ ] add more sample programs for each topic
- [ ] improve first-time onboarding inside the app
- [ ] improve mobile responsiveness in compiler and visualize views
- [ ] add more accessibility improvements for keyboard and screen reader use

## 2. Compiler And Visualization Tasks

- [ ] harden execution error handling and edge cases
- [ ] improve pointer and memory-state explanations
- [ ] add clearer per-step change indicators
- [ ] improve handling of long-running or failed compile sessions
- [ ] consider separate runner-service deployment for stronger isolation

## 3. AI Tasks

- [ ] improve prompt quality for line-level explanations
- [ ] improve fallback behavior when AI services are unavailable
- [ ] add clearer user messaging around AI limitations
- [ ] improve multilingual AI response behavior where supported

## 4. Manual AWS Setup Tasks

- [ ] create Cognito User Pool
- [ ] create Cognito App Client
- [ ] configure Cognito Hosted UI domain
- [ ] set redirect URI for `/callback.html`
- [ ] create DynamoDB table for user profiles
- [ ] enable AWS Bedrock model access
- [ ] provision app hosting target such as ECS or EC2
- [ ] configure environment variables in the runtime environment
- [ ] decide between local execution and remote runner mode
- [ ] if using remote runner, deploy and secure the runner service
- [ ] set up HTTPS, domain, and DNS
- [ ] verify login, profile, chat, compiler, and visualize flows in production

## 5. Repository And Community Tasks

- [ ] add a repository license before inviting broad outside code contributions
- [ ] add screenshots or demo GIFs to the README
- [ ] create GitHub labels such as `good first issue` and `help wanted`
- [ ] open starter issues for contributors
- [ ] consider enabling GitHub Discussions
- [ ] add architecture diagrams for contributors

## 6. Quality And Security Tasks

- [ ] add automated tests beyond syntax validation
- [ ] review auth flows and token handling
- [ ] review runner isolation and untrusted code execution boundaries
- [ ] audit production environment-variable handling
- [ ] add monitoring and logging strategy for deployed environments

## 7. Nice-To-Have Tasks

- [ ] support more localized lesson packs
- [ ] add richer practice checkpoints or quizzes
- [ ] support saved code drafts
- [ ] add shareable run or lesson links
- [ ] improve analytics for learning progress and topic recommendation quality

## 8. Decision Notes

- Terraform is optional for this project.
- This repository can be deployed without Terraform.
- The app runtime depends on correct AWS resources and environment variables, not on infrastructure-as-code files being present in the repo.
