import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardAdminPageComponent } from './dashboard-admin-page.component';

describe('DashboardAdminPageComponent', () => {
  let component: DashboardAdminPageComponent;
  let fixture: ComponentFixture<DashboardAdminPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardAdminPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardAdminPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
