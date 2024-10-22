import { CommonModule } from '@angular/common';
import { Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, InputComponent,MatIcon, ReactiveFormsModule,FormsModule],
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    }
  ]
})
export class InputComponent implements ControlValueAccessor {

@Input()
id?: string;
@Input()
type: string = "text";
@Input()
placeholder: string= "Ingrese aqui...";
@Input()
claseInputContainer: string = "inputContainer";
@Input()
textoLabel:string="Texto predeterminado";
@Input()
icono:string="sin icono";

// Emitir el evento cuando se hace click

private _value: string = '';

// Métodos de ControlValueAccessor
onChange = (value: any) => {};
onTouched = () => {};

set value(val: string) {
  this._value = val;
  this.onChange(val);
  this.onTouched();
}

get value(): string {
  return this._value;
}

writeValue(value: any): void {
  this.value = value ? value : '';
}

registerOnChange(fn: any): void {
  this.onChange = fn;
}

registerOnTouched(fn: any): void {
  this.onTouched = fn;
}

// Opción para deshabilitar el componente
setDisabledState?(isDisabled: boolean): void {
}



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
