import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingpagefiveComponent } from './landingpagefive.component';

describe('LandingpagefiveComponent', () => {
  let component: LandingpagefiveComponent;
  let fixture: ComponentFixture<LandingpagefiveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LandingpagefiveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LandingpagefiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
