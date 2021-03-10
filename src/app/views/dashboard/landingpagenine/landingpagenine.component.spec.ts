import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingpagenineComponent } from './landingpagenine.component';

describe('LandingpagenineComponent', () => {
  let component: LandingpagenineComponent;
  let fixture: ComponentFixture<LandingpagenineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LandingpagenineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LandingpagenineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
