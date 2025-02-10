import { Component } from '@angular/core';
import { ICONOS } from '../../../../shared/models/iconos.constants';

@Component({
  selector: 'app-caracteristicas',
  standalone: true,
  imports: [],
  templateUrl: './caracteristicas.component.html',
  styleUrl: './caracteristicas.component.css'
})
export class CaracteristicasComponent {
  iconos = ICONOS;

}
