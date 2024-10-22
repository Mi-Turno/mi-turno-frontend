import { ICONOS } from './../../../shared/models/iconos.constants';
import { Component, Input } from '@angular/core';
import { BotonComponent } from "../../../shared/components/boton/boton.component";
import { MatIcon } from '@angular/material/icon';

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
}
