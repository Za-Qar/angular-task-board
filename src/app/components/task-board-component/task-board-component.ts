import { CommonModule } from '@angular/common';
import { Component, OnInit, computed } from '@angular/core';
import { Store } from '@ngrx/store';

import { IColumn } from '../../models/column.model';
import { ITask } from '../../models/task.model';
import { TasksActions } from '../../store/tasks/tasks.actions';
import { tasksFeature } from '../../store/tasks/tasks.reducer';
import {
  selectAllTasks,
  selectCompletionRate,
  selectTaskCountByPriority,
} from '../../store/tasks/tasks.selectors';
import {
  MoveRequestedEvent,
  TaskCardComponent,
} from '../task-card-component/task-card-component';

interface ColumnWithTasks {
  column: IColumn;
  tasks: ITask[];
}

@Component({
  selector: 'app-task-board',
  imports: [CommonModule, TaskCardComponent],
  templateUrl: './task-board-component.html',
  styleUrl: './task-board-component.scss',
})
export class TaskBoardComponent implements OnInit {
  readonly tasks;
  readonly columns;
  readonly loading;
  readonly error;
  readonly completionRate;
  readonly priorityCounts;

  readonly columnsWithTasks = computed<ColumnWithTasks[]>(() => {
    const columns = this.columns();
    const tasks = this.tasks();

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
      })
    );
  }

  trackByColumnId(_index: number, item: ColumnWithTasks): string {
    return item.column.id;
  }

  trackByTaskId(_index: number, task: ITask): string {
    return task.id;
  }
}
