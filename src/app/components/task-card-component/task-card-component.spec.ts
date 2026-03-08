import '@angular/compiler';

import { describe, expect, it, vi } from 'vitest';

import { TaskCardComponent } from './task-card-component';
import { TaskTestData } from '../../test/test.data';

function createComponent(): TaskCardComponent {
  const component = new TaskCardComponent();
  component.task = TaskTestData.createTask();
  component.availableColumns = TaskTestData.columns;
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
    component.onColumnChange({ target: { value: TaskTestData.columnDoingId } } as unknown as Event);
    component.submitMove();

    expect(emitSpy).toHaveBeenCalledWith({
      taskId: 'task-1',
      fromColumnId: TaskTestData.columnTodoId,
      toColumnId: TaskTestData.columnDoingId,
    });
  });
});

