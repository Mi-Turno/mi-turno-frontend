import { Component } from '@angular/core';
import { ICONOS } from '../../../../shared/models/iconos.constants';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-beneficios',
  standalone: true,
  imports: [MatIcon],
  templateUrl: './beneficios.component.html',
  styleUrl: './beneficios.component.css'
})
export class BeneficiosComponent {
  iconos = ICONOS;

}
