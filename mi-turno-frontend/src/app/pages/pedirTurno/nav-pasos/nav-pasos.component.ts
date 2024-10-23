import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { ICONOS } from '../../../shared/models/iconos.constants';
import { TextoConIconoComponent } from "../../../shared/components/texto-con-icono/texto-con-icono.component";

@Component({
  selector: 'app-nav-pasos',
  standalone: true,
  imports: [MatIcon, TextoConIconoComponent],
  templateUrl: './nav-pasos.component.html',
  styleUrl: './nav-pasos.component.css'
})
export class NavPasosComponent {
iconos=ICONOS;
textos = {
  servicios: 'Servicios',
  profesional: '¿Con quien?',
  cuando: '¿Cuando?',
  pago: 'Metodos de Pago',
}
}
