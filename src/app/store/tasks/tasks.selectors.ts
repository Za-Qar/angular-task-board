import { createSelector } from '@ngrx/store';

import { PriorityLevel } from '../../models/priority.level.enum';
import { tasksFeature } from './tasks.reducer';
import { tasksAdapter } from './tasks.state';

const adapterSelectors = tasksAdapter.getSelectors(tasksFeature.selectTasksState);

export const selectAllTasks = adapterSelectors.selectAll;
export const selectTaskEntities = adapterSelectors.selectEntities;
export const selectTaskIds = adapterSelectors.selectIds;
export const selectTaskTotal = adapterSelectors.selectTotal;

export const selectTasksByColumnId = (columnId: string) =>
  createSelector(selectAllTasks, (tasks) =>
    tasks.filter((task) => task.columnId === columnId)
  );

export const selectTaskCountByPriority = createSelector(selectAllTasks, (tasks) => {
  const counts: Record<PriorityLevel, number> = {
    [PriorityLevel.LOW]: 0,
    [PriorityLevel.MEDIUM]: 0,
    [PriorityLevel.HIGH]: 0,
    [PriorityLevel.CRITICAL]: 0,
  };

  for (const task of tasks) {
    counts[task.priorityLevel] += 1;
  }

  return counts;
});

export const selectFinalColumnId = createSelector(tasksFeature.selectColumns, (columns) => {
  if (!columns.length) {
    return null;
  }

  const finalColumn = columns.reduce((currentFinal, column) =>
    column.order > currentFinal.order ? column : currentFinal
  );

  return finalColumn.id;
});

export const selectCompletionRate = createSelector(
  selectAllTasks,
  selectFinalColumnId,
  (tasks, finalColumnId) => {
    if (!tasks.length || !finalColumnId) {
      return 0;
    }

    const completedTaskCount = tasks.filter(
      (task) => task.columnId === finalColumnId
    ).length;

    return (completedTaskCount / tasks.length) * 100;
  }
);
