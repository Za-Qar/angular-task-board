import {
  ComponentRef,
  ViewContainerRef,
  Directive,
  EnvironmentInjector,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  effect,
  inject,
  isSignal,
} from '@angular/core';
import { isObservable } from 'rxjs';

import {
  DynamicInputValue,
  DynamicWidgetConfig,
  DynamicWidgetInputs,
  DynamicWidgetOutputs,
} from './dynamic-widget-outlet.types';

interface RenderedWidget {
  componentRef: ComponentRef<unknown>;
  cleanups: Array<() => void>;
}

@Directive({
  selector: '[appDynamicWidgetOutlet]',
})
export class DynamicWidgetOutletDirective implements OnChanges, OnDestroy {
  @Input() widgetConfigs: DynamicWidgetConfig[] = [];

  private readonly viewContainerRef = inject(ViewContainerRef);
  private readonly environmentInjector = inject(EnvironmentInjector);

  private renderedWidgets: RenderedWidget[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['widgetConfigs']) {
      this.renderWidgets();
    }
  }

  ngOnDestroy(): void {
    this.destroyWidgets();
  }

  private renderWidgets(): void {
    this.destroyWidgets();

    if (this.widgetConfigs.length === 0) {
      return;
    }

    this.widgetConfigs.forEach((widgetConfig) => {
      const componentRef = this.viewContainerRef.createComponent(widgetConfig.component, {
        environmentInjector: this.environmentInjector,
      });

      const cleanups = [
        ...this.bindInputs(componentRef, widgetConfig.inputs),
        ...this.bindOutputs(componentRef, widgetConfig.outputs),
      ];

      this.renderedWidgets.push({
        componentRef,
        cleanups,
      });
    });
  }

  private bindInputs(
    componentRef: ComponentRef<unknown>,
    inputs: DynamicWidgetInputs
  ): Array<() => void> {
    return Object.entries(inputs).flatMap(([inputKey, inputSource]) =>
      this.bindInput(componentRef, inputKey, inputSource as DynamicInputValue)
    );
  }

  private bindInput(
    componentRef: ComponentRef<unknown>,
    inputKey: string,
    inputSource: DynamicInputValue
  ): Array<() => void> {
    if (isSignal(inputSource)) {
      const signalEffect = effect(
        () => {
          componentRef.setInput(inputKey, inputSource());
        },
        { injector: this.environmentInjector }
      );

      return [() => signalEffect.destroy()];
    }

    // AI assistance
    if (isObservable(inputSource)) {
      const inputSubscription = inputSource.subscribe((value) => {
        componentRef.setInput(inputKey, value);
      });

      return [() => inputSubscription.unsubscribe()];
    }

    componentRef.setInput(inputKey, inputSource);
    return [];
  }

  // AI assistance. Helped me implement this method, which is why it's more complex than the input binding logic
  private bindOutputs(
    componentRef: ComponentRef<unknown>,
    outputs: DynamicWidgetOutputs | undefined
  ): Array<() => void> {
    if (!outputs) {
      return [];
    }

    return Object.entries(outputs).flatMap(([outputKey, outputHandler]) => {
      const output = (componentRef.instance as Record<string, EventEmitter<unknown>>)[outputKey];

      const outputSubscription = output.subscribe((payload: unknown) => {
        (outputHandler as (eventPayload: unknown) => void)(payload);
      });

      return [() => outputSubscription.unsubscribe()];
    });
  }

  private destroyWidgets(): void {
    this.renderedWidgets.forEach((widget) => {
      widget.cleanups.forEach((cleanup) => cleanup());
      widget.componentRef.destroy();
    });

    this.renderedWidgets = [];
    this.viewContainerRef.clear();
  }
}
