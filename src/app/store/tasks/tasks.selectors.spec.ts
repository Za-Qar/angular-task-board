import '@angular/compiler';

import { describe, expect, it } from 'vitest';

import { IColumn } from '../../models/column.model';
import { PriorityLevel } from '../../models/priority.level.enum';
import { ITask } from '../../models/task.model';
import { TasksActions } from './tasks.actions';
import { tasksReducer } from './tasks.reducer';
import {
  selectCompletionRate,
  selectTaskCountByPriority,
  selectTasksByColumnId,
} from './tasks.selectors';
import { initialTasksState } from './tasks.state';

const columns: IColumn[] = [
  { id: 'col-todo', name: 'Todo', order: 1 },
  { id: 'col-doing', name: 'Doing', order: 2 },
  { id: 'col-done', name: 'Done', order: 3 },
];

const now = new Date().toISOString();

const tasks: ITask[] = [
  {
    id: 'task-1',
    title: 'Task 1',
    columnId: 'col-todo',
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
  {
    id: 'task-3',
    title: 'Task 3',
    columnId: 'col-doing',
    priorityLevel: PriorityLevel.CRITICAL,
    timestamp: { createdAt: now, updatedAt: now },
  },
  {
    id: 'task-4',
    title: 'Task 4',
    columnId: 'col-doing',
    priorityLevel: PriorityLevel.MEDIUM,
    timestamp: { createdAt: now, updatedAt: now },
  },
];

function createRootState() {
  const tasksState = tasksReducer(
    initialTasksState,
    TasksActions.loadTasksSuccess({
      boardId: 'board-1',
      tasks,
      columns,
    })
  );

  return { tasks: tasksState };
}

describe('tasks selectors', () => {
  it('filters tasks by column id', () => {
    const state = createRootState();

    const columnTasks = selectTasksByColumnId('col-doing')(state);

    expect(columnTasks).toHaveLength(2);
    expect(columnTasks.every((task) => task.columnId === 'col-doing')).toBe(true);
  });

  it('returns grouped counts by priority', () => {
    const state = createRootState();

    const counts = selectTaskCountByPriority(state);

    expect(counts[PriorityLevel.LOW]).toBe(1);
    expect(counts[PriorityLevel.MEDIUM]).toBe(1);
    expect(counts[PriorityLevel.HIGH]).toBe(1);
    expect(counts[PriorityLevel.CRITICAL]).toBe(1);
  });

  it('calculates completion rate using final column', () => {
    const state = createRootState();

    const completionRate = selectCompletionRate(state);

    expect(completionRate).toBe(25);
  });
});
