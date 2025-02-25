import { ChangeDetectorRef, Component, inject, Input } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { NavClienteComponent } from '../nav-cliente/nav-cliente';
import { DashboardClienteComponent } from '../../dashboard-cliente.component';
import { TablaTurnoClienteComponent } from '../tabla-turno-cliente/tabla-turno-cliente.component';
import { WidgetBienvenidaComponent } from '../widget-bienvenida/widget-bienvenida.component';
import { ElegirNegocioComponent } from '../elegir-negocio/elegir-negocio.component';
import { forkJoin } from 'rxjs';
import { NegocioInterface } from '../../../../core/interfaces/negocio-interface';
import { TurnoInterface } from '../../../../core/interfaces/turno-interface';
import { NegocioServiceService } from '../../../../core/services/negocioService/negocio-service.service';
import { AuthService } from '../../../../core/guards/auth/service/auth.service';
import { ClienteInterface } from '../../../../core/interfaces/cliente-interface';
import { ClienteService } from '../../../../core/services/clienteService/cliente.service';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';

@Component({
  selector: 'app-principal-cliente',
  standalone: true,
  imports: [
    RouterModule,
    TablaTurnoClienteComponent,
    WidgetBienvenidaComponent,
    ElegirNegocioComponent,
    ModalComponent,
  ],
  templateUrl: './principal-cliente.component.html',
  styleUrl: './principal-cliente.component.css',
})
export class PrincipalClienteComponent {

  //Input y Output
  @Input() historialLevantado: boolean = false;


  //arreglos
  listadoNegocios: NegocioInterface[] = [];
  listadoTurnos: TurnoInterface[] = [];

  //servicios e Injections
  servicioNegocio: NegocioServiceService = inject(NegocioServiceService);
  servicioCliente: ClienteService = inject(ClienteService);
  authService: AuthService = inject(AuthService);

  //variables
  clienteActual: ClienteInterface = {} as ClienteInterface;
  idCliente: number = 0;
  modalLevantado: boolean = false;

  //constructor y oninit
  constructor(private cdr: ChangeDetectorRef, private router: Router) {}

  ngOnInit(): void {

    let auxId=this.authService.getIdUsuario();
    if(auxId){
      this.idCliente=auxId;
    }
    this.obtenerInfo();

  }

  //----------------- Obtener Info -----------------

  obtenerInfo() {
    forkJoin([
      this.servicioNegocio.getTodosLosNegocios(),
      this.servicioCliente.getListadoDeTurnosPorIdCliente(this.idCliente),
      this.servicioCliente.getClienteById(this.idCliente),
    ]).subscribe({
      next: ([negocios, turnos, cliente]) => {
        this.listadoNegocios = [...negocios];
        this.listadoTurnos = [...turnos];
        this.clienteActual = cliente;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  //-------------- Modal -----------------

  abrirModal() {
    this.modalLevantado = true;
  }

  cerrarModal() {
    this.modalLevantado = false;
  }
  
  isRutaBasica()
  {
    let rta = false;
    if(this.router.url == "/dashboard-cliente") {
      rta = true;
    }
    return rta;
  }
}