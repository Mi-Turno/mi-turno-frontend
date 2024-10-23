import { Component } from '@angular/core';
import { NavPedirTurnoComponent } from "../nav-pedir-turno/nav-pedir-turno.component";
import { NavPasosComponent } from "../nav-pasos/nav-pasos.component";

@Component({
  selector: 'app-pedir-turno',
  standalone: true,
  imports: [NavPedirTurnoComponent, NavPasosComponent],
  templateUrl: './pedir-turno.component.html',
  styleUrl: './pedir-turno.component.css'
})
export class PedirTurnoComponent {

}
