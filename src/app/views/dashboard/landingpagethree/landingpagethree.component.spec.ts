import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingpagethreeComponent } from './landingpagethree.component';

describe('LandingpagethreeComponent', () => {
  let component: LandingpagethreeComponent;
  let fixture: ComponentFixture<LandingpagethreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LandingpagethreeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LandingpagethreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
