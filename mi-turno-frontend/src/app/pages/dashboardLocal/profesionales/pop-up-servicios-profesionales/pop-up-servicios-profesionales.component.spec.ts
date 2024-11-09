import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopUpServiciosProfesionalesComponent } from './pop-up-servicios-profesionales.component';

describe('PopUpServiciosProfesionalesComponent', () => {
  let component: PopUpServiciosProfesionalesComponent;
  let fixture: ComponentFixture<PopUpServiciosProfesionalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopUpServiciosProfesionalesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopUpServiciosProfesionalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
