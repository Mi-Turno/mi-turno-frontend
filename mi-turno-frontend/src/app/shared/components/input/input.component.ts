import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './input.component.html',
  //styleUrl: '../input.component.css'
})
export class InputComponent {

@Input()
id?: string;
@Input()
type: string = "text";
@Input()
placeholder: string= "Ingrese aqui..."
@Input()
inputPredeterminado:boolean = true;
isActive: boolean = true;



// Emitir el evento cuando se hace click




@Output()
inputFocus:EventEmitter<void> = new EventEmitter();

manejarFocus() {
  this.inputFocus.emit();  // Emitir el evento personalizado
  console.log("OYE HERMANO ME ACABAS DE CLCIKEAR")
}

// @Output()
// public pasarValor = new EventEmitter($event);


// manejarPasarValor(){
//   this.pasarValor.emit($event)
// }

}