import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginationDataComponent } from './pagination-data.component';

describe('PaginationDataComponent', () => {
  let component: PaginationDataComponent;
  let fixture: ComponentFixture<PaginationDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaginationDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaginationDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
