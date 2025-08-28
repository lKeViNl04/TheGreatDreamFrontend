import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlyExpenseEdit } from './monthly-expense-edit';

describe('MonthlyExpenseEdit', () => {
  let component: MonthlyExpenseEdit;
  let fixture: ComponentFixture<MonthlyExpenseEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonthlyExpenseEdit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonthlyExpenseEdit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
