import { ICONOS } from './../../../shared/models/iconos.constants';
import { Component, inject, Input } from '@angular/core';
import { BotonComponent } from "../../../shared/components/boton/boton.component";
import { MatIcon } from '@angular/material/icon';
import { AuthService } from '../../../auth/service/auth.service';


@Component({
  selector: 'app-nav-pedir-turno',
  standalone: true,
  imports: [BotonComponent,MatIcon],
  templateUrl: './nav-pedir-turno.component.html',
  styleUrl: './nav-pedir-turno.component.css'
})
export class NavPedirTurnoComponent {

  iconos = ICONOS;

  @Input()
  imagenIcono:string = "/imagenMarron-removebg.png";

  @Input()
  imagenUsuario?:string;

  claseBoton:string = "boton-nav";

  auth:AuthService = inject(AuthService);;
  clearLocalStorage(){
    console.log("Cerrando sesion");
   this.auth.logOut();
  }
}
