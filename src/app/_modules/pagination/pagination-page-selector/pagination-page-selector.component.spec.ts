import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginationPageSelectorComponent } from './pagination-page-selector.component';

describe('PaginationPageSelectorComponent', () => {
  let component: PaginationPageSelectorComponent;
  let fixture: ComponentFixture<PaginationPageSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaginationPageSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaginationPageSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
