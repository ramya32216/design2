import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingpageeightComponent } from './landingpageeight.component';

describe('LandingpageeightComponent', () => {
  let component: LandingpageeightComponent;
  let fixture: ComponentFixture<LandingpageeightComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LandingpageeightComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LandingpageeightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
