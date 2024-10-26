import { CommonModule } from '@angular/common';
import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core';
import { TextoConIconoComponent } from "../../../shared/components/texto-con-icono/texto-con-icono.component";
import { ICONOS } from '../../../shared/models/iconos.constants';

@Component({
  selector: 'app-pop-up-confirmacion',
  standalone: true,
  imports: [CommonModule, TextoConIconoComponent],
  templateUrl: './pop-up-confirmacion.component.html',
  styleUrl: './pop-up-confirmacion.component.css'
})
export class PopUpConfirmacionComponent implements OnInit{
@Input() activar:boolean = false;
@Input() habilitar:boolean = false;
 ngOnInit(){
   this.habilitar = true;
}
  textoConfirmacion:string ='Se ha enviado un correo electronico con la confirmacion de su turno';
  iconos = ICONOS;

}
