import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FechaYHoraComponent } from "../../../shared/components/fecha-y-hora/fecha-y-hora.component";


@Component({
  selector: 'app-widget-bienvenida',
  standalone: true,
  imports: [FechaYHoraComponent],
  templateUrl: './widget-bienvenida.component.html',
  styleUrl: './widget-bienvenida.component.css'
})
export class WidgetBienvenidaComponent {
  @Input() nombreCliente: string = "Nombre";
  @Input() apellidoCliente: string = "Apellido";


  @Output() clickBoton: EventEmitter<number> = new EventEmitter<number>();
  levantarPopupPedirTurno(){

    this.clickBoton.emit(1);
  }
}
