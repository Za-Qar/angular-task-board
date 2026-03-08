import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, concatMap, map, of, switchMap } from 'rxjs';

import { TaskApiService } from './task-api.service';
import { TasksActions } from './tasks.actions';

@Injectable()
export class TasksEffects {
  readonly loadTasks$;
  readonly addTask$;
  readonly moveTask$;
  readonly updateTask$;
  readonly removeTask$;

  constructor(
    private readonly actions$: Actions,
    private readonly taskApi: TaskApiService
  ) {
    this.loadTasks$ = createEffect(() =>
      this.actions$.pipe(
        ofType(TasksActions.loadTasks),
        switchMap(({ boardId }) =>
          this.taskApi.loadTasks(boardId).pipe(
            map(({ tasks, columns }) =>
              TasksActions.loadTasksSuccess({ boardId, tasks, columns })
            ),
            catchError((error: unknown) =>
              of(TasksActions.loadTasksFailure({ error: getErrorMessage(error) }))
            )
          )
        )
      )
    );

    this.addTask$ = createEffect(() =>
      this.actions$.pipe(
        ofType(TasksActions.addTask),
        concatMap(({ task }) =>
          this.taskApi.addTask(task).pipe(
            map((savedTask) => TasksActions.addTaskSuccess({ task: savedTask })),
            catchError((error: unknown) =>
              of(TasksActions.addTaskFailure({ error: getErrorMessage(error) }))
            )
          )
        )
      )
    );

    this.moveTask$ = createEffect(() =>
      this.actions$.pipe(
        ofType(TasksActions.moveTask),
        concatMap(({ taskId, fromColumnId, toColumnId }) =>
          this.taskApi.moveTask(taskId, toColumnId).pipe(
            map(({ taskId: savedTaskId, toColumnId: savedToColumnId }) =>
              TasksActions.moveTaskSuccess({
                taskId: savedTaskId,
                toColumnId: savedToColumnId,
              })
            ),
            catchError((error: unknown) =>
              of(
                TasksActions.moveTaskFailure({
                  taskId,
                  fromColumnId,
                  toColumnId,
                  error: getErrorMessage(error),
                })
              )
            )
          )
        )
      )
    );

    this.updateTask$ = createEffect(() =>
      this.actions$.pipe(
        ofType(TasksActions.updateTask),
        concatMap(({ taskId, changes }) =>
          this.taskApi.updateTask(taskId, changes).pipe(
            map(({ taskId: savedTaskId, changes: savedChanges }) =>
              TasksActions.updateTaskSuccess({
                taskId: savedTaskId,
                changes: savedChanges,
              })
            ),
            catchError((error: unknown) =>
              of(TasksActions.updateTaskFailure({ error: getErrorMessage(error) }))
            )
          )
        )
      )
    );

    this.removeTask$ = createEffect(() =>
      this.actions$.pipe(
        ofType(TasksActions.removeTask),
        concatMap(({ taskId }) =>
          this.taskApi.removeTask(taskId).pipe(
            map(({ taskId: removedTaskId }) =>
              TasksActions.removeTaskSuccess({ taskId: removedTaskId })
            ),
            catchError((error: unknown) =>
              of(TasksActions.removeTaskFailure({ error: getErrorMessage(error) }))
            )
          )
        )
      )
    );
  }
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return 'Unexpected error.';
}
