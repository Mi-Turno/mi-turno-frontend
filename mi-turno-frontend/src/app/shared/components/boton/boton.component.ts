import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { flatMap } from 'rxjs';

@Component({
  selector: 'app-boton',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './boton.component.html',
  styleUrl: './boton.component.css'
})
export class BotonComponent {

  @Input()
  textoDentroBoton:string="Click aqui"

  @Input()
  type:string="button"

  @Input()
  disabled: boolean= false

  @Input()
  class: string=".inputPredeterminado"

}
