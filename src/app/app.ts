import { Component } from '@angular/core';

import { TaskBoardComponent } from './components/task-board-component/task-board-component';

@Component({
  selector: 'app-root',
  imports: [TaskBoardComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {}
