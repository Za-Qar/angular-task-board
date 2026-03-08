import { IColumn } from '../models/column.model';
import { PriorityLevel } from '../models/priority.level.enum';
import { ITask } from '../models/task.model';
import { TasksActions } from '../store/tasks/tasks.actions';
import { tasksReducer } from '../store/tasks/tasks.reducer';
import { initialTasksState } from '../store/tasks/tasks.state';

export class TaskTestData {
  static readonly task1Id = 'task-1';
  static readonly columnTodoId = 'col-todo';
  static readonly columnDoingId = 'col-doing';
  static readonly serverMoveError = 'Server move failed.';
  static readonly state = this.createLoadedState();

  static readonly columns: IColumn[] = [
    { id: this.columnTodoId, name: 'Todo', order: 1 },
    { id: this.columnDoingId, name: 'Doing', order: 2 },
    { id: 'col-done', name: 'Done', order: 3 },
  ];

  static readonly now = new Date().toISOString();

  static readonly tasks: ITask[] = [
    {
      id: this.task1Id,
      title: 'Task 1',
      columnId: this.columnTodoId,
      priorityLevel: PriorityLevel.HIGH,
      timestamp: { createdAt: this.now, updatedAt: this.now },
    },
    {
      id: 'task-2',
      title: 'Task 2',
      columnId: 'col-done',
      priorityLevel: PriorityLevel.LOW,
      timestamp: { createdAt: this.now, updatedAt: this.now },
    },
    {
      id: 'task-3',
      title: 'Task 3',
      columnId: this.columnDoingId,
      priorityLevel: PriorityLevel.CRITICAL,
      timestamp: { createdAt: this.now, updatedAt: this.now },
    },
    {
      id: 'task-4',
      title: 'Task 4',
      columnId: this.columnDoingId,
      priorityLevel: PriorityLevel.MEDIUM,
      timestamp: { createdAt: this.now, updatedAt: this.now },
    },
  ];

  static readonly mockTask: ITask = {
    id: this.task1Id,
    title: 'Task 1',
    columnId: this.columnTodoId,
    priorityLevel: PriorityLevel.HIGH,
    timestamp: { createdAt: this.now, updatedAt: this.now },
  };

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
