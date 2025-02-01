import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { MatIcon } from "@angular/material/icon";
import { Router, RouterModule } from "@angular/router";
import { ICONOS } from '../../models/iconos.constants';

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
  urlFotoPerfil = "icono-removebg.png";
  altFotoPerfil = "Nombre del local";
  iconos = ICONOS;

  @Input() nombreNegocio = "";
  @Output() salir:EventEmitter<boolean>= new EventEmitter();
  @Input() botones: { texto: string; icono: string; ruta: string; }[]= [];
  @Input() urlBaseNegocio: string = '';
  cerrarSesionEstado:boolean = false;
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
