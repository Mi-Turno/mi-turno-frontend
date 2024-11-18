import { TurnoInterface } from '../../core/interfaces/turno-interface';
import { Component, inject, OnInit  } from '@angular/core';
import { NavPedirTurnoComponent } from "../pedirTurno/nav-pedir-turno/nav-pedir-turno.component";
import { NegocioInterface } from '../../core/interfaces/negocio-interface';
import { NegocioServiceService } from '../../core/services/negocioService/negocio-service.service';
import { ClienteService } from '../../core/services/clienteService/cliente.service';
import { ClienteInterface } from '../../core/interfaces/cliente-interface';
import { CommonModule } from '@angular/common';
import { WidgetBienvenidaComponent } from './components/widget-bienvenida/widget-bienvenida.component';
import { TablaTurnosComponent } from './components/tabla-turnos/tabla-turnos.component';

import { ModalComponent } from "../../shared/components/modal/modal.component";
import { ElegirNegocioComponent } from "./components/elegir-negocio/elegir-negocio.component";





@Component({
  selector: 'app-dashboard-cliente',
  standalone: true,
  imports: [CommonModule, NavPedirTurnoComponent, WidgetBienvenidaComponent, TablaTurnosComponent, ModalComponent, ElegirNegocioComponent],
  templateUrl: './dashboard-cliente.component.html',
  styleUrl: './dashboard-cliente.component.css'
})
export class DashboardClienteComponent implements OnInit{

  idCliente: number = 0;

  //arreglos

  listadoNegocios:NegocioInterface[] = [];

  //servicios
  servicioNegocio: NegocioServiceService = inject(NegocioServiceService);
  servicioCliente: ClienteService = inject(ClienteService);


  //variables
  modalLevantado:boolean = false;
  clienteActual:ClienteInterface = {} as ClienteInterface;

  ngOnInit(): void {
    this.idCliente = Number(localStorage.getItem('idUsuario'));
    this.obtenerInfo()
  }



  listadoTurnos:TurnoInterface[] = [];


obtenerInfo() {
  // Obtener todos los negocios
  this.servicioNegocio.getTodosLosNegocios().subscribe({
    next: (negocios: NegocioInterface[]) => {
      // Asignar directamente los negocios a listadoNegocios
      this.listadoNegocios = negocios;
      console.log("Negocios que recibo del back", this.listadoNegocios);
    },
    error: (error) => {
      console.error(error);
    }
  });

  // Obtener nombre y apellido del cliente
  this.servicioCliente.getClienteById(this.idCliente).subscribe({
    next: (unCliente: ClienteInterface) => {
      this.clienteActual = unCliente;
    },
    error: (error) => {
      console.error(error);
    }
  });
}

  estiloGeneralContainer:string="generalContainer"

  abrirModal() {
    this.modalLevantado = true;
  }

  cerrarModal(){
    this.modalLevantado = false;
  }

mostrarNegocios() {
  console.log("Negocios que recibo del back", this.listadoNegocios);

}

}
