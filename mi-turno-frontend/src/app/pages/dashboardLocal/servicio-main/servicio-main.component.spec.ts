import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicioMainComponent } from './servicio-main.component';

describe('ServicioMainComponent', () => {
  let component: ServicioMainComponent;
  let fixture: ComponentFixture<ServicioMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServicioMainComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServicioMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
