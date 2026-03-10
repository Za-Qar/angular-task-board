import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

import { WidgetStatus } from '../../../models/widget.status.model';

@Component({
  selector: 'app-task-count-widget',
  imports: [CommonModule],
  templateUrl: './task-count-widget-component.html',
  styleUrl: './task-count-widget-component.scss',
})
export class TaskCountWidgetComponent {
  @Input() label = '';
  @Input() status: WidgetStatus = new WidgetStatus(0, 'neutral');

  @Output() detailsRequested = new EventEmitter<number>();

  requestDetails(): void {
    this.detailsRequested.emit(this.status.value);
  }
}
