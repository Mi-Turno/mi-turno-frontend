import { Router } from '@angular/router';
import { TurnoInterface } from './../../../core/interfaces/turno-interface';
import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { NavPedirTurnoComponent } from "../nav-pedir-turno/nav-pedir-turno.component";
import { NavPasosComponent } from "../nav-pasos/nav-pasos.component";
import { CardComponent } from "../../../shared/components/card/card.component";
import { MetodosDePago } from '../../../shared/models/metodosDePago';
import { ConfirmacionComponent } from '../confirmacion/confirmacion.component';
import { SeleccionUsuarioComponent } from "../seleccion-usuario/seleccion-usuario.component";
import { ParseFlags } from '@angular/compiler';
import { ServicioInterface } from '../../../core/interfaces/servicio-interface';
import { ProfesionalInterface } from '../../../core/interfaces/profesional-interface';
import { CalendarioHorarioProfesionalComponent } from "../calendario-horario-profesional/calendario-horario-profesional.component";


@Component({
  selector: 'app-pedir-turno',
  standalone: true,
  imports: [CommonModule, NavPedirTurnoComponent, NavPasosComponent, CardComponent, ConfirmacionComponent, SeleccionUsuarioComponent, CalendarioHorarioProfesionalComponent],
  templateUrl: './pedir-turno.component.html',
  styleUrl: './pedir-turno.component.css'
})



export class PedirTurnoComponent {


  //todo verificar desde la url si el negocio existe
  //todo extraer de la url el nombre del negocio y pegarle al backend para obtener el ID
  //todo extraer de LocalStorage el ID del usuario
  //todo



  datos: any[] = []; // Datos que se pasan al componente de selección de usuario


  activarOscurecer: boolean = false; // Variable que controla si se oscurece el fondo para mostrar el pop-up
  manejadorOscurecer(event: boolean): void {
    this.activarOscurecer=event;
  }
  @Input() idCliente: number = 1; // ID del cliente que pide el turno
  @Input() idNegocio: number = 1; // ID del negocio al que se pide el turno
  turno:TurnoInterface={
    idCliente: this.idCliente,
    idNegocio: this.idNegocio,
  };
  recibirIdInformacion(event:number){

    if(this.pasoActual == 1){
      this.turno.idServicio = event;

    }

    if(this.pasoActual == 2){
      this.turno.idProfesional = event;
    }

    console.log(this.turno);
    this.avanzarPaso();
  }

  servicioSeleccionado(idServicioSeleccionado:number){
    this.turno.idServicio= idServicioSeleccionado;
  }

  servicios: ServicioInterface[] = [
    {
      nombre: "Corte de pelo",
      duracion: 30,
      idServicio: 1
    },{
      nombre: "Color",
      duracion: 60,
      idServicio: 2
    }

  ]

  profesionales: ProfesionalInterface[]=[
    {
      idProfesional: 1,
      nombre: "Juan",
      precioServicio: 500,
    },{
      idProfesional: 2,
      nombre: "Pedro",
      precioServicio: 600,
    }
  ]





  pasoActual: number = 1; // Variable que controla el paso actual

  // Función para avanzar al siguiente paso
  avanzarPaso(): void {
    if (this.pasoActual < 4) {
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

  // Función para confirmar el turno
  confirmarTurno(): void {
    this.pasoActual=5;
  }


}

