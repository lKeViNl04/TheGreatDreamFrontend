import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlyFee } from './monthly-fee';

describe('MonthlyFee', () => {
  let component: MonthlyFee;
  let fixture: ComponentFixture<MonthlyFee>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonthlyFee]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonthlyFee);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
