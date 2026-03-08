import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideState, provideStore } from '@ngrx/store';

import { routes } from './app.routes';
import { TasksEffects } from './store/tasks/tasks.effects';
import { tasksFeature } from './store/tasks/tasks.reducer';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideStore(),
    provideState(tasksFeature),
    provideEffects(TasksEffects),
  ],
};
