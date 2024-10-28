import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { HorariosComponent } from '../../horarios/horarios.component';
import { BotonComponent } from '../../../../shared/components/boton/boton.component';

@Component({
  selector: 'app-pop-up-horarios-profesionales',
  standalone: true,
  imports: [CommonModule, HorariosComponent,BotonComponent],
  templateUrl: './pop-up-horarios-profesionales.component.html',
  styleUrl: './pop-up-horarios-profesionales.component.css'
})
export class PopUpHorariosProfesionalesComponent {

nombreProfesional = "Marcos";
botonConfirmar = "botonConfirmar"
}
