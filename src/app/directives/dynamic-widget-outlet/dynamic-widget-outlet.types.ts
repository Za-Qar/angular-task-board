import { Signal, Type } from '@angular/core';
import { Observable } from 'rxjs';

export type DynamicInputValue = unknown | Signal<unknown> | Observable<unknown>;

export type DynamicWidgetInputs = Record<string, DynamicInputValue>;

export type DynamicWidgetOutputs = Record<string, (payload: unknown) => void>;

export class DynamicWidgetConfig {
  constructor(
    public component: Type<unknown>,
    public inputs: DynamicWidgetInputs,
    public outputs: DynamicWidgetOutputs
  ) {}
}
