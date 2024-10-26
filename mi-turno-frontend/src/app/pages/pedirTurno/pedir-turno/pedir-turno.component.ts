import { Component } from '@angular/core';
import { NavPedirTurnoComponent } from "../nav-pedir-turno/nav-pedir-turno.component";
import { NavPasosComponent } from "../nav-pasos/nav-pasos.component";
import { CardComponent } from "../../../shared/components/card/card.component";

@Component({
  selector: 'app-pedir-turno',
  standalone: true,
  imports: [NavPedirTurnoComponent, NavPasosComponent, CardComponent],
  templateUrl: './pedir-turno.component.html',
  styleUrl: './pedir-turno.component.css'
})
export class PedirTurnoComponent {

  pasoActual: number = 1; // Variable que controla el paso actual

  // Función para avanzar al siguiente paso
  avanzarPaso(): void {
    console.log(this.pasoActual);
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
