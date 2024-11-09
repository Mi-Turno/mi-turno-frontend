import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { BotonComponent } from '../../../shared/components/boton/boton.component';
import { MatIcon } from '@angular/material/icon';
import { ICONOS } from '../../../shared/models/iconos.constants';
import { routes } from '../../../app.routes';
import { Router, RouterModule } from '@angular/router';
import { TextoConIconoComponent } from '../../../shared/components/texto-con-icono/texto-con-icono.component';

@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [CommonModule, BotonComponent, MatIcon, TextoConIconoComponent,RouterModule],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.css'
})
export class SideBarComponent {

  constructor(private router: Router) {}

  urlLogo = "LogoConFrase.png";
  urlFotoPerfil = "icono.png";
  altFotoPerfil = "Nombre del local";
  iconos = ICONOS;

  @Input() nombreNegocio = "";
  urlBaseNegocio = '/negocios/';
  rutaRecepcion = 'recepcion';
  rutaTurnos = 'turnos';
  rutaStaff = 'staff';
  rutaServicios = 'servicios';
  rutaClientes = 'clientes';
  rutaConfiguracion = 'configuracion';
  rutaSalir = 'salir';

  claseEnlace = "claseEnlace";
  claseIcono = "claseIcono";

  selecionado(ruta: string): boolean {
   // console.log(this.nombreNegocio);
    return this.router.url === `${this.urlBaseNegocio}/${this.nombreNegocio}/${ruta}`;
  }

}
