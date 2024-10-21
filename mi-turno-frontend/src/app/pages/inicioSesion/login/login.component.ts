import { ICONOS } from './../../../shared/models/iconos.constants';
import { Component, ElementRef, EventEmitter, ViewChild } from '@angular/core';
import { InputComponent } from "../../../shared/components/input/input.component";
import { MatIconModule } from '@angular/material/icon';
import { BotonComponent } from '../../../shared/components/boton/boton.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [InputComponent,MatIconModule,BotonComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  typeEmail:string = "email";
  typePassword:string = "password";
  registerHref:string = "register";
  iconos=ICONOS;
}
