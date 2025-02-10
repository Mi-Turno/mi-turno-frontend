import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, Output, ViewChild } from "@angular/core";
import { MatIcon } from "@angular/material/icon";
import { Router, RouterModule } from "@angular/router";
import { ICONOS } from '../../models/iconos.constants';
import { DialogPregunta, ModalPreguntaComponent } from "../modal-pregunta/modal-pregunta.component";
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [CommonModule, MatIcon, RouterModule, ModalPreguntaComponent],
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
@ViewChild(ModalPreguntaComponent) modalPregunta!: ModalPreguntaComponent;

  cerrarSesionEstado:boolean = false;
  rutaSalir = 'salir';

  claseEnlace = "claseEnlace";
  claseIcono = "claseIcono";
  cerrarSesion(){
    this.salir.emit(this.cerrarSesionEstado = true);
  }

  abrirModal(){
    this.modalPregunta.openDialog();
  }

  manejarRespuesta(respuesta: boolean){
    console.log(respuesta);
    if (!respuesta) {
      this.cerrarSesion()
    } else {
      console.log("No quiere cerra");
    }
  }
  selecionado(ruta: string): boolean {
   return this.router.url.includes(`${this.urlBaseNegocio}${this.nombreNegocio}/${ruta}`);
  }



}
