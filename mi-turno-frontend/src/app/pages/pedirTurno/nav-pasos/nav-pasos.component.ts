import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { ICONOS } from '../../../shared/models/iconos.constants';
import { TextoConIconoComponent } from "../../../shared/components/texto-con-icono/texto-con-icono.component";


@Component({
  selector: 'app-nav-pasos',
  standalone: true,
  imports: [CommonModule, TextoConIconoComponent],
  templateUrl: './nav-pasos.component.html',
  styleUrl: './nav-pasos.component.css'
})
export class NavPasosComponent {

  @Input() pasoActual: number=1;
  @Output() cambiarPaso = new EventEmitter<number>();

  iconos=ICONOS;
  titulo:string='Confirmacion';

  textos = {
    servicio: 'Servicios',
    profesional: '¿Con quien?',
    cuando: '¿Cuando?',
    pago: 'Metodos de Pago',
  }

  // Función para cambiar al paso seleccionado
  irAPaso(paso: number): void {

    if (paso <= this.pasoActual) {
      this.cambiarPaso.emit(paso);
    }
  }



}
