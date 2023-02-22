import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimesheetMonthViewComponent } from './timesheet-month-view.component';

describe('TimesheetMonthViewComponent', () => {
  let component: TimesheetMonthViewComponent;
  let fixture: ComponentFixture<TimesheetMonthViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimesheetMonthViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TimesheetMonthViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
