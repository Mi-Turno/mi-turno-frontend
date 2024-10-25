import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CardComponent } from '../../../shared/components/card/card.component';
import { ServicioServiceService } from '../../../core/services/servicioService/servicio-service.service';
import { PopUpCrearServicioComponent } from "../pop-up-crear-servicio/pop-up-crear-servicio.component";

@Component({
  selector: 'app-profesionales-main',
  standalone: true,
  imports: [CommonModule, CardComponent, PopUpCrearServicioComponent],
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

@Output() activarOverlay: EventEmitter<void> = new EventEmitter<void>();

  // Este método emitirá el evento
  abrirPopUp() {

    this.activarOverlay.emit();
  }


agregarCard() {
  console.log(this.idCards);
  if(this.idCards.length < this.maxCards) {
    this.idCards.push(this.idCards.length + 1);
  }
}

eliminarCard(idCard: number) {
  this.idCards.splice(this.idCards.lastIndexOf(idCard), 1);
}

}


