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

  diaSeleccionado:number=0;

  //arreglos
  arregloHorarios:HorarioProfesional[] = [];

  //dias de la semana
  hoy:number = new Date().getDay();
  maniana:number = this.hoy + 1; //esto me tiene que dar el siguiente dia que tenga horarios no +1
  otroDia:number = 0;

  //funcionalidades boton horario
  obtenerIdHorario(event:number){
    const horarioProfesionalSeleccionado: HorarioProfesional = {
      idHorario: event,
      idProfesional: this.idDelProfesional,
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
    const fechaDiaSeleccionado = new Date();

    if(this.fechaInput){
      //si es otro dia le paso el dia que yo le pase
      fechaDiaSeleccionado.setDate(this.fechaInput.getDate());
    }else{
      //si es maniana le sumo 1 al dia de hoy
      fechaDiaSeleccionado.setDate(fechaInicio.getDate()+1);
    }



    //esto me da el dia de hoy + el dia que yo le pase


    fechaInicio.setDate(fechaInicio.getDate() + (fechaDiaSeleccionado.getDate()- fechaInicio.getDate()));
    return fechaInicio;

  }


  //esto me va a retornar una lista de horarios del profesional del dia que yo le pase lun,mart,mier,juev,viern,sab,dom

  manejarDiaSeleccionado(event:number){
    this.otroDiaActivo = false;
    this.fechaInput = undefined;
    this.obtenerHorariosProfesionalPorDia(event);
  }

  obtenerHorariosProfesionalPorDia(nroDia:number){

    this.horarioProfesionalService.obtenerHorariosPorIdProfesionalYDia(this.idNegocio,this.idDelProfesional,nroDia).subscribe({

      next: (horarios) => {
        this.diaSeleccionado = nroDia;
        this.arregloHorarios = horarios
        console.log("Nro dia: ",nroDia);
        console.log("Horarios: ",horarios);
      },
      error: (error) => {

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

    if(this.otroDiaActivo === false){
      this.arregloHorarios=[];
      this.otroDiaActivo = true;

    }

  }

  fechaInput?:Date = new Date();

  //obtenemos el dia seleccionado por el input date y mostramos los horarios del profesional
  obtenerInputOtroDia(event:Event){
    const inputDate = (event.target as HTMLInputElement).value;

    console.log("Fecha input: ",inputDate);

    this.fechaInput = new Date(`${inputDate}T00:00:00`);

    console.log("Fecha input: ",this.fechaInput.getDay());
    console.log("Fecha input: ",this.fechaInput);

    this.obtenerHorariosProfesionalPorDia(this.fechaInput.getDay());
  }

  //calculamos la fecha minima para el input date para que no se pueda seleccionar un dia anterior al de hoy
  calcularFechaMinima():string{
    const fechaMinima = new Date();
    fechaMinima.setDate(fechaMinima.getDate() + 2);
    return fechaMinima.toISOString().split('T')[0];
  }

}
