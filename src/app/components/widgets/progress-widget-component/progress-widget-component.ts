import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

import { WidgetStatus } from '../../../models/widget.status.model';

@Component({
  selector: 'app-progress-widget',
  imports: [CommonModule],
  templateUrl: './progress-widget-component.html',
  styleUrl: './progress-widget-component.scss',
})
export class ProgressWidgetComponent {
  @Input() label = '';
  @Input() status: WidgetStatus = new WidgetStatus(0, 'neutral');

  @Output() detailsRequested = new EventEmitter<number>();

  get progressValue(): number {
    console.log('this.status?.value: ', this.status?.value);
    const rawValue = this.status?.value || 0;
    return Math.max(0, Math.min(100, rawValue));
  }

  requestDetails(): void {
    this.detailsRequested.emit(this.progressValue);
  }
}
