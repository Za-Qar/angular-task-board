import { createActionGroup, props } from '@ngrx/store';

import { IColumn } from '../../models/column.model';
import { ITask } from '../../models/task.model';

export const TasksActions = createActionGroup({
  source: 'Tasks',
  events: {
    'Load Tasks': props<{ boardId: string }>(),
    'Load Tasks Success': props<{
      boardId: string;
      tasks: ITask[];
      columns: IColumn[];
    }>(),
    'Load Tasks Failure': props<{ error: string }>(),

    'Add Task': props<{ task: ITask }>(),
    'Add Task Success': props<{ task: ITask }>(),
    'Add Task Failure': props<{ error: string }>(),

    'Move Task': props<{
      taskId: string;
      fromColumnId: string;
      toColumnId: string;
    }>(),
    'Move Task Success': props<{ taskId: string; toColumnId: string }>(),
    'Move Task Failure': props<{
      taskId: string;
      fromColumnId: string;
      toColumnId: string;
      error: string;
    }>(),

    'Update Task': props<{ taskId: string; changes: Partial<ITask> }>(),
    'Update Task Success': props<{ taskId: string; changes: Partial<ITask> }>(),
    'Update Task Failure': props<{ error: string }>(),

    'Remove Task': props<{ taskId: string }>(),
    'Remove Task Success': props<{ taskId: string }>(),
    'Remove Task Failure': props<{ error: string }>(),
  },
});
