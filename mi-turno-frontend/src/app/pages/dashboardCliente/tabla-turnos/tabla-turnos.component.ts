import { ProfesionalInterface } from './../../../core/interfaces/profesional-interface';
import { Component, inject, Input, OnInit } from '@angular/core';
import { TurnoInterface } from '../../../core/interfaces/turno-interface';
import { ServicioServiceService } from '../../../core/services/servicioService/servicio-service.service';
import { ProfesionalesServiceService } from '../../../core/services/profesionalService/profesionales-service.service';
import { NegocioServiceService } from '../../../core/services/negocioService/negocio-service.service';
import { NegocioInterface } from '../../../core/interfaces/negocio-interface';
import { ServicioInterface } from '../../../core/interfaces/servicio-interface';

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
export class TablaTurnosComponent implements OnInit{

  //servicios

  //servicio
  servicioServicios: ServicioServiceService = inject(ServicioServiceService);

  //profesional
  servicioProfesional: ProfesionalesServiceService = inject(ProfesionalesServiceService);

  @Input()listadoTurnos: TurnoInterface[] = [];
  @Input()listadoNegocios: NegocioInterface[] = [];
  listadoMostrarTurnos: mostrarTurnosInterface[] = [];

  ngOnInit(): void {
    this.settearMostrarTurnos();
  }

  settearMostrarTurnos(){

    this.listadoTurnos.map((unTurno)=>{
      let servicioAux:ServicioInterface = this.obtenerServicioPorId(unTurno.idNegocio,unTurno.idServicio);

      let negocioAux: NegocioInterface|undefined = this.listadoNegocios.find((unNegocio)=>{
          //todo VERIFICAR SI ESTO FUNCIONA
          unNegocio?.idUsuario === unTurno.idNegocio
      })

      console.log(negocioAux);

      let profesionalAux:ProfesionalInterface= {
        nombre:"",
        email:"",
        apellido:"",
        password:"",
        telefono:"",
        fechaNacimiento:"",
        idRolUsuario:"",
      }
      this.servicioProfesional.getProfesionalPorIdNegocio(unTurno.idNegocio,unTurno.horarioProfesional.idProfesional).subscribe({
        next:(unProfesional)=>{
          profesionalAux = unProfesional;
        },
        error:(error)=>{
          console.error(error)
        }
      })

      this.listadoMostrarTurnos = [
        ...this.listadoMostrarTurnos,
        {
        nombreNegocio:String(negocioAux?.nombre),
        fechaInicio:unTurno.fechaInicio.toString(),
        horario:unTurno.horarioProfesional.horaInicio.toString(),
        nombreServicio:servicioAux.nombre,
        precioServicio:String(servicioAux.precio),
        nombreProfesional:profesionalAux.nombre
      }]
    })
  }

  obtenerServicioPorId(idNegocio:number,idServicio:number):ServicioInterface{
    let servicioAux:ServicioInterface ={
      nombre:'',
      duracion:-1,
      precio:-1
    }
    this.servicioServicios.GETservicioPorIdNegocio(idNegocio,idServicio).subscribe({
      next: (servicio) => {
        servicioAux= servicio;
      },
      error: (error) => {
        console.error(error)
      }
    })
    return servicioAux;
  }



}
