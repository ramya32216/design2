import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingpagesevenComponent } from './landingpageseven.component';

describe('LandingpagesevenComponent', () => {
  let component: LandingpagesevenComponent;
  let fixture: ComponentFixture<LandingpagesevenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LandingpagesevenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LandingpagesevenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
