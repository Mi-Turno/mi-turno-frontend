import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { BotonComponent } from '../../../shared/components/boton/boton.component';
import { MatIcon } from '@angular/material/icon';
import { LinkConIconoComponent } from '../../../shared/components/link-con-icono/link-con-icono.component';
import { ICONOS } from '../../../shared/models/iconos.constants';

@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [CommonModule, BotonComponent, MatIcon, LinkConIconoComponent],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.css'
})
export class SideBarComponent {

urlLogo = "LogoConFrase.png";
urlFotoPerfil = "icono.png"
altFotoPerfil = "Nombre del local"
recepcion = "Recepción"


iconos = ICONOS

claseEnlace = "enlace";
claseIcono = "icono";

}
