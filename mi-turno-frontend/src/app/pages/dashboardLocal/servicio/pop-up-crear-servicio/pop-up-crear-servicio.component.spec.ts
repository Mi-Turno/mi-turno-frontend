import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopUpCrearServicioComponent } from './pop-up-crear-servicio.component';

describe('PopUpCrearServicioComponent', () => {
  let component: PopUpCrearServicioComponent;
  let fixture: ComponentFixture<PopUpCrearServicioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopUpCrearServicioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopUpCrearServicioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
