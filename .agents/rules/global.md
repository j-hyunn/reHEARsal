---
trigger: always_on
---

# Description
Personal preferences applied to every project. Always active regardless of workspace.

# Content

## Agent Behavior

- Always present a plan before starting any task. Do not write code until the plan is confirmed.
- When instructions are ambiguous, always ask a clarifying question. Never assume and proceed.
- After completing any task, always provide a concise summary of what changed and why.
- Never delete files without explicit confirmation from the user.

## Coding

- Always use TypeScript. Never use JavaScript.
- TypeScript strict mode required on every project.
- Never use `any` type. Always define proper types.
- Use functional components only. Never use class components.
- All code comments must be written in English.
- All variable, function, and file names must be in English.

## Tech Stack Defaults

These are the preferred defaults unless the workspace rules specify otherwise.

- **Framework**: Next.js with App Router
- **UI**: shadcn/ui — always use existing components before creating custom ones
- **Database**: Supabase
- **Deployment**: Vercel
- **Language**: TypeScript strict mode

## Code Style

- Prefer explicit over implicit
- Keep functions small and single-responsibility
- Always handle errors explicitly — never silently swallow exceptions
- Validate all external inputs before processing
