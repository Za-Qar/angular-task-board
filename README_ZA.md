# Carno Task Board - Notes

## Development Environment

Before scaffolding the app, I updated my local development environment to the latest TypeScript version and `npm` version `11.11.0`.

## App Creation

I created the Angular application with:

```bash
npx @angular/cli@latest new carno-task-board --routing --style=scss --strict
```

## AI Tooling Configuration

For Angular AI best-practices integration, I selected `Agents.md`.

Reason: `Agents.md` defines project-specific instructions for AI assistants, so generated code follows the same standards and stays consistent across the codebase.
SSR: not enabled, since it is outside the core requirements and focus was kept on NGRX, Signals, dynamic rendering, and architecture.

