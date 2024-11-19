
import { ChangeDetectorRef, Component, inject, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServicioServiceService } from '../../../../core/services/servicioService/servicio-service.service';
import { ProfesionalesServiceService } from '../../../../core/services/profesionalService/profesionales-service.service';
import { NegocioInterface } from '../../../../core/interfaces/negocio-interface';
import { ServicioInterface } from '../../../../core/interfaces/servicio-interface';
import { TurnoInterface } from '../../../../core/interfaces/turno-interface';
import { ClienteService } from '../../../../core/services/clienteService/cliente.service';
import { TurnoService } from '../../../../core/services/turnoService/turno.service';
import { estadoTurno } from '../../../../shared/models/estadoTurnoEnum';


interface mostrarTurnosInterface {
  nombreNegocio: string,
  fechaInicio: string,
  horario: string,
  nombreServicio: string,
  precioServicio: string,
  nombreProfesional: string,
  estado: estadoTurno,
  idNegocio: number,
  idTurno: number
}



@Component({
  selector: 'app-tabla-turnos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tabla-turnos.component.html',
  styleUrl: './tabla-turnos.component.css'
})
export class TablaTurnosComponent implements OnInit {

  //servicios
  @Input() idCliente: number = 0;//localStorage.getItem('idUsuario') ? Number(localStorage.getItem('idUsuario')) : 0;
  servicioServicios: ServicioServiceService = inject(ServicioServiceService);
  servicioProfesional: ProfesionalesServiceService = inject(ProfesionalesServiceService);
  turnoService: TurnoService = inject(TurnoService);
  //arreglos

  listadoTurnos: TurnoInterface[] = [];
  constructor(private cdr: ChangeDetectorRef) { }

  estado = estadoTurno;
  @Input() listadoNegocios: NegocioInterface[] = [];
  listadoMostrarTurnos: mostrarTurnosInterface[] = [];
  servicioCliente: ClienteService = inject(ClienteService);

  ngOnInit(): void {

    this.setearTurnos();
  }


  setearTurnos() {
    this.listadoMostrarTurnos = []; // Limpiar antes de agregar nuevos turnos
    this.servicioCliente.getListadoDeTurnosPorIdCliente(this.idCliente).subscribe({
      next: (turnos: TurnoInterface[]) => {
        this.listadoTurnos = turnos;
        turnos.forEach((unTurno: TurnoInterface) => {

          const turnoUnico = this.settearMostrarTurnos(unTurno);
          if (!this.listadoMostrarTurnos.some(
            turno => turno.idNegocio === turnoUnico.idTurno
          )) {
            this.listadoMostrarTurnos.push(turnoUnico);
          }
        });
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error(error);
      }
    });
  }


  settearMostrarTurnos(unTurno: TurnoInterface): mostrarTurnosInterface {

    const unTurnoAux: mostrarTurnosInterface = {} as mostrarTurnosInterface;

    unTurnoAux.fechaInicio = unTurno.fechaInicio.toString();
    unTurnoAux.horario = unTurno.horarioProfesional.horaInicio.toString();
    //! todo verificar por que llega null aca desde el padre
    unTurnoAux.nombreNegocio = this.listadoNegocios.find((unNegocio) => unNegocio.idUsuario === unTurno.idNegocio)?.nombre!;
    unTurnoAux.idNegocio = this.listadoNegocios.find((unNegocio) => unNegocio.idUsuario === unTurno.idNegocio)?.idUsuario!;
    unTurnoAux.idTurno = unTurno.idTurno!;
    unTurnoAux.estado = unTurno.estado!;
    console.log(unTurnoAux.estado);
    this.servicioServicios.getServicioPorIdNegocio(unTurno.idNegocio, unTurno.idServicio).subscribe({
      next: (servicio: ServicioInterface) => {
        unTurnoAux.nombreServicio = servicio.nombre;
        unTurnoAux.precioServicio = servicio.precio ? servicio.precio.toString() : '';
      },
      error: (error) => {
        console.error(error)
      }
    })



    this.servicioProfesional.getProfesionalPorIdNegocio(unTurno.idNegocio, unTurno.horarioProfesional.idProfesional).subscribe({
      next: (unProfesional) => {
        unTurnoAux.nombreProfesional = unProfesional.nombre;
      },
      error: (error) => {
        console.error(error)
      }
    })


    return unTurnoAux;
  }



  verificarEstado(fechaTurno: string, horaTurno: string): 'Pagado' | 'Reservado' {
    const fechaActual = new Date();
    const [anio, mes, dia] = fechaTurno.split('-').map(Number);
    const [hora, minutos] = horaTurno.split(':').map(Number);

    if (isNaN(anio) || isNaN(mes) || isNaN(dia) || isNaN(hora) || isNaN(minutos)) {
      console.error('Fecha u hora con formato incorrecto');
      return 'Reservado';
    }

    const fechaTurnoDate = new Date(anio, mes - 1, dia, hora, minutos);
    return fechaTurnoDate < fechaActual ? 'Pagado' : 'Reservado';
  }

  determinarEstado(unTurno: any): string {
    if (unTurno.estado) {
      return unTurno.estado;
    }
    return this.verificarEstado(unTurno.fechaInicio, unTurno.horario);
  }


  cancelarTurno(idNegocio: number, idTurno: number) {
    const estadoTurno = this.determinarEstado({ estado: idTurno });
    if (estadoTurno !== this.estado.COBRADO && estadoTurno !== this.estado.CANCELADO) {

      this.turnoService.deleteTurno(idNegocio, idTurno).subscribe({
        next: (response) => {
          alert('Turno cancelado');
          window.location.reload();
        },
        error: (error) => {
          console.error('Error al cancelar turno', error);
        }
      });
    } else {
      alert('No se puede cancelar este turno. Está cobrando o ya fue cancelado.');
    }
  }
}
// obtenerServicioPorId(idNegocio:number,idServicio:number):ServicioInterface{


//   return servicioAux;
// }




