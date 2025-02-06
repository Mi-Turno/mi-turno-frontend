import { ChangeDetectorRef, Component, EventEmitter, inject, Input, NgZone, OnInit, Output } from '@angular/core';
import { DiasEnum, DiasEnumOrdinal, obtenerDiaEnumPorNumero } from '../../../shared/models/diasEnum';
import { HorarioXprofesionalService } from '../../../core/services/horariosProfesionalService/horarioProfesional.service';
import { HorarioProfesional } from '../../../core/interfaces/horarioProfesional.interface';
import { BotonComponent } from "../../../shared/components/boton/boton.component";
import { ProfesionalesServiceService } from '../../../core/services/profesionalService/profesionales-service.service';
import { TurnoInterface } from '../../../core/interfaces/turno-interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-calendario-horario-profesional',
  standalone: true,
  imports: [CommonModule,BotonComponent],
  templateUrl: './calendario-horario-profesional.component.html',
  styleUrl: './calendario-horario-profesional.component.css'
})
export class CalendarioHorarioProfesionalComponent implements OnInit {
  //servicios
  horarioProfesionalService: HorarioXprofesionalService = inject(HorarioXprofesionalService);
  profesionalService: ProfesionalesServiceService = inject(ProfesionalesServiceService);
  //inputs y outputs
  @Input() idNegocio: number = 1;
  @Input() idDelProfesional: number = 0;
  @Output() emitirInformacion: EventEmitter<HorarioProfesional> = new EventEmitter<HorarioProfesional>();
  @Output() emitirDiaInicio: EventEmitter<Date> = new EventEmitter<Date>();



  //variables
  fechaInicioTurnoSeleccionado: Date = new Date();

  //arreglos
  arregloHorarios: HorarioProfesional[] = [];
  arregloTurnos: TurnoInterface[] = []
  //dias de la semana
  hoy: Date = new Date();
  diaSiguiente: number = 0;
  diaDeLaSemanaSeleccionado: number = this.hoy.getDay();

  constructor(private cdr: ChangeDetectorRef,private zone: NgZone) {}
  //funcionalidades boton horario para el OUTPUT
  obtenerIdHorario(idEvent: number) {
    //esto me va a retornar el horario seleccionado
    const horarioProfesionalSeleccionado = this.arregloHorarios.find(unHorario => unHorario.idHorario === idEvent);

    if (horarioProfesionalSeleccionado !== undefined) {

      horarioProfesionalSeleccionado.idProfesional = this.idDelProfesional;
      this.emitirInformacion.emit(horarioProfesionalSeleccionado);

      const [horas, minutos] = horarioProfesionalSeleccionado.horaInicio.toString().split(':');
      this.fechaInicioTurnoSeleccionado.setHours(Number(horas), Number(minutos), 0, 0);
    }


    this.emitirDiaInicio.emit(this.fechaInicioTurnoSeleccionado);
  }



  manejarDiaSeleccionado(diaSeleccionadoEvent: number) {
    this.otroDiaActivo = false;

    if(this.diaDeLaSemanaSeleccionado === diaSeleccionadoEvent){
      return;
    }

    this.diaDeLaSemanaSeleccionado = diaSeleccionadoEvent;

    if (diaSeleccionadoEvent === this.hoy.getDay()) {
      this.fechaInicioTurnoSeleccionado = new Date();
    } else {
      //se hace esto porque si el dia siguiente es domingo, el dia siguiente es 0
      const diferenciaDias = diaSeleccionadoEvent - this.hoy.getDay();
      if (diferenciaDias > 0) {
        this.fechaInicioTurnoSeleccionado.setDate(this.fechaInicioTurnoSeleccionado.getDate() + diferenciaDias);
      }
    }

    // Llamamos al método combinado para obtener horarios con turnos
    this.obtenerHorariosDelDiaConTurnos(diaSeleccionadoEvent);
    this.cdr.detectChanges();

  }
  parsearFechaToDate(fecha: string): Date {

    //parseo la fecha a un string y lo separo por el guion
    const [anio, mes, dia]: string[] = fecha.toString().split('-');

    //construyo la fecha con el formato correcto y le resto 1 al mes ya que en el objeto Date el mes empieza en 0
    const fechaParseada = new Date(Number(anio), Number(mes) - 1, Number(dia));

    return fechaParseada;

  }

  parsearHorarios(horaRecibida: string): string {

    const [hora, minutos]: string[] = horaRecibida.toString().split(':');


    const horaParseada: string = `${hora}:${minutos}`;


    return horaParseada;
  }

  obtenerHorariosDelDiaConTurnos(dia: number) {
    // Reiniciamos los arreglos para evitar estados anteriores
    this.arregloHorarios = [];

    // Esperamos obtener primero los turnos
    this.profesionalService.getListadoTurnosPorIdNegocioYIdProfesional(this.idNegocio, this.idDelProfesional).subscribe({
      next: (turnos) => {
        this.arregloTurnos = turnos;

        // Después de obtener los turnos, buscamos los horarios para el día dado
        this.horarioProfesionalService.obtenerHorariosPorIdProfesionalYDia(this.idNegocio, this.idDelProfesional, dia).subscribe({
          next: (horarios) => {
            // Iteramos para actualizar el estado según los turnos
            horarios.forEach(unHorario => {

              const fechaActual = new Date();
              const horaFormateada = fechaActual.toLocaleTimeString('es-AR', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
              });
              const [horaInicio, minutosInicio] = unHorario.horaInicio.toString().split(':');

              const tieneTurno = this.arregloTurnos.some(unTurno => {

                const fechaTurno = this.parsearFechaToDate(unTurno.fechaInicio.toString());
                const [horaTurno, minutosTurno] = unTurno.horarioProfesional.horaInicio.toString().split(':');



                // Verificamos si el horario coincide con un turno existente
                return (
                  fechaTurno.getDate() === this.fechaInicioTurnoSeleccionado.getDate() &&
                  horaInicio === horaTurno &&
                  minutosInicio === minutosTurno ||
                  (this.fechaInicioTurnoSeleccionado.toDateString() === fechaActual.toDateString() &&
                   unHorario.horaInicio < horaFormateada))
              });

              // Marcamos el horario como ocupado si coincide con algún turno
              unHorario.estado = !tieneTurno;
            });

            this.arregloHorarios = horarios;

            // Forzamos la detección de cambios para refrescar la vista
            this.cdr.detectChanges();
          },
          error: (error) => console.error('Error al obtener horarios:', error)
        });
      },
      error: (error) => console.error('Error al obtener turnos:', error)
    });
  }


  // Método para formatear un objeto Date a 'HH:mm'
  formatearHora(fecha: Date): string {
    const horas = fecha.getHours().toString().padStart(2, '0');
    const minutos = fecha.getMinutes().toString().padStart(2, '0');
    return `${horas}:${minutos}`;
  }

  // obtenerListadoTurnosPorIdProfesional(idProfesional: number) {
  //   this.profesionalService.getListadoTurnosPorIdNegocioYIdProfesional(this.idNegocio, idProfesional).subscribe({
  //     next: (turnos) => {

  //       this.arregloTurnos = turnos
  //     },
  //     error: (error) => {
  //       console.error(error);
  //     }
  //   });
  // }


  //iniciamos con los horarios del profesional del dia de hoy
  ngOnInit(): void {

    //obtenemos los horarios del profesional para el día de hoy
    this.obtenerHorariosDelDiaConTurnos(this.hoy.getDay());

    // Configuramos el día siguiente
    const diaAux: number = this.hoy.getDay();
    this.diaSiguiente = diaAux + 1 === 7 ? 0 : diaAux + 1;
  }

  obtenerDiaEnumPorNumero(nroDia: number): DiasEnum {
    return obtenerDiaEnumPorNumero(nroDia)
  }




  //funcionalidad seleccion otro dia INPUT DATE
  otroDiaActivo: boolean = false;

  activarInputOtroDia() {

    this.diaDeLaSemanaSeleccionado = -1;
    if (this.otroDiaActivo === false) {
      this.arregloHorarios = [];
      this.otroDiaActivo = true;

    }
    // Detectar cambios manualmente
    this.cdr.detectChanges();
  }



  //obtenemos el dia seleccionado por el input date y mostramos los horarios del profesional
  obtenerInputOtroDia(event: Event) {
    const inputDate = (event.target as HTMLInputElement).value;

    //aca ya obtengo la fecha de inicio
    this.fechaInicioTurnoSeleccionado = new Date(`${inputDate}T00:00:00`);
    this.obtenerHorariosDelDiaConTurnos(this.fechaInicioTurnoSeleccionado.getDay());
    this.cdr.detectChanges();
  }

  //calculamos la fecha minima para el input date para que no se pueda seleccionar un dia anterior al de 2 dias despues de la fecha actual
  calcularFechaMinima(): string {
    const fechaMinima = new Date();

    fechaMinima.setDate(fechaMinima.getDate() + 2);
    this.diaDeLaSemanaSeleccionado = -1;//para que no se seleccione el dia HOY
    return fechaMinima.toISOString().split('T')[0];
  }

}
