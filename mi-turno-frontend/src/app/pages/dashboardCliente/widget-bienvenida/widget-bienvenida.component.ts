import { Component, Input } from '@angular/core';
import { FechaYHoraComponent } from "../../../shared/components/fecha-y-hora/fecha-y-hora.component";
import { ClienteInterface } from '../../../core/interfaces/cliente-interface';
import { BotonComponent } from "../../../shared/components/boton/boton.component";

@Component({
  selector: 'app-widget-bienvenida',
  standalone: true,
  imports: [FechaYHoraComponent, BotonComponent],
  templateUrl: './widget-bienvenida.component.html',
  styleUrl: './widget-bienvenida.component.css'
})
export class WidgetBienvenidaComponent {
  @Input() nombreCliente: string = "Nombre";
  @Input() apellidoCliente: string = "Apellido";

}
