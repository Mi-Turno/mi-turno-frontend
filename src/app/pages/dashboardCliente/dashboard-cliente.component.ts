import { TurnoInterface } from '../../core/interfaces/turno-interface';
import { ChangeDetectorRef, Component, ElementRef, inject, OnInit, ViewChild  } from '@angular/core';
import { NegocioInterface } from '../../core/interfaces/negocio-interface';
import { NegocioServiceService } from '../../core/services/negocioService/negocio-service.service';
import { ClienteService } from '../../core/services/clienteService/cliente.service';
import { ClienteInterface } from '../../core/interfaces/cliente-interface';
import { CommonModule } from '@angular/common';
import { WidgetBienvenidaComponent } from './components/widget-bienvenida/widget-bienvenida.component';

import { ModalComponent } from "../../shared/components/modal/modal.component";
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../core/guards/auth/service/auth.service';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { combineLatest, filter, forkJoin } from 'rxjs';
import { TablaTurnoClienteComponent } from "./components/tabla-turno-cliente/tabla-turno-cliente.component";
import { NavClienteComponent } from './components/nav-cliente/nav-cliente';
import { PrincipalClienteComponent } from "./components/principal-cliente/principal-cliente.component";





@Component({
  selector: 'app-dashboard-cliente',
  standalone: true,
  imports: [RouterModule, CommonModule, NavClienteComponent, PrincipalClienteComponent],
  templateUrl: './dashboard-cliente.component.html',
  styleUrl: './dashboard-cliente.component.css'
})
export class DashboardClienteComponent {

  @ViewChild('navContainer') navContainer!: ElementRef;

  router: Router = inject(Router);
  historialLevantado: boolean = false;

  //-------------- Historial -----------------
  cerrarHistorial(event: Event) {
    this.historialLevantado = (event.target as HTMLInputElement).checked;
  }
  manejarBotonHistorial(event:boolean){
    this.historialLevantado = event;
  }
}
