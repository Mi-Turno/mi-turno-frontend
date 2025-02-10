import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ChipComponent } from '../chip/chip.component';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [ChipComponent],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent {

@Input() ruta:string = "img-default.png";
@Input() claseImg:string = "claseImg";
@Input() textoAlt:string = "Sin Imagen";
@Input() claseCuerpo:string = "claseCuerpo";
@Input() claseTitulo:string = "claseTitulo";
@Input() claseTexto:string = "claseTexto";
@Input() claseBoton:string = "claseBoton";
@Input() referencia:string = "";
@Input() titulo:string = "";
@Input() texto:any = "";
@Input() textoSecundario ="";
@Input() textoBoton: string = ""


@Input() referenciaChip ="";
@Input() claseEnlaceChip ="claseEnlaceChip"

@Input() claseCard = "claseCard"
@Input() claseContenedorImg ="contenedorImagen"
@Input() claseCuerpoChip ="claseCuerpoChip"
@Input() claseCuerpoTexto ="claseCuerpoTexto"


@Output() emitirInformacion: EventEmitter<number> = new EventEmitter();
@Input() guardarInformacion?: number; //id de la informacion guardada ej: id profesional o id servicio

emitirInformacionClick(){
  this.emitirInformacion.emit(this.guardarInformacion);

}

}
