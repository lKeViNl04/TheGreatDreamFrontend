import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlyExpenseDelete } from './monthly-expense-delete';

describe('MonthlyExpenseDelete', () => {
  let component: MonthlyExpenseDelete;
  let fixture: ComponentFixture<MonthlyExpenseDelete>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonthlyExpenseDelete]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonthlyExpenseDelete);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
