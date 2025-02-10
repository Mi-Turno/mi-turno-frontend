import { Component, inject, Input, ViewChild } from "@angular/core";
import { ModalPreguntaComponent } from "../../../../../../mi-turno-frontend/src/app/shared/components/modal-pregunta/modal-pregunta.component";
import { BotonComponent } from "../../../../shared/components/boton/boton.component";
import { MatIcon } from "@angular/material/icon";
import { RouterLink } from "@angular/router";
import { ModalComponent } from "../../../../shared/components/modal/modal.component";
import { ModificarClienteComponent } from "../../../dashboardCliente/components/modificar-cliente/modificar-cliente.component";
import { ICONOS } from "../../../../shared/models/iconos.constants";
import { AuthService } from "../../../../core/guards/auth/service/auth.service";




@Component({
  selector: 'app-nav-pedir-turno',
  standalone: true,
  imports: [BotonComponent, MatIcon, RouterLink, ModalPreguntaComponent, ModalComponent, ModificarClienteComponent],
  templateUrl: './nav-pedir-turno.component.html',
  styleUrl: './nav-pedir-turno.component.css'
})
export class NavPedirTurnoComponent {
  @ViewChild(ModalPreguntaComponent) modalPregunta!: ModalPreguntaComponent;

  iconos = ICONOS;
  modalLevantado:boolean = false;
  @Input()
  imagenIcono:string = "/imagenMarron-removebg.png";

  @Input()
  imagenUsuario?:string;

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


  abrirModalCierre(){
    this.modalPregunta.openDialog();
  }

  manejarRespuesta(respuesta: boolean){
    if (!respuesta) {
      this.clearLocalStorage()
    }
  }
}
