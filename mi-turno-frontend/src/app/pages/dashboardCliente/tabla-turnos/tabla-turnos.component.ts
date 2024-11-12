import { ProfesionalInterface } from './../../../core/interfaces/profesional-interface';
import { ChangeDetectorRef, Component, inject, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { TurnoInterface } from '../../../core/interfaces/turno-interface';
import { ServicioServiceService } from '../../../core/services/servicioService/servicio-service.service';
import { ProfesionalesServiceService } from '../../../core/services/profesionalService/profesionales-service.service';
import { NegocioServiceService } from '../../../core/services/negocioService/negocio-service.service';
import { NegocioInterface } from '../../../core/interfaces/negocio-interface';
import { ServicioInterface } from '../../../core/interfaces/servicio-interface';
import { ClienteService } from '../../../core/services/clienteService/cliente.service';
import { CommonModule } from '@angular/common';
import { TurnoService } from '../../../core/services/turnoService/turno.service';

interface mostrarTurnosInterface{
  nombreNegocio:string,
  fechaInicio:string,
  horario:string,
  nombreServicio:string,
  precioServicio:string,
  nombreProfesional:string,
  estado: boolean,
  idNegocio:  number,
  idTurno: number
}



@Component({
  selector: 'app-tabla-turnos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tabla-turnos.component.html',
  styleUrl: './tabla-turnos.component.css'
})
export class TablaTurnosComponent implements OnInit, OnChanges {

  //servicios
  @Input() idCliente: number = 0;//localStorage.getItem('idUsuario') ? Number(localStorage.getItem('idUsuario')) : 0;
  servicioServicios: ServicioServiceService = inject(ServicioServiceService);
  servicioProfesional: ProfesionalesServiceService = inject(ProfesionalesServiceService);
  turnoService: TurnoService = inject(TurnoService);
  //arreglos

  listadoTurnos: TurnoInterface[] = [];
  constructor(private cdr: ChangeDetectorRef) {}

  @Input()
  listadoNegocios: NegocioInterface[] = [];
  listadoMostrarTurnos: mostrarTurnosInterface[] = [];
  servicioCliente: ClienteService = inject(ClienteService);

  ngOnInit(): void {
    console.log(this.listadoNegocios);
    //obtener listado de turnos
    this.setearTurnos();
  }


  setearTurnos() {
    this.listadoMostrarTurnos = []; // Limpiar antes de agregar nuevos turnos
    this.servicioCliente.getListadoDeTurnosPorIdCliente(this.idCliente).subscribe({
      next: (turnos: TurnoInterface[]) => {
        this.listadoTurnos = turnos;
        turnos.forEach((unTurno: TurnoInterface) => {
          // Llenar el array con datos únicos una sola vez
          //Comparo el turno nuevo con los valores que están dentro del arreglo
          const turnoUnico = this.settearMostrarTurnos(unTurno);
          if (!this.listadoMostrarTurnos.some(
            turno => turno.idNegocio === turnoUnico.idTurno
          )) {
            this.listadoMostrarTurnos.push(turnoUnico);
          }
        });
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['listadoNegocios'] && changes['listadoNegocios'].currentValue) {
      // Forzar la actualización cuando listadoNegocios cambia
      this.cdr.detectChanges();
    }
    this.setearTurnos()
  }


  settearMostrarTurnos(unTurno:TurnoInterface):mostrarTurnosInterface{

    const unTurnoAux:mostrarTurnosInterface ={
      nombreNegocio:'',
      fechaInicio:'',
      horario:'',
      nombreServicio:'',
      precioServicio:'',
      nombreProfesional:'',
      estado:true,
      idNegocio: 0,
      idTurno: 0

    }

    unTurnoAux.fechaInicio = unTurno.fechaInicio.toString();
    unTurnoAux.horario = unTurno.horarioProfesional.horaInicio.toString();
    unTurnoAux.nombreNegocio = this.listadoNegocios.find((unNegocio)=>unNegocio.idUsuario === unTurno.idNegocio)?.nombre || 'babay';
    unTurnoAux.idNegocio= this.listadoNegocios.find((unNegocio)=> unNegocio.idUsuario === unTurno.idNegocio)?.idUsuario || 0;
    unTurnoAux.idTurno= unTurno.idTurno || 0;
    unTurnoAux.estado = unTurno.estado !== undefined ? unTurno.estado : true;
    this.servicioServicios.GETservicioPorIdNegocio(unTurno.idNegocio,unTurno.idServicio).subscribe({
      next: (servicio:ServicioInterface) => {
        unTurnoAux.nombreServicio = servicio.nombre;
        unTurnoAux.precioServicio = servicio.precio ? servicio.precio.toString() : '';
      },
      error: (error) => {
        console.error(error)
      }
    })



    this.servicioProfesional.getProfesionalPorIdNegocio(unTurno.idNegocio,unTurno.horarioProfesional.idProfesional).subscribe({
      next:(unProfesional)=>{
        unTurnoAux.nombreProfesional = unProfesional.nombre;
      },
      error:(error)=>{
        console.error(error)
      }
    })


    return unTurnoAux;
  }


  verificarEstado(fechaTurno: string, horaTurno: string,estado:boolean): string {

    if(!estado){
      return 'cancelado'
    }
      const fechaActual = new Date();
      const [anio, mes, dia] = fechaTurno.split('-').map((parte) => parseInt(parte, 10));
      const [hora, minutos] = horaTurno.split(':').map((parte) => parseInt(parte, 10));

      const fechaTurnoDate = new Date(anio, mes - 1, dia, hora, minutos, 0, 0);
      if (fechaTurnoDate < fechaActual) {
        return 'pagado';
      } else {
        return 'reservado';
      }


  }


  cancelarTurno(idNegocio?: number, idTurno?: number) {

    if(idTurno && idNegocio){
      console.log(idTurno, idNegocio);
      this.turnoService.deleteTurno(idNegocio, idTurno).subscribe({

        next: (response) => {
            console.log("Turno cancelado", response);
          alert('Turno cancelado ');
          window.location.reload();

        },
        error: (error) => {
          console.error(error);
        }
      }
    )
    }
    }
  }
  // obtenerServicioPorId(idNegocio:number,idServicio:number):ServicioInterface{


  //   return servicioAux;
  // }




