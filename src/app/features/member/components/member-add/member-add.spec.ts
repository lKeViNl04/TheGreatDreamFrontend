import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberAdd } from './member-add';

describe('MemberAdd', () => {
  let component: MemberAdd;
  let fixture: ComponentFixture<MemberAdd>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MemberAdd]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MemberAdd);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
