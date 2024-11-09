import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { DiasEnum, DiasEnumOrdinal, obtenerDiaEnumPorNumero} from '../../../shared/models/diasEnum';
import { HorarioXprofesionalService } from '../../../core/services/horariosProfesionalService/horarioProfesional.service';
import { HorarioProfesional } from '../../../core/interfaces/horarioProfesional.interface';
import { BotonComponent } from "../../../shared/components/boton/boton.component";

@Component({
  selector: 'app-calendario-horario-profesional',
  standalone: true,
  imports: [BotonComponent],
  templateUrl: './calendario-horario-profesional.component.html',
  styleUrl: './calendario-horario-profesional.component.css'
})
export class CalendarioHorarioProfesionalComponent implements OnInit {
  //servicios
  horarioProfesionalService:HorarioXprofesionalService = inject(HorarioXprofesionalService);

  //inputs y outputs
  @Input() idNegocio:number = 1;
  @Input() idProfesional:number = 1;
  @Output() emitirInformacion: EventEmitter<HorarioProfesional> = new EventEmitter<HorarioProfesional>();
  @Output() emitirDiaInicio: EventEmitter<Date> = new EventEmitter<Date>();
  //variables

  diaSeleccionado:number=0;

  //arreglos
  arregloHorarios:HorarioProfesional[] = [];

  //dias de la semana
  hoy:number = new Date().getDay();
  maniana:number = this.hoy + 1; //esto me tiene que dar el siguiente dia que tenga horarios no +1
  otroDia:number = this.hoy + 2; //todo el +5 representa otro dia cualquiera

  //funcionalidades boton horario
  obtenerIdHorario(event:number){
    const horarioProfesionalSeleccionado: HorarioProfesional = {
      idHorario: event,
      idProfesional: this.idProfesional,
      dia: obtenerDiaEnumPorNumero(this.diaSeleccionado),
      horaInicio: new Date(),
    }

      //esto me va a retornar el horario seleccionado
      this.emitirInformacion.emit(horarioProfesionalSeleccionado);

      //esto me va a retornar la fecha de inicio del turno
      this.emitirDiaInicio.emit(this.calcularFechaInicio())
  }

  calcularFechaInicio():Date{
    //esto me da el dia de hoy
    const fechaInicio = new Date();

    //esto me da el dia de hoy + el dia que yo le pase
    fechaInicio.setDate(fechaInicio.getDate() + (this.diaSeleccionado - this.hoy));
    return fechaInicio;

  }


  //esto me va a retornar una lista de horarios del profesional del dia que yo le pase
  obtenerHorariosProfesionalPorDia(nroDia:number){
    this.otroDiaActivo = false;
    this.horarioProfesionalService.obtenerHorariosPorIdProfesionalYDia(this.idNegocio,this.idProfesional,nroDia).subscribe({
      next: (horarios) => {
        this.diaSeleccionado = nroDia;
        this.arregloHorarios = horarios
        console.log("Nro dia: ",nroDia);
        console.log("Horarios: ",horarios);
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  //iniciamos con los horarios del profesional del dia de hoy
  ngOnInit(): void {
    this.obtenerHorariosProfesionalPorDia(this.hoy);
  }


  diaEnumManiana:DiasEnum = obtenerDiaEnumPorNumero(this.maniana);
  //diaEnumPasadoManiana:DiasEnum = obtenerDiaEnumPorNumero(this.pasadoManiana);


  //funcionalidad seleccion otro dia INPUT DATE
  otroDiaActivo:boolean = false;

  activarInputOtroDia(){
    this.otroDiaActivo = !this.otroDiaActivo;
  }


  //obtenemos el dia seleccionado por el input date y mostramos los horarios del profesional
  obtenerInputOtroDia(event:Event){
    const inputDate = (event.target as HTMLInputElement).value;
    const fechaInput = new Date(inputDate);

    this.obtenerHorariosProfesionalPorDia(fechaInput.getDay());
  }

  //calculamos la fecha minima para el input date para que no se pueda seleccionar un dia anterior al de hoy
  calcularFechaMinima():string{
    const fechaMinima = new Date();
    fechaMinima.setDate(fechaMinima.getDate() + 1);
    return fechaMinima.toISOString().split('T')[0];
  }

}
