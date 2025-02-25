import { TurnoInterface } from '../../core/interfaces/turno-interface';
import { ChangeDetectorRef, Component, ElementRef, inject, OnInit, ViewChild  } from '@angular/core';
import { NegocioInterface } from '../../core/interfaces/negocio-interface';
import { NegocioServiceService } from '../../core/services/negocioService/negocio-service.service';
import { ClienteService } from '../../core/services/clienteService/cliente.service';
import { ClienteInterface } from '../../core/interfaces/cliente-interface';
import { CommonModule } from '@angular/common';
import { WidgetBienvenidaComponent } from './components/widget-bienvenida/widget-bienvenida.component';

import { ModalComponent } from "../../shared/components/modal/modal.component";
import { ElegirNegocioComponent } from "./components/elegir-negocio/elegir-negocio.component";
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../core/guards/auth/service/auth.service';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter } from 'rxjs';
import { TablaTurnoClienteComponent } from "./components/tabla-turno-cliente/tabla-turno-cliente.component";
import { NavPedirTurnoComponent } from './components/nav-cliente/nav-cliente';





@Component({
  selector: 'app-dashboard-cliente',
  standalone: true,
  imports: [RouterModule, CommonModule, WidgetBienvenidaComponent, ModalComponent, ElegirNegocioComponent, TablaTurnoClienteComponent],
  templateUrl: './dashboard-cliente.component.html',
  styleUrl: './dashboard-cliente.component.css'
})
export class DashboardClienteComponent implements OnInit{

  @ViewChild('navContainer') navContainer!: ElementRef;
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
  historialLevantado:Boolean = false;
  constructor(private cdr: ChangeDetectorRef,private router: Router) {}

  ngOnInit(): void {
    this.idCliente = this.authService.getIdUsuario()!;
    this.obtenerInfo()
  }
  cerrarHistorial(event: Event) {
    this.historialLevantado = (event.target as HTMLInputElement).checked;
  }
  manejarBotonHistorial(event:Boolean){
      this.historialLevantado = event;
      if (!this.historialLevantado) {
        this.router.navigate(['/dashboard-cliente']);
      }
  }

  ngAfterViewInit(): void {
    // Esperamos a que se renderice el nav y obtenemos su altura
    const navHeight = this.navContainer.nativeElement.offsetHeight;
    // Actualizamos la variable CSS global --nav-height
    document.documentElement.style.setProperty('--nav-height', `${navHeight}px`);
  }

  updateNavHeight(): void {
    const navHeight = this.navContainer.nativeElement.offsetHeight;
    // Actualizamos la variable CSS --nav-height en el root
    document.documentElement.style.setProperty('--nav-height', `${navHeight}px`);
  }



  listadoTurnos:TurnoInterface[] = [];


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
