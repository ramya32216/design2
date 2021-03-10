import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingpagetenComponent } from './landingpageten.component';

describe('LandingpagetenComponent', () => {
  let component: LandingpagetenComponent;
  let fixture: ComponentFixture<LandingpagetenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LandingpagetenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LandingpagetenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
