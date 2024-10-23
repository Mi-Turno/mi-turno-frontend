import { CommonModule } from '@angular/common';
import { Component, Input, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { ICONOS } from '../../models/iconos.constants';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-link-con-icono',
  standalone: true,
  imports: [CommonModule, MatIcon],
  templateUrl: './link-con-icono.component.html',
  styleUrl: './link-con-icono.component.css'
})
export class LinkConIconoComponent {


@Input() icono:string = "";
@Input() titulo:string = "";
@Input() referencia:string = "";

@Input() claseEnlace:string = "";
@Input() claseIcono: string = "";

@Input() seleccionado: boolean = false;
@Input() claseContenedor:string = ""
}

