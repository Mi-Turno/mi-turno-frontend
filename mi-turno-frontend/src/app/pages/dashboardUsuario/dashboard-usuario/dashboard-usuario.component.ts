import { Component } from '@angular/core';
import { NavPedirTurnoComponent } from "../../pedirTurno/nav-pedir-turno/nav-pedir-turno.component";

@Component({
  selector: 'app-dashboard-usuario',
  standalone: true,
  imports: [NavPedirTurnoComponent],
  templateUrl: './dashboard-usuario.component.html',
  styleUrl: './dashboard-usuario.component.css'
})
export class DashboardUsuarioComponent {

}
