import '@angular/compiler';

import { signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { describe, expect, it, vi } from 'vitest';

import { PriorityLevel } from '../../models/priority.level.enum';
import { TasksActions } from '../../store/tasks/tasks.actions';
import { tasksFeature } from '../../store/tasks/tasks.reducer';
import {
  selectAllTasks,
  selectCompletionRate,
  selectTaskCountByPriority,
} from '../../store/tasks/tasks.selectors';
import { TaskBoardComponent } from './task-board-component';
import { TaskTestData } from '../../test/test.data';

function createStoreMock() {
  return {
    dispatch: vi.fn(),
    selectSignal: vi.fn((selector: unknown) => {
      if (selector === selectAllTasks) {
        return signal(TaskTestData.tasks);
      }

      if (selector === tasksFeature.selectColumns) {
        return signal(TaskTestData.columns);
      }

      if (selector === tasksFeature.selectLoading) {
        return signal(false);
      }

      if (selector === tasksFeature.selectError) {
        return signal(null);
      }

      if (selector === selectCompletionRate) {
        return signal(25);
      }

      if (selector === selectTaskCountByPriority) {
        return signal({
          [PriorityLevel.LOW]: 0,
          [PriorityLevel.MEDIUM]: 0,
          [PriorityLevel.HIGH]: 1,
          [PriorityLevel.CRITICAL]: 0,
        });
      }

      return signal(undefined);
    }),
  };
}

describe('TaskBoardComponent', () => {
  it('dispatches loadTasks on init', () => {
    const storeMock = createStoreMock();
    const component = new TaskBoardComponent(storeMock as unknown as Store);

    component.ngOnInit();

    expect(storeMock.dispatch).toHaveBeenCalledWith(
      TasksActions.loadTasks({ boardId: 'board-1' })
    );
  });

  it('dispatches moveTask when card requests a move', () => {
    const storeMock = createStoreMock();
    const component = new TaskBoardComponent(storeMock as unknown as Store);

    component.onMoveRequested({
      taskId: 'task-1',
      fromColumnId: TaskTestData.columnTodoId,
      toColumnId: TaskTestData.columnDoingId,
    });

    expect(storeMock.dispatch).toHaveBeenCalledWith(
      TasksActions.moveTask({
        taskId: 'task-1',
        fromColumnId: TaskTestData.columnTodoId,
        toColumnId: TaskTestData.columnDoingId,
      })
    );
  });
});

