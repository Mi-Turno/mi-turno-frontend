import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { MatIcon } from "@angular/material/icon";
import { Router, RouterModule } from "@angular/router";
import { ICONOS } from '../../models/iconos.constants';
import { ModalPreguntaComponent } from "../modal-pregunta/modal-pregunta.component";

@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [CommonModule, MatIcon, RouterModule, ModalPreguntaComponent],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.css'
})
export class SideBarComponent{

  //injections

  //input y outputs

  @Input() fotoPerfilNegocio = "icono-removebg.png";
  @Input() nombreNegocio = "";
  @Output() salir:EventEmitter<boolean>= new EventEmitter();
  @Input() botones: { texto: string; icono: string; ruta: string; }[]= [];
  @Input() urlBaseNegocio: string = '';
  @ViewChild(ModalPreguntaComponent) modalPregunta!: ModalPreguntaComponent;

  //variables

  urlLogo:string = "LogoConFrase.png";
  iconos = ICONOS;
  cerrarSesionEstado:boolean = false;
  rutaSalir:string = 'salir';

  //constructor

  constructor(private router: Router) {}





  claseEnlace = "claseEnlace";
  claseIcono = "claseIcono";
  cerrarSesion(){
    this.salir.emit(this.cerrarSesionEstado = true);
  }

  abrirModal(){
    this.modalPregunta.openDialog();
  }

  manejarRespuesta(respuesta: boolean){
    if (!respuesta) {
      this.cerrarSesion()
    }
  }
  seleccionado(ruta: string): boolean {
    const nombreNegocioURL = encodeURIComponent(this.nombreNegocio.trim());
   return this.router.url.includes(`${this.urlBaseNegocio}${nombreNegocioURL}/${ruta}`);
  }



}
