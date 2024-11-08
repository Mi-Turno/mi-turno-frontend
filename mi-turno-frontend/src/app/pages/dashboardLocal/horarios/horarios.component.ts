import { Component, inject, Input, OnInit } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { ChipComponent } from '../../../shared/components/chip/chip.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { DiasEnum } from '../../../shared/models/diasEnum';
import { HorarioXprofesionalService } from '../../../core/services/horariosProfesionalService/horarioProfesional.service';
import { HorarioProfesional } from '../../../core/interfaces/horarioProfesional.interface';


@Component({
  selector: 'app-horarios',
  standalone: true,
  imports: [MatIcon, ChipComponent,CommonModule,FormsModule, MatSlideToggleModule],
  templateUrl: './horarios.component.html',
  styleUrl: './horarios.component.css'
})
export class HorariosComponent  implements OnInit{

  horarioService = inject(HorarioXprofesionalService);
  toggleActivo: boolean = false;
 @Input() horarios: string[] = [];
 @Input() dia:DiasEnum= DiasEnum.DOMINGO;
 @Input() idProfesional: number | undefined = 0;


 horariosActuales: string[] = []


ngOnInit(): void {
   console.log(this.horarios);
}


crearHorario(horarioNuevo: string): HorarioProfesional {
  let  id = 0;
  if(this.idProfesional){
     id = this.idProfesional;
  }
  const dianuevo = this.dia;
  const horario = this.parsearHora(horarioNuevo);
  return{
    horaInicio: horario,
    dia: dianuevo,
    idProfesional: id
  }
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

    const nuevoHorario = prompt('Ingresa un nuevo horario (HH:mm):');
    if(nuevoHorario){
     const horario = this.crearHorario(nuevoHorario)
     console.log(horario);
      this.postHorarioToBackend(horario);
    }
  }


  private postHorarioToBackend(horario:HorarioProfesional):void{
    try {
      this.horarioService.postHorariosPorProfesional(horario).subscribe({
        next:(horario: HorarioProfesional) =>{
          console.log(horario);
        },
        error:(error)=>{
          console.log(error);
        }
      })
    } catch (error) {
      console.error(error);
    }
  }
  // Función para eliminar un horario específico
  eliminarHorario(index: number) {
    this.horarios.splice(index, 1);
  }

  escribirGola(){
    console.log("Gola");
  }
}
