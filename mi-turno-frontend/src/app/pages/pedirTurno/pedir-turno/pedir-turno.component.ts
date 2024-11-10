import { ActivatedRoute, Router } from '@angular/router';
import { TurnoInterface } from './../../../core/interfaces/turno-interface';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { NavPedirTurnoComponent } from "../nav-pedir-turno/nav-pedir-turno.component";
import { NavPasosComponent } from "../nav-pasos/nav-pasos.component";
import { MetodosDePago, obtenerMetodosDePagoPorNumero } from '../../../shared/models/metodosDePago';
import { ConfirmacionComponent } from '../confirmacion/confirmacion.component';
import { SeleccionUsuarioComponent } from "../seleccion-usuario/seleccion-usuario.component";
import { ServicioInterface } from '../../../core/interfaces/servicio-interface';
import { ProfesionalInterface } from '../../../core/interfaces/profesional-interface';
import { NegocioServiceService } from '../../../core/services/negocioService/negocio-service.service';
import { MetodoPagoComponent } from "../metodo-pago/metodo-pago.component";
import { MetodosDePagoServiceService } from '../../../core/services/metodosDePago/metodos-de-pago-service.service';
import { HorarioXprofesionalService } from '../../../core/services/horariosProfesionalService/horarioProfesional.service';
import { DiasEnum, DiasEnumOrdinal } from '../../../shared/models/diasEnum';
import { HorarioProfesional } from '../../../core/interfaces/horarioProfesional.interface';


@Component({
  selector: 'app-pedir-turno',
  standalone: true,
  imports: [CommonModule, NavPedirTurnoComponent, NavPasosComponent, ConfirmacionComponent, SeleccionUsuarioComponent, MetodoPagoComponent],
  templateUrl: './pedir-turno.component.html',
  styleUrl: './pedir-turno.component.css'
})



export class PedirTurnoComponent implements OnInit{

  //Servicios y rutas

  ruta: ActivatedRoute = inject(ActivatedRoute)
  servicioNegocio :NegocioServiceService= inject(NegocioServiceService)

  // Variables
  idNegocio: number = 1;
  idCliente: number = Number(localStorage.getItem('idUsuario')); // ID del cliente que pide el turno

  ngOnInit(): void {
    const nombreNegocio = this.ruta.snapshot.paramMap.get('nombreNegocio');

    if (nombreNegocio) {
      this.servicioNegocio.getIdNegocioByNombre(nombreNegocio).subscribe(
        {
          next: (idNegocio) => {
            this.idNegocio = idNegocio;


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
    metodoPago: MetodosDePago.credito,
    idServicio: 0,
    fechaInicio: new Date(),
    horarioProfesional:{

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
      console.log("Horario profesional: ",event);
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
      this.turno.metodoPago = obtenerMetodosDePagoPorNumero(event);
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

