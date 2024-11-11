import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BotonComponent } from '../../../shared/components/boton/boton.component';
import { MatIcon } from '@angular/material/icon';
import { ICONOS } from '../../../shared/models/iconos.constants';
import { routes } from '../../../app.routes';
import { Router, RouterModule } from '@angular/router';
import { TextoConIconoComponent } from '../../../shared/components/texto-con-icono/texto-con-icono.component';

@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [CommonModule, MatIcon, RouterModule],
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
  @Output() salir:EventEmitter<boolean>= new EventEmitter();
  cerrarSesionEstado:boolean = false;
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
  cerrarSesion(){
    this.salir.emit(this.cerrarSesionEstado = true);
  }
  selecionado(ruta: string): boolean {
   return this.router.url.includes(`${this.urlBaseNegocio}${this.nombreNegocio}/${ruta}`);
  }
}
