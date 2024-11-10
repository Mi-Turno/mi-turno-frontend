import { Component, inject, OnInit } from '@angular/core';
import { NavPedirTurnoComponent } from "../../pedirTurno/nav-pedir-turno/nav-pedir-turno.component";
import { WidgetBienvenidaComponent } from "../widget-bienvenida/widget-bienvenida.component";
import { TablaTurnosComponent } from "../tabla-turnos/tabla-turnos.component";
import { TurnoInterface } from '../../../core/interfaces/turno-interface';
import { NegocioInterface } from '../../../core/interfaces/negocio-interface';
import { NegocioServiceService } from '../../../core/services/negocioService/negocio-service.service';
import { ClienteService } from '../../../core/services/clienteService/cliente.service';

@Component({
  selector: 'app-dashboard-cliente',
  standalone: true,
  imports: [NavPedirTurnoComponent, WidgetBienvenidaComponent, TablaTurnosComponent],
  templateUrl: './dashboard-cliente.component.html',
  styleUrl: './dashboard-cliente.component.css'
})
export class DashboardClienteComponent implements OnInit{
  idCliente: number = Number(localStorage.getItem('idCliente'));


  //servicios
  servicioNegocio: NegocioServiceService = inject(NegocioServiceService);
  servicioCliente: ClienteService = inject(ClienteService);

  //arreglos
  listadoTurnos:TurnoInterface[] = [];
  listadoNegocios:NegocioInterface[] = [];

  //variables
  popupLevantado:boolean = false;


  ngOnInit(): void {
    this.obtenerListadoDeTurnosDelCliente(this.idCliente);
    this.obtenerListadoDeNegocios();
  }

  obtenerListadoDeTurnosDelCliente(idCliente:number){
    this.servicioCliente.getListadoDeTurnosPorIdCliente(idCliente).subscribe({
      next: (turnos)=>{
        this.listadoTurnos = turnos;
      },
      error: (error)=>{
        console.error(error);
      }
    });
  }

  obtenerListadoDeNegocios(){
    this.servicioNegocio.getTodosLosNegocios().subscribe({
      next: (negocios)=>{
        this.listadoNegocios = negocios;
      },
      error: (error)=>{
        console.error(error);
      }
    })
  }
}
