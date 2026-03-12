# Security Policy

MemFlow AI executes user-provided C code, so security matters more here than it does in a typical content-only web app.

## Reporting A Vulnerability

Please do not post working exploit details in a public issue.

Preferred options:

1. Use GitHub private vulnerability reporting if it is enabled for the repository.
2. Otherwise contact the maintainer privately.
3. If no private channel exists, open a short public issue requesting a private follow-up channel without including exploit details.

## High-Risk Areas

- code execution and runner isolation
- authentication and token handling
- cloud credentials and environment variables
- remote execution networking and trust boundaries
- profile persistence and chat data handling

## Expectations For Contributors

- never commit secrets or real credentials
- use demo mode for most local UI work
- describe security impact in PRs that touch auth, execution, storage, or network boundaries
- avoid widening execution permissions without a clear rationale

## Operational Notes

- prefer isolated execution for untrusted code
- keep local development secrets in `.env`, never in source control
- review CORS, auth middleware, and runner configuration before production deployment

## Supported Security Posture

This repository provides a solid prototype and hackathon baseline, but production deployments should still perform a dedicated security review before handling untrusted public traffic at scale.
