import { PriorityLevel } from './priority.level.enum';

interface ITimestamp {
  createdAt: Date;
  updatedAt: Date;
}

export interface ITask {
  id: string;
  columnId: string;
  title: string;
  priorityLevel: PriorityLevel;
  timestamp: ITimestamp;
  description?: string;
  assignee?: string;
}