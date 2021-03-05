import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingpagetwoComponent } from './landingpagetwo.component';

describe('LandingpagetwoComponent', () => {
  let component: LandingpagetwoComponent;
  let fixture: ComponentFixture<LandingpagetwoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LandingpagetwoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LandingpagetwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
