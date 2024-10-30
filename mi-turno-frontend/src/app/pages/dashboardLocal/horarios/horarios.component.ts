import { Component, Input, OnInit } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { ChipComponent } from '../../../shared/components/chip/chip.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { HorarioXProfesionalInterface } from '../../../core/interfaces/horarios-x-profesionale-interface';
import { DiasEnum } from '../../../shared/models/diasEnum';


@Component({
  selector: 'app-horarios',
  standalone: true,
  imports: [MatIcon, ChipComponent,CommonModule,FormsModule, MatSlideToggleModule],
  templateUrl: './horarios.component.html',
  styleUrl: './horarios.component.css'
})
export class HorariosComponent  implements OnInit{

  toggleActivo: boolean = false;
 @Input() horarios: string[] = [];
 @Input() dia:string= "";
 @Input() idProfesional: number = 0;

 horariosActuales: string[] = []


ngOnInit(): void {
   console.log(this.horarios);
}


  // Función para alternar el estado del toggle
  cambiarEstadoToggle(event: any) {
    this.toggleActivo = event.checked; // Obtiene el estado del toggle desde el evento
  }


  convertirADiasEnum(dia: string): DiasEnum | undefined {
    dia = dia.toUpperCase();
    // Asegúrate de que el string esté en mayúsculas para coincidir con el enum
    return DiasEnum[dia as keyof typeof DiasEnum];
  }

  obtenerIndice(dia: DiasEnum): number {
    return Object.values(DiasEnum).indexOf(dia);
  }


  parsearHora(horarioNuevo:string) {
    const [horas, minutos] = horarioNuevo.split(':').map(Number);

    // Crear un objeto Date y ajustar la hora
    const horario = new Date();
    horario.setHours(horas);
    horario.setMinutes(minutos);
    horario.setSeconds(0); // Puedes establecerlo a 0 si no necesitas segundos

    return horario;
  }

  // Función para añadir un nuevo horario
  agregarHorario() {

    //const nuevoHorario = prompt('Ingresa un nuevo horario (HH:mm):');

    console.log(this.horarios);

  }

  // Función para eliminar un horario específico
  eliminarHorario(index: number) {
    this.horarios.splice(index, 1);
  }

  escribirGola(){
    console.log("Gola");
  }
}
