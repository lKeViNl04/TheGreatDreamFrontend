import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinanceLayaout } from './finance-layaout/finance-layaout';

describe('FinanceLayaout', () => {
  let component: FinanceLayaout;
  let fixture: ComponentFixture<FinanceLayaout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinanceLayaout]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinanceLayaout);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
