import { EntityAdapter, EntityState, createEntityAdapter } from '@ngrx/entity';

import { IColumn } from '../../models/column.model';
import { ITask } from '../../models/task.model';

export interface TasksState extends EntityState<ITask> {
  loading: boolean;
  error: string | null;
  activeBoardId: string | null;
  columns: IColumn[];
}

export const tasksAdapter: EntityAdapter<ITask> = createEntityAdapter<ITask>();

export const initialTasksState: TasksState = tasksAdapter.getInitialState({
  loading: false,
  error: null,
  activeBoardId: null,
  columns: [],
});
