export type WidgetStatusType = 'success' | 'warning' | 'error' | 'neutral';

export class WidgetStatus {
  constructor(
    public value: number,
    public statusClassName: WidgetStatusType,
    public icon?: string,
    public tooltip?: string,
  ) {}
}
