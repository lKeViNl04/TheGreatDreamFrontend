import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashboxEdit } from './cashbox-edit';

describe('CashboxEdit', () => {
  let component: CashboxEdit;
  let fixture: ComponentFixture<CashboxEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CashboxEdit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CashboxEdit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
