import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NegocioInterface } from '../../../../core/interfaces/negocio-interface';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-elegir-negocio',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './elegir-negocio.component.html',
  styleUrl: './elegir-negocio.component.css'
})
export class ElegirNegocioComponent {
  @Input() listadoNegocios:NegocioInterface[] =[]; // los recibo como input y no uso service, porque en el padre utilizo los negocios tambien
  @Output() clickBoton: EventEmitter<number> = new EventEmitter<number>();
}
