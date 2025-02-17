import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-input-archivo',
  standalone: true,
  imports: [MatIcon],
  templateUrl: './input-archivo.component.html',
  styleUrl: './input-archivo.component.css'
})
export class InputArchivoComponent {
  @Input() tipoArchivo: string = '.jpg, .png, .jpeg';
  @Input() textoLabel: string = 'Seleccionar archivo';
  @Input() icono: string = 'upload';
  @Output() emitirArchivo: EventEmitter<File> = new EventEmitter<File>();
  archivoSeleccionado: File | null = null;

  seleccionarArchivo(event:Event): void{

    const input = event.target as HTMLInputElement;

    if(input.files == null){
      return;
    }
    if(input.files.length >= 0  && input.files[0] != null){

      this.archivoSeleccionado = input.files[0];
      this.emitirArchivo.emit(this.archivoSeleccionado);

    

    }

}
}
