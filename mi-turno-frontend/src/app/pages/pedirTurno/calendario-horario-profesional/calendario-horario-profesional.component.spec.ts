import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarioHorarioProfesionalComponent } from './calendario-horario-profesional.component';

describe('CalendarioHorarioProfesionalComponent', () => {
  let component: CalendarioHorarioProfesionalComponent;
  let fixture: ComponentFixture<CalendarioHorarioProfesionalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarioHorarioProfesionalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalendarioHorarioProfesionalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
