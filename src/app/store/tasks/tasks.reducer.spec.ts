import '@angular/compiler';

import { describe, expect, it } from 'vitest';

import { IColumn } from '../../models/column.model';
import { PriorityLevel } from '../../models/priority.level.enum';
import { ITask } from '../../models/task.model';
import { TasksActions } from './tasks.actions';
import { tasksReducer } from './tasks.reducer';
import { initialTasksState } from './tasks.state';

const task1Id = 'task-1';
const columnTodoId = 'col-todo';
const columnDoingId = 'col-doing';
const serverMoveError = 'Server move failed.';

const columns: IColumn[] = [
  { id: columnTodoId, name: 'Todo', order: 1 },
  { id: columnDoingId, name: 'Doing', order: 2 },
  { id: 'col-done', name: 'Done', order: 3 },
];

const now = new Date().toISOString();

const tasks: ITask[] = [
  {
    id: task1Id,
    title: 'Task 1',
    columnId: columnTodoId,
    priorityLevel: PriorityLevel.HIGH,
    timestamp: { createdAt: now, updatedAt: now },
  },
  {
    id: 'task-2',
    title: 'Task 2',
    columnId: 'col-done',
    priorityLevel: PriorityLevel.LOW,
    timestamp: { createdAt: now, updatedAt: now },
  },
];

function createLoadedState() {
  return tasksReducer(
    initialTasksState,
    TasksActions.loadTasksSuccess({
      boardId: 'board-1',
      tasks,
      columns,
    })
  );
}

describe('tasksReducer', () => {
  it('optimistically updates column on moveTask', () => {
    const state = createLoadedState();

    const movedState = tasksReducer(
      state,
      TasksActions.moveTask({
        taskId: task1Id,
        fromColumnId: columnTodoId,
        toColumnId: columnDoingId,
      })
    );

    expect(movedState.entities[task1Id]?.columnId).toBe(columnDoingId);
  });

  it('rolls back column on moveTaskFailure', () => {
    const state = createLoadedState();
    const movedState = tasksReducer(
      state,
      TasksActions.moveTask({
        taskId: task1Id,
        fromColumnId: columnTodoId,
        toColumnId: columnDoingId,
      })
    );

    const rolledBackState = tasksReducer(
      movedState,
      TasksActions.moveTaskFailure({
        taskId: task1Id,
        fromColumnId: columnTodoId,
        toColumnId: columnDoingId,
        error: serverMoveError,
      })
    );

    expect(rolledBackState.entities[task1Id]?.columnId).toBe(columnTodoId);
    expect(rolledBackState.error).toBe(serverMoveError);
  });
});
