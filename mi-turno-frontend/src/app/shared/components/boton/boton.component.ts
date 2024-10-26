import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

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
  disabled: boolean= false;

  @Input()
  class: string="botonPredeterminado"

  @Input()
  backgroundColor: string="var(--color-contraste2: #2138bb)"

  @Output()
  click = new EventEmitter<void>();

  backgroundColorEstilo: string=`background-color:${this.backgroundColor};`

}
