import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlyFeeEdit } from './monthly-fee-edit';

describe('MonthlyFeeEdit', () => {
  let component: MonthlyFeeEdit;
  let fixture: ComponentFixture<MonthlyFeeEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonthlyFeeEdit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonthlyFeeEdit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
