import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-fecha-y-hora',
  standalone: true,
  imports: [CommonModule,],
  templateUrl: './fecha-y-hora.component.html',
  styleUrl: './fecha-y-hora.component.css'
})
export class FechaYHoraComponent implements OnInit {

fechaHoraActual: string = ' ';

ngOnInit(): void {
  this.actualizarFechaHora();
  setInterval(() => this.actualizarFechaHora(), 1000);
}



private actualizarFechaHora() {
const ahora = new Date();
const opcionesFecha: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
const opcionesHora: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit', second:'2-digit', hour12: false };
const fecha = ahora.toLocaleDateString('es-ES', opcionesFecha);
const hora = ahora.toLocaleTimeString('es-ES', opcionesHora);
this.fechaHoraActual= `${fecha} - ${hora}`;
}

}
