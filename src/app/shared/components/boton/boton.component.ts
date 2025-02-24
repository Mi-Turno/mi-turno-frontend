import { CommonModule } from '@angular/common';
import { Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-boton',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './boton.component.html',
  styleUrl: './boton.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => BotonComponent),
      multi: true
    }
  ]
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

  @Input()
  guardarInformacion?: number=-1;

  @Output()
  clickBoton: EventEmitter<number> = new EventEmitter<number>();

  // @Output()
  // click: EventEmitter<void> = new EventEmitter<void>();

  clickBotonEmitir(){
    //si es -1 no emito nada
    if(this.guardarInformacion !==-1){

      this.clickBoton.emit(this.guardarInformacion);
    }

  }


  backgroundColorEstilo: string=`background-color:${this.backgroundColor};`

}
