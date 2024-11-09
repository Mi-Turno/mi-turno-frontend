import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardClienteComponent } from './dashboard-cliente.component';

describe('DashboardClienteComponent', () => {
  let component: DashboardClienteComponent;
  let fixture: ComponentFixture<DashboardClienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardClienteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
