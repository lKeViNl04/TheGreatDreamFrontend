import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlyExpenseAdd } from './monthly-expense-add';

describe('MonthlyExpenseAdd', () => {
  let component: MonthlyExpenseAdd;
  let fixture: ComponentFixture<MonthlyExpenseAdd>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonthlyExpenseAdd]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonthlyExpenseAdd);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
