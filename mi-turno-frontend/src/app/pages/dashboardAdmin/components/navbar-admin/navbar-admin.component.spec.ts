import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarAdminComponent } from './navbar-admin.component';

describe('NavbarAdminComponent', () => {
  let component: NavbarAdminComponent;
  let fixture: ComponentFixture<NavbarAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavbarAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
