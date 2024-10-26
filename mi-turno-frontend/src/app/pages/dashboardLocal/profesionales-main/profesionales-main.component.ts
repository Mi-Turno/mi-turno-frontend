import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CardComponent } from '../../../shared/components/card/card.component';
import { PopUpCrearProfesionalComponent } from '../pop-up-crear-profesional/pop-up-crear-profesional.component';

@Component({
  selector: 'app-profesionales-main',
  standalone: true,
  imports: [CommonModule, CardComponent, PopUpCrearProfesionalComponent],
  templateUrl: './profesionales-main.component.html',
  styleUrl: './profesionales-main.component.css'
})
export class ProfesionalesMainComponent {


nombre = "Juan"
especialidad = "Barbero"
textoBoton = "Modificar"
rutaImg = "img-default.png"
textoAlternativo = "Img del barbero"

idCards: number[] = [];
maxCards = 6;

rutaBotonChip = ""

estaSobrepuesto: boolean = false;


abrirPopUp() {
  this.estaSobrepuesto = true;
}


  // Este método emitirá el evento

agregarCard() {
  console.log(this.idCards);
  if(this.idCards.length < this.maxCards) {
    this.idCards.push(this.idCards.length + 1);
  }
}

eliminarCard(idCard: number) {
  this.idCards.splice(this.idCards.lastIndexOf(idCard), 1);
}

cambiarSobreposicion() {
  this.estaSobrepuesto = !this.estaSobrepuesto;
  console.log(this.estaSobrepuesto);
}

}


