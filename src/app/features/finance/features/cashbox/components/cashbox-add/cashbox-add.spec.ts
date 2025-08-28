import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashboxAdd } from './cashbox-add';

describe('CashboxAdd', () => {
  let component: CashboxAdd;
  let fixture: ComponentFixture<CashboxAdd>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CashboxAdd]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CashboxAdd);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
