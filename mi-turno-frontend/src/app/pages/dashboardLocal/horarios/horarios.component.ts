import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { ChipComponent } from '../../../shared/components/chip/chip.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-horarios',
  standalone: true,
  imports: [MatIcon, ChipComponent,CommonModule,FormsModule, MatSlideToggleModule],
  templateUrl: './horarios.component.html',
  styleUrl: './horarios.component.css'
})
export class HorariosComponent {

  horarios: string[] = ['10:00', '11:00', '12:00', '13:00', '14:00'];
  toggleActivo: boolean = false;
  dia = "Martes";
  // Función para alternar el estado del toggle
  cambiarEstadoToggle() {
    this.toggleActivo = !this.toggleActivo;
  }

  // Función para añadir un nuevo horario
  agregarHorario() {
    const nuevoHorario = prompt('Ingresa un nuevo horario (HH:mm):');
    if (nuevoHorario) {
      this.horarios.push(nuevoHorario);
    }
  }

  // Función para eliminar un horario específico
  eliminarHorario(index: number) {
    this.horarios.splice(index, 1);
  }
}
