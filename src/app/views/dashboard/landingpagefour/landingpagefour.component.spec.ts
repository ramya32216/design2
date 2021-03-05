import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingpagefourComponent } from './landingpagefour.component';

describe('LandingpagefourComponent', () => {
  let component: LandingpagefourComponent;
  let fixture: ComponentFixture<LandingpagefourComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LandingpagefourComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LandingpagefourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
