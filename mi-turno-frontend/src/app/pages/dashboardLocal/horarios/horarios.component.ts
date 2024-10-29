import { Component, Input, OnInit } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { ChipComponent } from '../../../shared/components/chip/chip.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { HorarioXProfesionalInterface } from '../../../core/interfaces/horarios-x-profesionale-interface';

@Component({
  selector: 'app-horarios',
  standalone: true,
  imports: [MatIcon, ChipComponent,CommonModule,FormsModule, MatSlideToggleModule],
  templateUrl: './horarios.component.html',
  styleUrl: './horarios.component.css'
})
export class HorariosComponent  implements OnInit{

  toggleActivo: boolean = true;
 @Input() horarios: string[] = [];
 @Input() dia:string = "Martes";



 horariosActuales: string[] = []

ngOnInit(): void {
   console.log(this.horarios);
}


  // Función para alternar el estado del toggle
  cambiarEstadoToggle(event: any) {
    this.toggleActivo = event.checked; // Obtiene el estado del toggle desde el evento
  }

  // Función para añadir un nuevo horario
  agregarHorario() {

    // const nuevoHorario = prompt('Ingresa un nuevo horario (HH:mm):');
    // if (nuevoHorario) {
    //   this.horarios.push(nuevoHorario);
    // }
  }

  // Función para eliminar un horario específico
  eliminarHorario(index: number) {
    this.horarios.splice(index, 1);
  }

  escribirGola(){
    console.log("Gola");
  }
}
