import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminStoreFilterComponent } from './admin-store-filter.component';

describe('AdminStoreFilterComponent', () => {
  let component: AdminStoreFilterComponent;
  let fixture: ComponentFixture<AdminStoreFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminStoreFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminStoreFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
