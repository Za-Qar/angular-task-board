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

---

## Feature 1 - Core Data Models (Plan)

- Create `Board`, `Column`, and `Task` as TypeScript interfaces in a shared models area.
- Use normalized relationships via IDs (for example, `Task.columnId`, `Board.columnIds`) to simplify NGRX updates and selectors.
- Define priority with a strict union/enum of at least four levels.
- Keep `description` and `assignee` optional; keep `createdAt` and `updatedAt` required.

### Why Interfaces Over Classes

- NGRX store state is expected to be plain serializable objects; interfaces/types model this cleanly.
- Classes add runtime behaviour/prototypes that are usually unnecessary for store entities and can conflict with serialisability best practices.
- If object creation convenience is needed, use typed factory functions that return plain objects.

Source:
- NGRX runtime checks (serializability): https://ngrx.io/guide/store/configuration/runtime-checks
- Redux style guide (serializable state/actions): https://redux.js.org/style-guide/#do-not-put-non-serializable-values-in-state-or-actions

---

## Feature 2 - State Management (NGRX)

- Implemented a full `tasks` store using actions, reducer, selectors, effects, and NgRx Entity.
- Added command/result action flow (`load/add/move/update/remove` + success/failure).
- Implemented optimistic `moveTask` updates with rollback on failure.
- Implemented pessimistic `loadTasks/addTask/updateTask/removeTask` flow (update state on success response).
- Added selector coverage for:
  - tasks by column (factory selector),
  - count by priority,
  - completion rate based on the final column.

### Optimistic vs Pessimistic Updates

- Optimistic update: update client state first, then call server; if it fails, dispatch failure and rollback.
- Pessimistic update: call server first, then update state only after success.
- Why used here: `moveTask` is optimistic for fast UX; other operations are pessimistic to keep write outcomes explicit.

Source:
- NgRx Effects: https://ngrx.io/guide/effects
- NgRx Entity: https://ngrx.io/guide/entity
- NgRx Action Groups: https://ngrx.io/guide/store/actions#action-groups
- Optimistic Offline Lock (Martin Fowler): https://martinfowler.com/eaaCatalog/optimisticOfflineLock.html
- Pessimistic Offline Lock (Martin Fowler): https://martinfowler.com/eaaCatalog/pessimisticOfflineLock.html