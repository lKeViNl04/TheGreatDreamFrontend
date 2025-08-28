import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccordionTable } from './accordion-table';

describe('AccordionTable', () => {
  let component: AccordionTable;
  let fixture: ComponentFixture<AccordionTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccordionTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccordionTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
