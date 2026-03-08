import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { TaskTestData } from './test/test.data';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render task board title', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector(TaskTestData.taskBoardTitleSelector)?.textContent).toContain(
      'Task Board',
    );
  });
});
