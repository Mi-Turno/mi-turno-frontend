import { Component } from '@angular/core';
import { NavPedirTurnoComponent } from "../nav-pedir-turno/nav-pedir-turno.component";
import { NavPasosComponent } from "../nav-pasos/nav-pasos.component";
import { CardComponent } from "../../../shared/components/card/card.component";
import { TurnoInterface } from '../../../core/interfaces/turno-interface';
import { MetodosDePago } from '../../../shared/models/metodosDePago';
import { ConfirmacionComponent } from '../confirmacion/confirmacion.component';

@Component({
  selector: 'app-pedir-turno',
  standalone: true,
  imports: [NavPedirTurnoComponent, NavPasosComponent, CardComponent,ConfirmacionComponent],
  templateUrl: './pedir-turno.component.html',
  styleUrl: './pedir-turno.component.css'
})
export class PedirTurnoComponent {

  turno:TurnoInterface = {
    idUsuario:1, //se obtiene mediante LocalStorage del JWT
    idServicio:1, //se obtiene mediante el servicio de servicios
    idProfesional:"1",
    fecha:new Date(),
    horaInicio:new Date(),
    metodoPago: MetodosDePago.efectivo
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
