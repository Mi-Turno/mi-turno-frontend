import { ICONOS } from './../../../shared/models/iconos.constants';
import { Component } from '@angular/core';
import { InputComponent } from "../../../shared/components/input/input.component";
import { RouterLink } from '@angular/router';
import { BotonComponent } from "../../../shared/components/boton/boton.component";
import { MatIconModule } from '@angular/material/icon';



@Component({
  selector: 'app-register',
  standalone: true,
  imports: [InputComponent, RouterLink, BotonComponent,MatIconModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
loginHref:string="login"

placeholders = {
  nombre:"Nombre",
  apellido:"Apellido",
  email:"Email",
  telefono:"Teléfono móvil",
  contrasenia:"Contraseña",
  repetirContrasenia:"Repetir Contraseña",
}
  iconos=ICONOS;

}


