import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ICONOS } from '../../../shared/models/iconos.constants';
import { CommonModule } from '@angular/common';
import { BotonComponent } from '../../../shared/components/boton/boton.component';
import { MatIcon } from '@angular/material/icon';
import { TextoConIconoComponent } from '../../../shared/components/texto-con-icono/texto-con-icono.component';
import { UsuarioService } from '../../../core/services/usuarioService/usuario.service';

@Component({
  selector: 'app-side-bar-admin',
  standalone: true,
  imports: [CommonModule, MatIcon, RouterModule],
  templateUrl: './side-bar-admin.component.html',
  styleUrl: './side-bar-admin.component.css'
})
export class SideBarAdminComponent   {
  constructor(private router: Router) {}

  urlLogo = "LogoConFrase.png";
  urlFotoPerfil = "icono.png";
  altFotoPerfil = "Nombre del local";
  iconos = ICONOS;

  @Input() idAdmin = '';
  @Output() salir:EventEmitter<boolean>= new EventEmitter();
  cerrarSesionEstado:boolean = false;
  nombreAdmin = '';
  rutaInicio = 'inicio';
  rutaNegocio = 'negocio';
  rutaUsuario = 'usuarios';
  rutaConfiguracion = 'configuracion';
  rutaSalir = 'salir';

  claseEnlace = "claseEnlace";
  claseIcono = "claseIcono";

  usuarioService:UsuarioService = inject(UsuarioService);
  getNombreAdmin(){
    this.usuarioService.obtenerUsuarioPorId(parseFloat(this.idAdmin)).subscribe({
      next: (usuario) => {
        this.nombreAdmin = usuario.nombre;
      },
      error: (error) => {
        console.log(error);
      }
    })
  }

  cerrarSesion(){
    this.salir.emit(this.cerrarSesionEstado = true);
  }
  selecionado(ruta: string): boolean {
   return this.router.url.includes(`${this.idAdmin}/${ruta}`);
  }
}
