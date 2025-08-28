import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityLayout } from './entity-layout';

describe('EntityLayout', () => {
  let component: EntityLayout;
  let fixture: ComponentFixture<EntityLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntityLayout]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EntityLayout);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
