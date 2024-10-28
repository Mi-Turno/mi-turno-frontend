import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CardComponent } from "../../../shared/components/card/card.component";

@Component({
  selector: 'app-seleccion-usuario',
  standalone: true,
  imports: [CardComponent],
  templateUrl: './seleccion-usuario.component.html',
  styleUrl: './seleccion-usuario.component.css'
})
export class SeleccionUsuarioComponent {
  @Input() datos:any[]= [];

  @Output() emitidorSeleccionado : EventEmitter<number> = new EventEmitter();

  emitirSeleccionado(id: number) {
    this.emitidorSeleccionado.emit(id);

  }

}
