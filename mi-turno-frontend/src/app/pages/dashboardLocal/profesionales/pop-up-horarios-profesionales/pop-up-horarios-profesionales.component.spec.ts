import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopUpHorariosProfesionalesComponent } from './pop-up-horarios-profesionales.component';

describe('PopUpHorariosProfesionalesComponent', () => {
  let component: PopUpHorariosProfesionalesComponent;
  let fixture: ComponentFixture<PopUpHorariosProfesionalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopUpHorariosProfesionalesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopUpHorariosProfesionalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
