import { TurnoInterface } from '../../core/interfaces/turno-interface';
import { ChangeDetectorRef, Component, inject, OnInit  } from '@angular/core';
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
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../core/guards/auth/service/auth.service';





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
  authService: AuthService = inject(AuthService);

  //variables
  modalLevantado:boolean = false;
  clienteActual:ClienteInterface = {} as ClienteInterface;
  ngOnInit(): void {
    this.idCliente = this.authService.getIdUsuario()!;
    this.obtenerInfo()
  }



  listadoTurnos:TurnoInterface[] = [];

  constructor(private cdr: ChangeDetectorRef) {}

  obtenerInfo() {
    this.servicioNegocio.getTodosLosNegocios().subscribe({
      next: (negocios: NegocioInterface[]) => {
        this.listadoNegocios = [...negocios];
         // Forzar detección de cambios
      },
      error: (error) => {
        console.error(error);
      }
    });

    this.servicioCliente.getListadoDeTurnosPorIdCliente(this.idCliente).subscribe({
      next: (turnos: TurnoInterface[]) => {
        this.listadoTurnos = [...turnos];

      },
      error: (error) => {
        console.error(error);
      }
    });
    this.servicioCliente.getClienteById(this.idCliente).subscribe({
      next: (cliente: ClienteInterface) => {
        this.clienteActual = cliente;

      },
      error: (error:HttpErrorResponse) => {
        console.error(error);
      }
    });
    this.cdr.detectChanges(); // Forzar detección de cambios
  }

  estiloGeneralContainer:string="generalContainer"

  abrirModal() {
    this.modalLevantado = true;
  }

  cerrarModal(){
    this.modalLevantado = false;
  }



}
