import { ProfesionalInterface } from './../../../core/interfaces/profesional-interface';
import { Component, inject, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { TurnoInterface } from '../../../core/interfaces/turno-interface';
import { ServicioServiceService } from '../../../core/services/servicioService/servicio-service.service';
import { ProfesionalesServiceService } from '../../../core/services/profesionalService/profesionales-service.service';
import { NegocioServiceService } from '../../../core/services/negocioService/negocio-service.service';
import { NegocioInterface } from '../../../core/interfaces/negocio-interface';
import { ServicioInterface } from '../../../core/interfaces/servicio-interface';
import { ClienteService } from '../../../core/services/clienteService/cliente.service';

interface mostrarTurnosInterface{
  nombreNegocio:string,
  fechaInicio:string,
  horario:string,
  nombreServicio:string,
  precioServicio:string,
  nombreProfesional:string,
}



@Component({
  selector: 'app-tabla-turnos',
  standalone: true,
  imports: [],
  templateUrl: './tabla-turnos.component.html',
  styleUrl: './tabla-turnos.component.css'
})
export class TablaTurnosComponent implements OnInit {

  //servicios
  @Input() idCliente: number = 0;//localStorage.getItem('idUsuario') ? Number(localStorage.getItem('idUsuario')) : 0;
  servicioServicios: ServicioServiceService = inject(ServicioServiceService);
  servicioProfesional: ProfesionalesServiceService = inject(ProfesionalesServiceService);

  //arreglos

  listadoTurnos: TurnoInterface[] = [];

  @Input()
  listadoNegocios: NegocioInterface[] = [];
  listadoMostrarTurnos: mostrarTurnosInterface[] = [];
  servicioCliente: ClienteService = inject(ClienteService);

  ngOnInit(): void {

    //obtener listado de turnos
    this.servicioCliente.getListadoDeTurnosPorIdCliente(this.idCliente).subscribe({
      next: (turnos:TurnoInterface[])=>{

        this.listadoTurnos=turnos
        turnos.map((unTurno:TurnoInterface)=>{

          this.listadoMostrarTurnos= [...this.listadoMostrarTurnos,this.settearMostrarTurnos(unTurno)]
        })

      },
      error: (error)=>{
        console.error(error);
      }
    });


  }



  settearMostrarTurnos(unTurno:TurnoInterface):mostrarTurnosInterface{

    const unTurnoAux:mostrarTurnosInterface ={
      nombreNegocio:'',
      fechaInicio:'',
      horario:'',
      nombreServicio:'',
      precioServicio:'',
      nombreProfesional:''
    }

    unTurnoAux.fechaInicio = unTurno.fechaInicio.toString();
    unTurnoAux.horario = unTurno.horarioProfesional.horaInicio.toString();
    unTurnoAux.nombreNegocio = this.listadoNegocios.find((unNegocio)=>unNegocio.idUsuario === unTurno.idNegocio)?.nombre || '';


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
      console.log("TURNO COMO VA QUEDANDO", unTurnoAux);
  }

  // obtenerServicioPorId(idNegocio:number,idServicio:number):ServicioInterface{


  //   return servicioAux;
  // }



}
