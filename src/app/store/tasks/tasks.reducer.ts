import { createFeature, createReducer, on } from '@ngrx/store';

import { TasksActions } from './tasks.actions';
import { initialTasksState, tasksAdapter } from './tasks.state';

export const tasksReducer = createReducer(
  initialTasksState,
  on(TasksActions.loadTasks, (state, { boardId }) => ({
    ...state,
    loading: true,
    error: null,
    activeBoardId: boardId,
  })),
  on(TasksActions.loadTasksSuccess, (state, { boardId, tasks, columns }) =>
    tasksAdapter.setAll(tasks, {
      ...state,
      loading: false,
      error: null,
      activeBoardId: boardId,
      columns: [...columns].sort((a, b) => a.order - b.order),
    })
  ),
  on(TasksActions.loadTasksFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(TasksActions.addTask, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(TasksActions.addTaskSuccess, (state, { task }) =>
    tasksAdapter.addOne(task, {
      ...state,
      loading: false,
      error: null,
    })
  ),
  on(TasksActions.addTaskFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(TasksActions.moveTask, (state, { taskId, toColumnId }) =>
    tasksAdapter.updateOne(
      { id: taskId, changes: { columnId: toColumnId } },
      {
        ...state,
        loading: true,
        error: null,
      }
    )
  ),
  on(TasksActions.moveTaskSuccess, (state, { taskId, toColumnId }) =>
    tasksAdapter.updateOne(
      { id: taskId, changes: { columnId: toColumnId } },
      {
        ...state,
        loading: false,
        error: null,
      }
    )
  ),
  on(TasksActions.moveTaskFailure, (state, { taskId, fromColumnId, error }) =>
    tasksAdapter.updateOne(
      { id: taskId, changes: { columnId: fromColumnId } },
      {
        ...state,
        loading: false,
        error,
      }
    )
  ),

  on(TasksActions.updateTask, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(TasksActions.updateTaskSuccess, (state, { taskId, changes }) =>
    tasksAdapter.updateOne(
      { id: taskId, changes },
      {
        ...state,
        loading: false,
        error: null,
      }
    )
  ),
  on(TasksActions.updateTaskFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(TasksActions.removeTask, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(TasksActions.removeTaskSuccess, (state, { taskId }) =>
    tasksAdapter.removeOne(taskId, {
      ...state,
      loading: false,
      error: null,
    })
  ),
  on(TasksActions.removeTaskFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }))
);

export const tasksFeature = createFeature({
  name: 'tasks',
  reducer: tasksReducer,
});
