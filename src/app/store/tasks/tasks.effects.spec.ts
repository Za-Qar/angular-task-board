import '@angular/compiler';

import { Action } from '@ngrx/store';
import { Actions } from '@ngrx/effects';
import { ReplaySubject, firstValueFrom, of, throwError } from 'rxjs';
import { describe, expect, it, vi } from 'vitest';
import { TaskApiService } from './task-api.service';
import { TasksActions } from './tasks.actions';
import { TasksEffects } from './tasks.effects';

describe('TasksEffects', () => {
  it('emits moveTaskFailure when moveTask API fails', async () => {
    const actions$ = new ReplaySubject<Action>(1);

    const taskApiSpy = new TaskApiService();
    vi.spyOn(taskApiSpy, 'moveTask').mockReturnValue(
      throwError(() => new Error('Move request failed.')),
    );
    const effects = new TasksEffects(new Actions(actions$), taskApiSpy);

    const resultPromise = firstValueFrom(effects.moveTask$);

    actions$.next(
      TasksActions.moveTask({
        taskId: 'task-1',
        fromColumnId: 'col-todo',
        toColumnId: 'col-doing',
      })
    );

    const result = await resultPromise;

    expect(result).toEqual(
      TasksActions.moveTaskFailure({
        taskId: 'task-1',
        fromColumnId: 'col-todo',
        toColumnId: 'col-doing',
        error: 'Move request failed.',
      })
    );
  });
});
