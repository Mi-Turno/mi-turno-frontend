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
  @Input() idDelProfesional:number = 0;
  @Output() emitirInformacion: EventEmitter<HorarioProfesional> = new EventEmitter<HorarioProfesional>();
  @Output() emitirDiaInicio: EventEmitter<Date> = new EventEmitter<Date>();

  

  //variables
  fechaInicio:Date = new Date();

  //arreglos
  arregloHorarios:HorarioProfesional[] = [];

  //dias de la semana
  hoy:number = new Date().getDay();
  diaDeLaSemanaSeleccionado:number=0;

  //funcionalidades boton horario para el OUTPUT
  obtenerIdHorario(event:number){
    //esto me va a retornar el horario seleccionado
    const horarioProfesionalSeleccionado = this.arregloHorarios.find(unHorario => unHorario.idHorario === event);

    if(horarioProfesionalSeleccionado !== undefined){
      this.emitirInformacion.emit(horarioProfesionalSeleccionado);
    }


    //calculo la fecha de inicio del turno ESTO VA A SERVIR PARA EL OUTPUT
    this.calcularFechaInicio();
    //esto me va a retornar la fecha de inicio del turno
    this.emitirDiaInicio.emit(this.fechaInicio);
  }

  calcularFechaInicio(){
    //primero obtengo la diferencia de dias que hay entre el dia seleccionado y el dia de hoy. Es entre 0 y 6 porque son dias de la semana
    const diasASumar = this.diaDeLaSemanaSeleccionado - this.hoy;

    //setteo la fecha de inicio
    this.fechaInicio.setDate(this.fechaInicio.getDate() + diasASumar);
  }



  manejarDiaSeleccionado(event:number){
    //esto sirve para HOY y para EL DIA SIGUIENTE
    //saco el input otro dia
    if(this.otroDiaActivo === true){
      this.otroDiaActivo = false;
    }

    this.obtenerHorariosProfesionalPorDia(event);
  }

  obtenerHorariosProfesionalPorDia(nroDia:number){
    //obtengo el dia de la semana seleccionado
    this.diaDeLaSemanaSeleccionado = nroDia;

    this.horarioProfesionalService.obtenerHorariosPorIdProfesionalYDia(this.idNegocio,this.idDelProfesional,nroDia).subscribe({

      next: (horarios) => {
        this.arregloHorarios = horarios
        console.log("Nro dia: ",nroDia);
        console.log("Horarios: ",horarios);
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  //iniciamos con los horarios del profesional del dia de hoy
  ngOnInit(): void {
    this.obtenerHorariosProfesionalPorDia(this.hoy);

  }

  obtenerDiaEnumPorNumero(nroDia:number):DiasEnum{
    return obtenerDiaEnumPorNumero(nroDia)
  }




  //funcionalidad seleccion otro dia INPUT DATE
  otroDiaActivo:boolean = false;

  activarInputOtroDia(){

    if(this.otroDiaActivo === false){
      this.arregloHorarios=[];
      this.otroDiaActivo = true;
    }

  }



  //obtenemos el dia seleccionado por el input date y mostramos los horarios del profesional
  obtenerInputOtroDia(event:Event){
    const inputDate = (event.target as HTMLInputElement).value;

    console.log("Fecha input: ",inputDate);

    //aca ya obtengo la fecha de inicio
    this.fechaInicio = new Date(`${inputDate}T00:00:00`);

    console.log("Fecha input: ",this.fechaInicio.getDay());
    console.log("Fecha input: ",this.fechaInicio);

    this.obtenerHorariosProfesionalPorDia(this.fechaInicio.getDay());
  }

  //calculamos la fecha minima para el input date para que no se pueda seleccionar un dia anterior al de 2 dias despues de la fecha actual
  calcularFechaMinima():string{
    const fechaMinima = new Date();
    fechaMinima.setDate(fechaMinima.getDate() + 2);
    return fechaMinima.toISOString().split('T')[0];
  }

}
