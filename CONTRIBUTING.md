# Contributing To MemFlow AI

Thanks for considering a contribution.

This project sits at the intersection of education, developer tooling, visualization, and AI. That means good contributions are not limited to code. Lesson quality, onboarding, translations, accessibility, security hardening, and deployment polish all matter.

## Good Places To Help

- lesson content and examples
- UI polish and responsiveness
- accessibility fixes
- translation improvements
- execution runner reliability
- documentation and demo assets
- automated testing and CI improvements

## Local Setup

### Fastest path

```bash
npm install
cp .env.example .env
npm run dev
```

For a quick local workflow, enable:

```env
DEMO_MODE=true
EXECUTION_MODE=local
ALLOW_LOCAL_EXECUTION=true
PREFER_LOCAL_EXECUTION=true
```

Run validation before opening a PR:

```bash
npm run validate
```

## Contribution Workflow

1. Open an issue first for larger features, architecture changes, or security-sensitive work.
2. Keep pull requests focused and reviewable.
3. Update docs when behavior, setup, or contributor workflow changes.
4. Add screenshots or short recordings for visible UI changes when possible.
5. Call out risk areas clearly if your change touches auth, code execution, or data handling.

## Coding Expectations

- Preserve existing behavior unless the PR explicitly changes it.
- Prefer small, incremental changes over broad rewrites.
- Keep naming and structure consistent with the surrounding code.
- Document sharp edges instead of hiding them.
- Avoid introducing secrets, credentials, or hardcoded environment-specific values.

## Sensitive Areas

Please use extra care in these parts of the codebase:

- `server.js`
- `services/dockerRunner.js`
- `src/authMiddleware.js`
- auth token handling in `public/index.js`
- anything related to remote execution or cloud infrastructure

If you are changing execution isolation, authentication, or data persistence behavior, explain the tradeoffs in the PR description.

## Suggested Labels For Maintainers

- `good first issue`
- `help wanted`
- `bug`
- `enhancement`
- `documentation`
- `security`
- `translation`

## Contributor Checklist

- I ran `npm run validate`.
- I updated relevant documentation.
- I described any user-visible behavior changes.
- I mentioned security implications if the change touches auth or execution.

## Project Policy Note

Before accepting significant third-party code, the maintainer should choose and publish a repository license. That decision is intentionally left to the project owner.
