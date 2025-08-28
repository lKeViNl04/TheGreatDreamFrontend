import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlyFeeAdd } from './monthly-fee-add';

describe('MonthlyFeeAdd', () => {
  let component: MonthlyFeeAdd;
  let fixture: ComponentFixture<MonthlyFeeAdd>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonthlyFeeAdd]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonthlyFeeAdd);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
