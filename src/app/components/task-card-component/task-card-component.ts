import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  computed,
  signal,
} from '@angular/core';

import { IColumn } from '../../models/column.model';
import { ITask } from '../../models/task.model';

export interface MoveRequestedEvent {
  taskId: string;
  fromColumnId: string;
  toColumnId: string;
}

@Component({
  selector: 'app-task-card',
  imports: [CommonModule],
  templateUrl: './task-card-component.html',
  styleUrl: './task-card-component.scss',
})
export class TaskCardComponent implements OnInit, OnChanges {
  @Input() task!: ITask;
  @Input() availableColumns: IColumn[] = [];
  @Output() moveRequested = new EventEmitter<MoveRequestedEvent>();

  private readonly taskState = signal<ITask | null>(null);

  readonly isExpanded = signal(false);
  readonly isEditing = signal(false);
  readonly selectedColumnId = signal('');

  readonly currentTask = computed(() => this.taskState());
  readonly priorityClass = computed(() => {
    const task = this.taskState();
    return task ? `priority-${task.priorityLevel.toLowerCase()}` : 'priority-unknown';
  });

  readonly formattedCreatedAt = computed(() => {
    const task = this.taskState();
    return task ? this.formatTimestamp(task.timestamp.createdAt) : '-';
  });

  readonly formattedUpdatedAt = computed(() => {
    const task = this.taskState();
    return task ? this.formatTimestamp(task.timestamp.updatedAt) : '-';
  });

  readonly isOverdue = computed(() => this.isTaskOverdue(this.taskState()));

  ngOnInit(): void {
    this.syncTaskState(this.task);
  }

  ngOnChanges(changes: SimpleChanges): void {
    const taskChange = changes['task'];
    if (taskChange?.currentValue) {
      this.syncTaskState(taskChange.currentValue as ITask);
    }
  }

  toggleExpanded(): void {
    this.isExpanded.update((value) => !value);
  }

  startEdit(): void {
    const task = this.taskState();
    if (!task) {
      return;
    }

    this.selectedColumnId.set(task.columnId);
    this.isEditing.set(true);
  }

  cancelEdit(): void {
    const task = this.taskState();
    this.isEditing.set(false);
    this.selectedColumnId.set(task?.columnId ?? '');
  }

  onColumnChange(event: Event): void {
    const target = event.target as HTMLSelectElement | null;
    if (!target) {
      return;
    }

    this.selectedColumnId.set(target.value);
  }

  submitMove(): void {
    const task = this.taskState();
    if (!task) {
      return;
    }

    const fromColumnId = task.columnId;
    const toColumnId = this.selectedColumnId() || fromColumnId;

    if (fromColumnId === toColumnId) {
      this.isEditing.set(false);
      return;
    }

    this.moveRequested.emit({
      taskId: task.id,
      fromColumnId,
      toColumnId,
    });
    this.isEditing.set(false);
  }

  private syncTaskState(task: ITask): void {
    this.taskState.set(task);
    if (!this.isEditing()) {
      this.selectedColumnId.set(task.columnId);
    }
  }

  // AI assistance
  private isTaskOverdue(task: ITask | null): boolean {
    if (!task) {
      return false;
    }

    if (this.isTaskInDoneColumn(task)) {
      return false;
    }

    const updatedAt = new Date(task.timestamp.updatedAt).getTime();
    if (Number.isNaN(updatedAt)) {
      return false;
    }

    const oneWeekInMs = 604800000;
    return Date.now() - updatedAt > oneWeekInMs;
  }

  private isTaskInDoneColumn(task: ITask): boolean {
    const doneColumn = this.availableColumns.find(
      (column) => column.name.trim().toLowerCase() === 'done'
    );

    return doneColumn ? task.columnId === doneColumn.id : false;
  }

  private formatTimestamp(value: string): string {
    const date = new Date(value);

    return date.toLocaleString();
  }
}
