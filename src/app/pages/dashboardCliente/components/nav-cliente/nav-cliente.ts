import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { ModalPreguntaComponent } from '../../../../shared/components/modal-pregunta/modal-pregunta.component';
import { BotonComponent } from '../../../../shared/components/boton/boton.component';
import { MatIcon } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { ModificarClienteComponent } from '../modificar-cliente/modificar-cliente.component';
import { ICONOS } from '../../../../shared/models/iconos.constants';
import { AuthService } from '../../../../core/guards/auth/service/auth.service';
import { ClienteService } from '../../../../core/services/clienteService/cliente.service';
import { ClienteInterface } from '../../../../core/interfaces/cliente-interface';
import { ArchivosServiceService } from '../../../../core/services/archivosService/archivos-service.service';

@Component({
  selector: 'app-nav-pedir-turno',
  standalone: true,
  imports: [
    BotonComponent,
    MatIcon,
    RouterLink,
    ModalPreguntaComponent,
    ModalComponent,
    ModificarClienteComponent,
  ],
  templateUrl: './nav-cliente.html',
  styleUrl: './nav-cliente.css',
})
export class NavClienteComponent implements OnInit {
  @ViewChild(ModalPreguntaComponent) modalPregunta!: ModalPreguntaComponent;

  //Inputs y Outputs

  @Input() modificarPerfilActivo: boolean = true;
  @Input() imagenIcono: string = '/imagenMarron-removebg.png';
  @Output() botonHistorial: EventEmitter<boolean> = new EventEmitter<boolean>();

  //servicios
  router: Router = inject(Router);
  auth: AuthService = inject(AuthService);
  servicioCliente: ClienteService = inject(ClienteService);
  //variables

  iconos = ICONOS;
  modalLevantado: boolean = false;
  textoHistorialLevantado: string = 'Historial de turnos';
  historialVisible: boolean = false;
  claseBoton: string = 'boton-nav';
  clienteActual: ClienteInterface = {} as ClienteInterface;

  ngOnInit(): void {
    this.obtenerClienteActual();
  }

  archivosService: ArchivosServiceService = inject(ArchivosServiceService);

  obtenerClienteActual() {
    this.servicioCliente.getClienteById(this.auth.getIdUsuario()!).subscribe({
      next: (clienteResponse) => {
        if (
          clienteResponse.idUsuario &&
          clienteResponse.fotoPerfil !== 'img-default.png'
        ) {
          this.archivosService.getArchivoUsuario(clienteResponse.idUsuario).subscribe({
            next: (responseFoto) => {
              const reader = new FileReader();

              reader.readAsDataURL(responseFoto);

              reader.onload = () => {
                return clienteResponse.fotoPerfil = reader.result as string;
              };

            },
            error: (error) => {
              clienteResponse.fotoPerfil = 'img-default.png';
            },
          });
        }
        
        this.clienteActual = clienteResponse;
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  //--------------------Historial------------------------

  onHistorialClick(): void {
    this.historialVisible = !this.historialVisible;

    this.botonHistorial.emit(this.historialVisible);

    if (this.historialVisible) {
      this.textoHistorialLevantado = 'Historial de Turnos';
    } else {
      this.textoHistorialLevantado = 'Turnos actuales ';
    }
  }

  cerrarHistorial() {
    this.historialVisible = false;
    this.textoHistorialLevantado = 'Historial de Turnos';
    this.botonHistorial.emit(this.historialVisible);
  }

  clearLocalStorage() {
    this.auth.logOut();
  }

  //--------------------Modal------------------------

  abrirModal() {
    if(this.modificarPerfilActivo){
      this.modalLevantado = true;
    }
  }

  cerrarModal() {
    this.modalLevantado = false;
  }

  irANegocios() {
    this.router.navigate(['/dashboard-cliente/negocios']); // Ruta absoluta
  }

  abrirModalPreguntarCierre() {
    this.modalPregunta.openDialog();
  }

  manejarRespuesta(respuesta: boolean) {
    if (!respuesta) {
      this.clearLocalStorage();
    }
  }
}
