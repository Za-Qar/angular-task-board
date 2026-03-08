import { IColumn } from '../models/column.model';
import { PriorityLevel } from '../models/priority.level.enum';
import { ITask } from '../models/task.model';
import { TasksActions } from '../store/tasks/tasks.actions';
import { tasksReducer } from '../store/tasks/tasks.reducer';
import { initialTasksState } from '../store/tasks/tasks.state';

export class TaskTestData {
  // Selectors
  static readonly taskBoardTitleSelector = '#taskBoardTitle';

  static readonly task1Id = 'task-1';
  static readonly columnTodoId = 'col-todo';
  static readonly columnDoingId = 'col-doing';
  static readonly serverMoveError = 'Server move failed.';


  static readonly columns: IColumn[] = [
    { id: TaskTestData.columnTodoId, name: 'Todo', order: 1 },
    { id: TaskTestData.columnDoingId, name: 'Doing', order: 2 },
    { id: 'col-done', name: 'Done', order: 3 },
  ];

  static readonly now = new Date().toISOString();

  static readonly tasks: ITask[] = [
    {
      id: TaskTestData.task1Id,
      title: 'Task 1',
      columnId: TaskTestData.columnTodoId,
      priorityLevel: PriorityLevel.HIGH,
      timestamp: { createdAt: TaskTestData.now, updatedAt: TaskTestData.now },
    },
    {
      id: 'task-2',
      title: 'Task 2',
      columnId: 'col-done',
      priorityLevel: PriorityLevel.LOW,
      timestamp: { createdAt: TaskTestData.now, updatedAt: TaskTestData.now },
    },
    {
      id: 'task-3',
      title: 'Task 3',
      columnId: TaskTestData.columnDoingId,
      priorityLevel: PriorityLevel.CRITICAL,
      timestamp: { createdAt: TaskTestData.now, updatedAt: TaskTestData.now },
    },
    {
      id: 'task-4',
      title: 'Task 4',
      columnId: TaskTestData.columnDoingId,
      priorityLevel: PriorityLevel.MEDIUM,
      timestamp: { createdAt: TaskTestData.now, updatedAt: TaskTestData.now },
    },
  ];

  static readonly mockTask: ITask = {
    id: TaskTestData.task1Id,
    title: 'Task 1',
    columnId: TaskTestData.columnTodoId,
    priorityLevel: PriorityLevel.HIGH,
    timestamp: { createdAt: TaskTestData.now, updatedAt: TaskTestData.now },
  };

  static readonly state = TaskTestData.createLoadedState();

  static createTask(overrides: Partial<ITask> = {}): ITask {
  return {
    id: TaskTestData.task1Id,
    title: 'Implement task card',
    columnId: TaskTestData.columnTodoId,
    priorityLevel: PriorityLevel.HIGH,
    timestamp: {
      createdAt: new Date('2026-03-01T10:00:00.000Z').toISOString(),
      updatedAt: new Date('2026-03-01T10:00:00.000Z').toISOString(),
    },
    ...overrides,
  };
}

  private static createLoadedState() {
    return tasksReducer(
      initialTasksState,
      TasksActions.loadTasksSuccess({
        boardId: 'board-1',
        tasks: TaskTestData.tasks,
        columns: TaskTestData.columns,
      }),
    );
  }
}
