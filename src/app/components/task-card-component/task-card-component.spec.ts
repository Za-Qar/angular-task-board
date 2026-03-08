import '@angular/compiler';

import { describe, expect, it, vi } from 'vitest';

import { IColumn } from '../../models/column.model';
import { PriorityLevel } from '../../models/priority.level.enum';
import { ITask } from '../../models/task.model';
import { TaskCardComponent } from './task-card-component';

const columns: IColumn[] = [
  { id: 'col-todo', name: 'Todo', order: 1 },
  { id: 'col-doing', name: 'Doing', order: 2 },
  { id: 'col-done', name: 'Done', order: 3 },
];

function createTask(overrides: Partial<ITask> = {}): ITask {
  return {
    id: 'task-1',
    title: 'Implement task card',
    columnId: 'col-todo',
    priorityLevel: PriorityLevel.HIGH,
    timestamp: {
      createdAt: new Date('2026-03-01T10:00:00.000Z').toISOString(),
      updatedAt: new Date('2026-03-01T10:00:00.000Z').toISOString(),
    },
    ...overrides,
  };
}

function createComponent(): TaskCardComponent {
  const component = new TaskCardComponent();
  component.task = createTask();
  component.availableColumns = columns;
  component.ngOnInit();
  return component;
}

describe('TaskCardComponent', () => {
  it('computes priority class from task priority', () => {
    const component = createComponent();

    expect(component.priorityClass()).toBe('priority-high');
  });

  it('toggles local UI state signals', () => {
    const component = createComponent();

    expect(component.isExpanded()).toBe(false);
    expect(component.isEditing()).toBe(false);

    component.toggleExpanded();
    component.startEdit();

    expect(component.isExpanded()).toBe(true);
    expect(component.isEditing()).toBe(true);
  });

  it('emits moveRequested with expected payload', () => {
    const component = createComponent();
    const emitSpy = vi.spyOn(component.moveRequested, 'emit');

    component.startEdit();
    component.onColumnChange({ target: { value: 'col-doing' } } as unknown as Event);
    component.submitMove();

    expect(emitSpy).toHaveBeenCalledWith({
      taskId: 'task-1',
      fromColumnId: 'col-todo',
      toColumnId: 'col-doing',
    });
  });
});

