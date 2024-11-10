import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { DiasEnum, DiasEnumOrdinal, obtenerDiaEnumPorNumero} from '../../../shared/models/diasEnum';
import { HorarioXprofesionalService } from '../../../core/services/horariosProfesionalService/horarioProfesional.service';
import { HorarioProfesional } from '../../../core/interfaces/horarioProfesional.interface';
import { BotonComponent } from "../../../shared/components/boton/boton.component";
import { ProfesionalesServiceService } from '../../../core/services/profesionalService/profesionales-service.service';
import { TurnoInterface } from '../../../core/interfaces/turno-interface';

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
  profesionalService:ProfesionalesServiceService = inject(ProfesionalesServiceService);
  //inputs y outputs
  @Input() idNegocio:number = 1;
  @Input() idDelProfesional:number = 0;
  @Output() emitirInformacion: EventEmitter<HorarioProfesional> = new EventEmitter<HorarioProfesional>();
  @Output() emitirDiaInicio: EventEmitter<Date> = new EventEmitter<Date>();



  //variables
  fechaInicio:Date = new Date();

  //arreglos
  arregloHorarios:HorarioProfesional[] = [];
  arregloTurnos:TurnoInterface[]=[]
  //dias de la semana
  hoy:number = new Date().getDay();
  diaDeLaSemanaSeleccionado:number=0;

  //funcionalidades boton horario para el OUTPUT
  obtenerIdHorario(event:number){
    //esto me va a retornar el horario seleccionado
    const horarioProfesionalSeleccionado = this.arregloHorarios.find(unHorario => unHorario.idHorario === event);

    if(horarioProfesionalSeleccionado !== undefined){

      horarioProfesionalSeleccionado.idProfesional=this.idDelProfesional;
      this.emitirInformacion.emit(horarioProfesionalSeleccionado);

      const [horas, minutos] = horarioProfesionalSeleccionado.horaInicio.toString().split(':');
      this.fechaInicio.setHours(Number(horas), Number(minutos), 0, 0);
    }




    console.log("Horario seleccionado: ",horarioProfesionalSeleccionado);

    console.log("fecha inicio: ",this.fechaInicio);
    this.emitirDiaInicio.emit(this.fechaInicio);
  }




  manejarDiaSeleccionado(event:number){
    //esto sirve para HOY y para EL DIA SIGUIENTE
    //saco el input otro dia
    if(this.otroDiaActivo === true){
      this.otroDiaActivo = false;
    }

    this.fechaInicio.setDate(this.fechaInicio.getDate() + (event - this.hoy));

    this.obtenerHorariosProfesionalPorDia(event);
  }

  parsearFechas(fecha:string):Date{

    //parseo la fecha a un string y lo separo por el guion
    const [anio,mes,dia]:string[] = fecha.toString().split('-');

    //construyo la fecha con el formato correcto y le resto 1 al mes ya que en el objeto Date el mes empieza en 0
    const fechaParseada = new Date(Number(anio),Number(mes)-1,Number(dia));

    return fechaParseada;

  }

  parsearHorarios(horaRecibida:Date):Date{
    console.log(horaRecibida);
    const [hora,minutos]:string[] = horaRecibida.toISOString().split(':');
    console.log("tiempo",hora,minutos);
    return new Date(0,0,0,Number(hora),Number(minutos));
  }

  obtenerHorariosProfesionalPorDia(nroDia:number){
    //obtengo el dia de la semana seleccionado
    this.diaDeLaSemanaSeleccionado = nroDia;

    this.horarioProfesionalService.obtenerHorariosPorIdProfesionalYDia(this.idNegocio,this.idDelProfesional,nroDia).subscribe({

      next: (horarios) => {
        //mapeo todos los turnos
        this.arregloTurnos.map(unTurno=>{
          let fechaAux:Date= this.parsearFechas(unTurno.fechaInicio.toString());

          //si un turno tiene la misma fecha de inicio que la fecha de inicio del horario ELEGIDO
          if(fechaAux.getDate() === this.fechaInicio.getDate()){

            console.log("HAY UN TURNO EN EL DIA DE HOY");
            //tengo que verificar si la hora es la misma asi lo muestro como reservado
            horarios.map(unHorario =>{

               let horarioAux:Date = new Date();

              // if(unHorario.horaInicio === horarioAux){
              //   console.log("HAY UN HORARIO OCUPADO");
              //   unHorario.estado = false;
              // }

            })

          }

        })

        this.arregloHorarios = horarios
        console.log("Nro dia: ",nroDia);
        console.log("Horarios: ",horarios);
      },
      error: (error) => {
        console.error(error);
      }
    });
  }


  obtenerListadoTurnosPorIdProfesional(idProfesional:number){
    this.profesionalService.getListadoTurnosPorIdNegocioYIdProfesional(this.idNegocio,idProfesional).subscribe({
      next: (turnos) => {
        console.log(turnos);
        this.arregloTurnos = turnos
      },
      error: (error) => {
        console.error(error);
      }
    });
  }


  //iniciamos con los horarios del profesional del dia de hoy
  ngOnInit(): void {
    this.obtenerListadoTurnosPorIdProfesional(this.idDelProfesional);
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
