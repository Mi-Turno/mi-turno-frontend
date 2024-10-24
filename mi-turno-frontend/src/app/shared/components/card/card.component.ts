import { Component, Input } from '@angular/core';
import { ChipComponent } from '../chip/chip.component';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [ChipComponent],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent {

@Input() ruta:string = "";
@Input() claseImg:string = "claseImg";
@Input() textoAlt:string = "";
@Input() claseCuerpo:string = "claseCuerpo";
@Input() claseTitulo:string = "claseTitulo";
@Input() claseTexto:string = "claseTexto";
@Input() claseBoton:string = "claseBoton";
@Input() referencia:string = "";

@Input() titulo:string = "";
@Input() texto:string = "";
@Input() textoBoton: string = ""


@Input() referenciaChip ="";
@Input() claseEnlaceChip ="claseEnlaceChip"

@Input() claseCard = "claseCard"
@Input() claseContenedorImg ="contenedorImagen"
@Input() claseCuerpoChip ="claseCuerpoChip"
@Input() claseCuerpoTexto ="claseCuerpoTexto"




}
