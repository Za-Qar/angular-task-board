import { CommonModule } from '@angular/common';
import { Component, OnInit, Signal, computed, signal } from '@angular/core';
import { Store } from '@ngrx/store';

import { ProgressWidgetComponent } from '../widgets/progress-widget-component/progress-widget-component';
import { TaskCountWidgetComponent } from '../widgets/task-count-widget-component/task-count-widget-component';
import { DynamicWidgetOutletDirective } from '../../directives/dynamic-widget-outlet/dynamic-widget-outlet.directive';
import { DynamicWidgetConfig } from '../../directives/dynamic-widget-outlet/dynamic-widget-outlet.types';
import { IColumn } from '../../models/column.model';
import { PriorityLevel } from '../../models/priority.level.enum';
import { ITask } from '../../models/task.model';
import { WidgetStatus, WidgetStatusType } from '../../models/widget.status.model';
import { TasksActions } from '../../store/tasks/tasks.actions';
import { tasksFeature } from '../../store/tasks/tasks.reducer';
import {
  selectAllTasks,
  selectCompletionRate,
  selectTaskCountByPriority,
} from '../../store/tasks/tasks.selectors';
import { MoveRequestedEvent, TaskCardComponent } from '../task-card-component/task-card-component';

interface ColumnWithTasks {
  column: IColumn;
  tasks: ITask[];
}

@Component({
  selector: 'app-task-board',
  imports: [CommonModule, TaskCardComponent, DynamicWidgetOutletDirective],
  templateUrl: './task-board-component.html',
  styleUrl: './task-board-component.scss',
})
export class TaskBoardComponent implements OnInit {
  readonly tasks: Signal<ITask[]>;
  readonly columns: Signal<IColumn[]>;
  readonly loading: Signal<boolean>;
  readonly error: Signal<string | null>;
  readonly completionRate: Signal<number>;
  readonly priorityCounts: Signal<Record<PriorityLevel, number>>;
  readonly selectedPriority = signal<PriorityLevel | null>(null);
  readonly completedOnly = signal(false);
  readonly widgetEventMessage = signal<string | null>(null);

  readonly finalColumnId = computed<string | null>(() => {
    const columns = this.columns();
    if (columns.length === 0) {
      return null;
    }

    return [...columns].sort((a, b) => b.order - a.order)[0].id;
  });

  readonly activeFilterLabel = computed<string>(() => {
    if (this.completedOnly()) {
      return 'Completed tasks only';
    }

    const priority = this.selectedPriority();
    return `${priority} priority`;
  });

  readonly completionWidgetStatus = computed<WidgetStatus>(() => {
    const completionValue = Math.round(this.completionRate());

    let status: WidgetStatusType = 'error';
    if (completionValue >= 100) {
      status = 'success';
    } else if (completionValue >= 50) {
      status = 'warning';
    }

    // Source of icon: https://www.flaticon.com/free-icon/check-list_1721929?term=status&page=1&position=4&origin=search&related_id=1721929
    return new WidgetStatus(
      completionValue,
      status,
      '/imgs/check-list.png',
      'Percentage of tasks currently in the final column.',
    );
  });

  readonly criticalPriorityStatus = computed<WidgetStatus>(() => {
    const criticalCount = this.priorityCounts()[PriorityLevel.CRITICAL] ?? 0;

    console.log('Critical priority count:', criticalCount);

    // Source of icon: https://www.flaticon.com/free-icon/warning_6939131?term=important&page=1&position=1&origin=search&related_id=6939131
    return new WidgetStatus(
      criticalCount,
      this.mapCountToStatus(criticalCount),
      '/imgs/important.png',
      'Current number of critical-priority tasks.',
    );
  });

  readonly widgetConfigs = computed<DynamicWidgetConfig[]>(() => [
    new DynamicWidgetConfig(
      ProgressWidgetComponent,
      {
        label: 'Completion',
        status: this.completionWidgetStatus,
      },
      {
        detailsRequested: (value) => this.onCompletionDetailsRequested(Number(value)),
      },
    ),
    new DynamicWidgetConfig(
      TaskCountWidgetComponent,
      {
        label: 'Critical Priority',
        status: this.criticalPriorityStatus,
      },
      {
        detailsRequested: (value) =>
          this.onPriorityDetailsRequested(PriorityLevel.CRITICAL, Number(value)),
      },
    ),
  ]);

  readonly columnsWithTasks = computed<ColumnWithTasks[]>(() => {
    const columns = this.columns();
    const selectedPriority = this.selectedPriority();
    const completedOnly = this.completedOnly();
    const finalColumnId = this.finalColumnId();
    const allTasks = this.tasks();
    let tasks = selectedPriority
      ? allTasks.filter((task) => task.priorityLevel === selectedPriority)
      : allTasks;

    if (completedOnly && finalColumnId) {
      tasks = tasks.filter((task) => task.columnId === finalColumnId);
    }

    return columns.map((column) => ({
      column,
      tasks: tasks.filter((task) => task.columnId === column.id),
    }));
  });

  constructor(private store: Store) {
    this.tasks = this.store.selectSignal(selectAllTasks);
    this.columns = this.store.selectSignal(tasksFeature.selectColumns);
    this.loading = this.store.selectSignal(tasksFeature.selectLoading);
    this.error = this.store.selectSignal(tasksFeature.selectError);
    this.completionRate = this.store.selectSignal(selectCompletionRate);
    this.priorityCounts = this.store.selectSignal(selectTaskCountByPriority);
  }

  ngOnInit(): void {
    this.store.dispatch(TasksActions.loadTasks({ boardId: 'board-1' }));
  }

  onMoveRequested(event: MoveRequestedEvent): void {
    this.store.dispatch(
      TasksActions.moveTask({
        taskId: event.taskId,
        fromColumnId: event.fromColumnId,
        toColumnId: event.toColumnId,
      }),
    );
  }

  trackByColumnId(_index: number, item: ColumnWithTasks): string {
    return item.column.id;
  }

  trackByTaskId(_index: number, task: ITask): string {
    return task.id;
  }

  clearPriorityFilter(): void {
    this.selectedPriority.set(null);
    this.completedOnly.set(false);
    this.widgetEventMessage.set('Filters cleared.');
  }

  private onPriorityDetailsRequested(priority: PriorityLevel, value: number): void {
    this.completedOnly.set(false);
    this.selectedPriority.set(priority);
    this.widgetEventMessage.set(`${priority} priority filter active: ${value}`);
  }

  private onCompletionDetailsRequested(value: number): void {
    this.selectedPriority.set(null);
    this.completedOnly.set(true);
    this.widgetEventMessage.set(`Completed-tasks filter active (${value}%).`);
  }

  private mapCountToStatus(value: number): WidgetStatusType {
    if (value === 0) {
      return 'success';
    }

    if (value <= 2) {
      return 'warning';
    }

    return 'error';
  }
}
