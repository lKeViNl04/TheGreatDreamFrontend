import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotResultsFound } from './not-results-found';

describe('NotResultsFound', () => {
  let component: NotResultsFound;
  let fixture: ComponentFixture<NotResultsFound>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotResultsFound]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotResultsFound);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
