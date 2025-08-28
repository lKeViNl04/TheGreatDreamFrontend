import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlyFeeDelete } from './monthly-fee-delete';

describe('MonthlyFeeDelete', () => {
  let component: MonthlyFeeDelete;
  let fixture: ComponentFixture<MonthlyFeeDelete>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonthlyFeeDelete]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonthlyFeeDelete);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
