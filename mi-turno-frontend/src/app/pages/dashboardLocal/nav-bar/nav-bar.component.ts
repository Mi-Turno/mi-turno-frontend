import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { FechaYHoraComponent } from '../../../shared/components/fecha-y-hora/fecha-y-hora.component';
import { ChipComponent } from "../../../shared/components/chip/chip.component";
import { ICONOS } from '../../../shared/models/iconos.constants';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [CommonModule, MatIcon, FechaYHoraComponent, ChipComponent],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent {

iconos = ICONOS;
texto = "Nuevo Turno";
referencia = '#';

}
