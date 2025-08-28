import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderDropdown } from './header-dropdown';

describe('HeaderDropdown', () => {
  let component: HeaderDropdown;
  let fixture: ComponentFixture<HeaderDropdown>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderDropdown]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderDropdown);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
