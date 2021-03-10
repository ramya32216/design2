import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingpagesixComponent } from './landingpagesix.component';

describe('LandingpagesixComponent', () => {
  let component: LandingpagesixComponent;
  let fixture: ComponentFixture<LandingpagesixComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LandingpagesixComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LandingpagesixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
