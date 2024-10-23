import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-texto-con-icono',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './texto-con-icono.component.html',
  styleUrl: './texto-con-icono.component.css'
})
export class TextoConIconoComponent {

  @Input() icono: string = 'icono';
  @Input() texto: string = 'texto aqui';
  @Input() claseIcono: string = 'claseIcono';
  @Input() claseTexto: string = 'claseTexto';

  @Input() href:string = "#";

  constructor() { }
}
