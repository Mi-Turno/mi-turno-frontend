import { HorarioProfesional } from './../../../core/interfaces/horarioProfesional';
import { Component, inject } from '@angular/core';
import { DiasEnum, DiasEnumOrdinal, obtenerDiaEnum } from '../../../shared/models/diasEnum';
import { HorarioXprofesionalService } from '../../../core/services/horariosProfesionalService/horarioProfesional.service';

@Component({
  selector: 'app-calendario-horario-profesional',
  standalone: true,
  imports: [],
  templateUrl: './calendario-horario-profesional.component.html',
  styleUrl: './calendario-horario-profesional.component.css'
})
export class CalendarioHorarioProfesionalComponent {

  horarioProfesionalService:HorarioXprofesionalService = inject(HorarioXprofesionalService);

  //necesito obtener los horarios del profesional que hace HOY
  hoy:number = 1;


  //esto me va a retornar una lista de horarios del profesional del dia que yo le pase
  obtenerHorariosProfesionalPorDia(nroDia:number){
    this.horarioProfesionalService.obtenerHorariosPorIdProfesionalYDia(1,2,nroDia).subscribe({
      next: (horarios) => {
        console.log(horarios);
      },
      error: (error) => {
        console.log(error);
      }
    });
  }



  //necesito obtener los horarios del profesional que hace EL DIA SIGUIENTE
  maniana:number = this.hoy + 1;
  diaEnumManiana:DiasEnum = obtenerDiaEnum(this.maniana);
  //necesito obtener los horarios del profesional que hace OTRO DIA




}
