import { Component, OnInit } from '@angular/core';
import { NavPedirTurnoComponent } from "../../pedirTurno/nav-pedir-turno/nav-pedir-turno.component";
import { WidgetBienvenidaComponent } from "../widget-bienvenida/widget-bienvenida.component";
import { TablaTurnosComponent } from "../tabla-turnos/tabla-turnos.component";

@Component({
  selector: 'app-dashboard-cliente',
  standalone: true,
  imports: [NavPedirTurnoComponent, WidgetBienvenidaComponent, TablaTurnosComponent],
  templateUrl: './dashboard-cliente.component.html',
  styleUrl: './dashboard-cliente.component.css'
})
export class DashboardClienteComponent implements OnInit{
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  idCliente: number = Number(localStorage.getItem('idCliente'));


}
