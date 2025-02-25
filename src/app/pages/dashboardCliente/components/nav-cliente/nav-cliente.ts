import { Component, EventEmitter, inject, Input, Output, ViewChild } from "@angular/core";
import { ModalPreguntaComponent } from "../../../../shared/components/modal-pregunta/modal-pregunta.component";
import { BotonComponent } from "../../../../shared/components/boton/boton.component";
import { MatIcon } from "@angular/material/icon";
import { Router, RouterLink } from "@angular/router";
import { ModalComponent } from "../../../../shared/components/modal/modal.component";
import { ModificarClienteComponent } from "../modificar-cliente/modificar-cliente.component";
import { ICONOS } from "../../../../shared/models/iconos.constants";
import { AuthService } from "../../../../core/guards/auth/service/auth.service";
import { InjectSetupWrapper } from "@angular/core/testing";




@Component({
  selector: 'app-nav-pedir-turno',
  standalone: true,
  imports: [BotonComponent, MatIcon, RouterLink, ModalPreguntaComponent, ModalComponent, ModificarClienteComponent],
  templateUrl: './nav-cliente.html',
  styleUrl: './nav-cliente.css'
})
export class NavPedirTurnoComponent {
  @ViewChild(ModalPreguntaComponent) modalPregunta!: ModalPreguntaComponent;

  router:Router = inject(Router);

  iconos = ICONOS;
  modalLevantado:boolean = false;
  @Input()
  imagenIcono:string = "/imagenMarron-removebg.png";

  @Input()
  imagenUsuario?:string;

  textoHistorialLevantado:string = "Historial de turnos";
  @Output() botonHistorial: EventEmitter<Boolean> = new EventEmitter<Boolean>();
  private historialVisible: boolean = false;

  onHistorialClick(): void {
    this.historialVisible = !this.historialVisible;
    this.botonHistorial.emit(this.historialVisible);
    if(this.historialVisible){
      this.textoHistorialLevantado = "Volver al inicio";
    }else{
      this.textoHistorialLevantado = "Historial de Turnos";
    }
  }
  cerrarHistorial(){
    this.historialVisible = false;
    this.textoHistorialLevantado = "Historial de Turnos";
    this.botonHistorial.emit(this.historialVisible);
  }

  claseBoton:string = "boton-nav";

  auth:AuthService = inject(AuthService);
  nombreCliente:string = this.auth.getNombreUsuario()!;

  clearLocalStorage(){
   this.auth.logOut();
  }
  abrirModal() {
    this.modalLevantado = true;
  }

  cerrarModal(){
    this.modalLevantado = false;
  }

  irANegocios() {
    this.router.navigate(['/dashboard-cliente/negocios']); // Ruta absoluta
  }

  abrirModalCierre(){
    this.modalPregunta.openDialog();
  }

  manejarRespuesta(respuesta: boolean){
    if (!respuesta) {
      this.clearLocalStorage()
    }
  }
}
