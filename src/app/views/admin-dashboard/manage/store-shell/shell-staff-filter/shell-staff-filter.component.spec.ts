import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShellStaffFilterComponent } from './shell-staff-filter.component';

describe('ShellStaffFilterComponent', () => {
  let component: ShellStaffFilterComponent;
  let fixture: ComponentFixture<ShellStaffFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShellStaffFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShellStaffFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
