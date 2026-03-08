import '@angular/compiler';
import { describe, expect, it } from 'vitest';
import { TasksActions } from './tasks.actions';
import { tasksReducer } from './tasks.reducer';
import { TaskTestData } from '../../test/test.data';

describe('tasksReducer', () => {
  it('optimistically updates column on moveTask', () => {
    const movedState = tasksReducer(
      TaskTestData.state,
      TasksActions.moveTask({
        taskId: TaskTestData.task1Id,
        fromColumnId: TaskTestData.columnTodoId,
        toColumnId: TaskTestData.columnDoingId,
      }),
    );

    expect(movedState.entities[TaskTestData.task1Id]?.columnId).toBe(TaskTestData.columnDoingId);
  });

  it('rolls back column on moveTaskFailure', () => {
    const moveState = tasksReducer(
      TaskTestData.state,
      TasksActions.moveTask({
        taskId: TaskTestData.task1Id,
        fromColumnId: TaskTestData.columnTodoId,
        toColumnId: TaskTestData.columnDoingId,
      }),
    );

    const rolledBackState = tasksReducer(
      moveState,
      TasksActions.moveTaskFailure({
        taskId: TaskTestData.task1Id,
        fromColumnId: TaskTestData.columnTodoId,
        toColumnId: TaskTestData.columnDoingId,
        error: TaskTestData.serverMoveError,
      }),
    );

    expect(rolledBackState.entities[TaskTestData.task1Id]?.columnId).toBe(
      TaskTestData.columnTodoId,
    );
    expect(rolledBackState.error).toBe(TaskTestData.serverMoveError);
  });
});
