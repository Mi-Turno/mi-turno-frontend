import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { HorarioProfesional } from '../../core/interfaces/horarioProfesional.interface';
import { TurnoInterface } from '../../core/interfaces/turno-interface';
import { NegocioServiceService } from '../../core/services/negocioService/negocio-service.service';
import { DiasEnum } from '../../shared/models/diasEnum';
import { MetodosDePago, obtenerMetodosDePagoPorNumero } from '../../shared/models/metodosDePago';
import { CalendarioHorarioProfesionalComponent } from './components/calendario-horario-profesional/calendario-horario-profesional.component';
import { ConfirmacionComponent } from './components/confirmacion/confirmacion.component';
import { MetodoPagoComponent } from './components/metodo-pago/metodo-pago.component';
import { NavPasosComponent } from './components/nav-pasos/nav-pasos.component';
import { SeleccionProfesionalComponent } from './components/seleccion-profesional/seleccion-profesional.component';
import { SeleccionServicioComponent } from './components/seleccion-servicio/seleccion-servicio.component';
import { NavPedirTurnoComponent } from '../dashboardCliente/components/nav-cliente/nav-cliente';



@Component({
  selector: 'app-pedir-turno',
  standalone: true,
  imports: [CommonModule, NavPedirTurnoComponent, NavPasosComponent, ConfirmacionComponent, MetodoPagoComponent, SeleccionServicioComponent, SeleccionProfesionalComponent, CalendarioHorarioProfesionalComponent],
  templateUrl: './pedir-turno.component.html',
  styleUrl: './pedir-turno.component.css'
})



export class PedirTurnoComponent implements OnInit{

  //Servicios y rutas

  ruta: ActivatedRoute = inject(ActivatedRoute)
  servicioNegocio :NegocioServiceService= inject(NegocioServiceService)

  // Variables
  idNegocio: number = -1;

  idCliente: number = -1; // ID del cliente que pide el turno

  ngOnInit(): void {
    //todo, sacarlo del jwt
    this.idCliente= Number(localStorage.getItem('idUsuario'));

    const nombreNegocio = this.ruta.snapshot.paramMap.get('nombreNegocio');

    if (nombreNegocio) {
      this.servicioNegocio.getIdNegocioByNombre(nombreNegocio).subscribe(
        {
          next: (idNegocioObtenido) => {

            this.idNegocio = idNegocioObtenido;
            this.turno.idNegocio = this.idNegocio;
          },
          error: (error) => {
            this.idNegocio = -1;
            console.error('Error al obtener el ID del negocio', error);
          }
        }
      );
    } else {
      console.error('Nombre del negocio no encontrado en la URL');
    }
  }


  activarOscurecer: boolean = false; // Variable que controla si se oscurece el fondo para mostrar el pop-up
  manejadorOscurecer(event: boolean): void {
    this.activarOscurecer=event;
  }





  turno:TurnoInterface={
    idCliente: this.idCliente,
    idNegocio: this.idNegocio,
    metodosDePagoEnum: MetodosDePago.credito,
    idServicio: 0,
    fechaInicio: new Date(),
    horarioProfesional:{
      idHorario:0,
      idProfesional: 0,
      dia: DiasEnum.LUNES,
      horaInicio: new Date(),

    }
  };




  //vamos asignando los valores al turno

  //estos dos vienen juntos
  recibirHorarioProfesional(event:HorarioProfesional){
    if(this.pasoActual == 3){
      this.turno.horarioProfesional = event;

    }
    this.avanzarPaso();
  }
  recibirDiaInicio(event:Date){
    this.turno.fechaInicio = event;
  }

  //-----------

  recibirIdInformacion(event:number){

    if(this.pasoActual == 1){
      this.turno.idServicio = event;

    }

    if(this.pasoActual == 2){
      this.turno.horarioProfesional.idProfesional = event;
    }

    if(this.pasoActual == 4){
      this.turno.metodosDePagoEnum = obtenerMetodosDePagoPorNumero(event);
    }


    this.avanzarPaso();
  }





  pasoActual: number = 1; // Variable que controla el paso actual

  // Función para avanzar al siguiente paso
  avanzarPaso(): void {
    if (this.pasoActual < 5) {
      this.pasoActual++;
    }
  }

  // Función para retroceder al paso anterior
  retrocederPaso(): void {
    if (this.pasoActual > 1) {
      this.pasoActual--;
    }
  }

  // Función para cambiar al paso específico si es permitido
  irAPaso(paso: number): void {
    if (paso <= this.pasoActual) {
      this.pasoActual = paso;
    }
  }




}

