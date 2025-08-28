import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashboxDelete } from './cashbox-delete';

describe('CashboxDelete', () => {
  let component: CashboxDelete;
  let fixture: ComponentFixture<CashboxDelete>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CashboxDelete]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CashboxDelete);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
