import '@angular/compiler';

import { signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { describe, expect, it, vi } from 'vitest';

import { PriorityLevel } from '../../models/priority.level.enum';
import { ITask } from '../../models/task.model';
import { TasksActions } from '../../store/tasks/tasks.actions';
import { tasksFeature } from '../../store/tasks/tasks.reducer';
import {
  selectAllTasks,
  selectCompletionRate,
  selectTaskCountByPriority,
} from '../../store/tasks/tasks.selectors';
import { TaskBoardComponent } from './task-board-component';

const mockTasks: ITask[] = [
  {
    id: 'task-1',
    title: 'Task 1',
    columnId: 'col-todo',
    priorityLevel: PriorityLevel.HIGH,
    timestamp: {
      createdAt: new Date('2026-03-01T10:00:00.000Z').toISOString(),
      updatedAt: new Date('2026-03-01T10:00:00.000Z').toISOString(),
    },
  },
];

const mockColumns = [
  { id: 'col-todo', name: 'Todo', order: 1 },
  { id: 'col-doing', name: 'Doing', order: 2 },
  { id: 'col-done', name: 'Done', order: 3 },
];

function createStoreMock() {
  return {
    dispatch: vi.fn(),
    selectSignal: vi.fn((selector: unknown) => {
      if (selector === selectAllTasks) {
        return signal(mockTasks);
      }

      if (selector === tasksFeature.selectColumns) {
        return signal(mockColumns);
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
      fromColumnId: 'col-todo',
      toColumnId: 'col-doing',
    });

    expect(storeMock.dispatch).toHaveBeenCalledWith(
      TasksActions.moveTask({
        taskId: 'task-1',
        fromColumnId: 'col-todo',
        toColumnId: 'col-doing',
      })
    );
  });
});

