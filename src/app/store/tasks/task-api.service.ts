import { Injectable } from '@angular/core';
import { Observable, delay, of, throwError } from 'rxjs';

import { IColumn } from '../../models/column.model';
import { PriorityLevel } from '../../models/priority.level.enum';
import { ITask } from '../../models/task.model';

interface MockBoardData {
  columns: IColumn[];
  taskIds: string[];
}

interface MockDatabase {
  boards: Record<string, MockBoardData>;
  tasks: Record<string, ITask>;
}

const LATENCY_MS = 250;
const DEFAULT_BOARD_ID = 'board-1';

@Injectable({ providedIn: 'root' })
export class TaskApiService {
  private readonly database: MockDatabase = createMockDatabase();

  loadTasks(boardId: string): Observable<{ tasks: ITask[]; columns: IColumn[] }> {
    const board = this.database.boards[boardId];
    if (!board) {
      return throwError(() => new Error(`Board '${boardId}' was not found.`));
    }

    const tasks = board.taskIds
      .map((taskId) => this.database.tasks[taskId])
      .filter((task): task is ITask => Boolean(task))
      .map((task) => ({
        ...task,
        timestamp: { ...task.timestamp },
      }));

    const columns = [...board.columns]
      .sort((a, b) => a.order - b.order)
      .map((column) => ({ ...column }));

    return of({ tasks, columns }).pipe(delay(LATENCY_MS));
  }

  addTask(task: ITask): Observable<ITask> {
    this.database.tasks[task.id] = {
      ...task,
      timestamp: { ...task.timestamp },
    };

    const board = this.getBoardForColumn(task.columnId);
    if (!board.taskIds.includes(task.id)) {
      board.taskIds = [...board.taskIds, task.id];
    }

    return of({
      ...this.database.tasks[task.id],
      timestamp: { ...this.database.tasks[task.id].timestamp },
    }).pipe(delay(LATENCY_MS));
  }

  updateTask(
    taskId: string,
    changes: Partial<ITask>,
  ): Observable<{ taskId: string; changes: Partial<ITask> }> {
    const existingTask = this.database.tasks[taskId];
    if (!existingTask) {
      return throwError(() => new Error(`Task '${taskId}' was not found.`));
    }

    const updatedTimestamp = {
      ...existingTask.timestamp,
      ...(changes.timestamp ?? {}),
      updatedAt: new Date().toISOString(),
    };

    const updatedTask: ITask = {
      ...existingTask,
      ...changes,
      timestamp: updatedTimestamp,
    };

    this.database.tasks[taskId] = updatedTask;

    return of({
      taskId,
      changes: {
        ...changes,
        timestamp: updatedTimestamp,
      },
    }).pipe(delay(LATENCY_MS));
  }

  removeTask(taskId: string): Observable<{ taskId: string }> {
    if (!this.database.tasks[taskId]) {
      return throwError(() => new Error(`Task '${taskId}' was not found.`));
    }

    delete this.database.tasks[taskId];

    for (const board of Object.values(this.database.boards)) {
      board.taskIds = board.taskIds.filter((id) => id !== taskId);
    }

    return of({ taskId }).pipe(delay(LATENCY_MS));
  }

  moveTask(taskId: string, toColumnId: string): Observable<{ taskId: string; toColumnId: string }> {
    const existingTask = this.database.tasks[taskId];
    if (!existingTask) {
      return throwError(() => new Error(`Task '${taskId}' was not found.`));
    }

    if (toColumnId.toLowerCase().includes('fail')) {
      return throwError(
        () => new Error('Simulated moveTask server failure for rollback demo.'),
      ).pipe(delay(LATENCY_MS));
    }

    this.database.tasks[taskId] = {
      ...existingTask,
      columnId: toColumnId,
      timestamp: {
        ...existingTask.timestamp,
        updatedAt: new Date().toISOString(),
      },
    };

    return of({ taskId, toColumnId }).pipe(delay(LATENCY_MS));
  }

  private getBoardForColumn(columnId: string): MockBoardData {
    const board = Object.values(this.database.boards).find((board: MockBoardData) =>
      board.columns.some((column) => column.id === columnId),
    );

    return board ?? this.database.boards[DEFAULT_BOARD_ID];
  }
}

// Created with the help of ChatGPT based on the provided models and selectors, simulating a backend API with in-memory data and latency.
function createMockDatabase(): MockDatabase {
  const now = new Date().toISOString();
  const eightDaysAgo = new Date(Date.now() - 691200000).toISOString();

  const columns: IColumn[] = [
    { id: 'col-todo', name: 'Todo', order: 1 },
    { id: 'col-doing', name: 'Doing', order: 2 },
    { id: 'col-done', name: 'Done', order: 3 },
  ];

  const tasks: Record<string, ITask> = {
    'task-1': {
      id: 'task-1',
      columnId: 'col-todo',
      title: 'Set up task models',
      priorityLevel: PriorityLevel.HIGH,
      timestamp: { createdAt: now, updatedAt: now },
      assignee: 'Zaid',
    },
    'task-2': {
      id: 'task-2',
      columnId: 'col-doing',
      title: 'Implement NgRx actions',
      priorityLevel: PriorityLevel.CRITICAL,
      timestamp: { createdAt: now, updatedAt: now },
    },
    'task-3': {
      id: 'task-3',
      columnId: 'col-done',
      title: 'Draft README notes',
      priorityLevel: PriorityLevel.LOW,
      timestamp: { createdAt: eightDaysAgo, updatedAt: eightDaysAgo },
      description: 'Capture architecture and trade-offs.',
    },
    'task-4': {
      id: 'task-4',
      columnId: 'col-todo',
      title: 'Build selectors',
      priorityLevel: PriorityLevel.MEDIUM,
      timestamp: { createdAt: eightDaysAgo, updatedAt: eightDaysAgo },
    },
  };

  return {
    boards: {
      [DEFAULT_BOARD_ID]: {
        columns,
        taskIds: ['task-1', 'task-2', 'task-3', 'task-4'],
      },
    },
    tasks,
  };
}

