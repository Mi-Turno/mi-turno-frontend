import { Router } from '@angular/router';
import { TurnoInterface } from './../../../core/interfaces/turno-interface';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { NavPedirTurnoComponent } from "../nav-pedir-turno/nav-pedir-turno.component";
import { NavPasosComponent } from "../nav-pasos/nav-pasos.component";
import { CardComponent } from "../../../shared/components/card/card.component";
import { MetodosDePago } from '../../../shared/models/metodosDePago';
import { ConfirmacionComponent } from '../confirmacion/confirmacion.component';
import { SeleccionUsuarioComponent } from "../seleccion-usuario/seleccion-usuario.component";


@Component({
  selector: 'app-pedir-turno',
  standalone: true,
  imports: [CommonModule, NavPedirTurnoComponent, NavPasosComponent, CardComponent, ConfirmacionComponent, SeleccionUsuarioComponent],
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

  turno:TurnoInterface={};


  servicioSeleccionado(idServicioSeleccionado:number){
    this.turno.idServicio= idServicioSeleccionado;
  }

  pasoActual: number = 1; // Variable que controla el paso actual

  // Función para avanzar al siguiente paso
  avanzarPaso(): void {
    console.log(this.pasoActual);
    if (this.pasoActual < 4) {
      this.pasoActual++;
    }
    console.log(this.turno);
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
