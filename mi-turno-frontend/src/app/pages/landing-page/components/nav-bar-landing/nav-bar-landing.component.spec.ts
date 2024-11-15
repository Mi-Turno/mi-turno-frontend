import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavBarLandingComponent } from './nav-bar-landing.component';

describe('NavBarLandingComponent', () => {
  let component: NavBarLandingComponent;
  let fixture: ComponentFixture<NavBarLandingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavBarLandingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavBarLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
