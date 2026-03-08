import '@angular/compiler';

import { describe, expect, it } from 'vitest';

import { PriorityLevel } from '../../models/priority.level.enum';
import { TasksActions } from './tasks.actions';
import { tasksReducer } from './tasks.reducer';
import {
  selectCompletionRate,
  selectTaskCountByPriority,
  selectTasksByColumnId,
} from './tasks.selectors';
import { initialTasksState } from './tasks.state';
import { TaskTestData } from '../../test/test.data';

function createRootState() {
  const tasksState = tasksReducer(
    initialTasksState,
    TasksActions.loadTasksSuccess({
      boardId: 'board-1',
      tasks: TaskTestData.tasks,
      columns: TaskTestData.columns,
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
