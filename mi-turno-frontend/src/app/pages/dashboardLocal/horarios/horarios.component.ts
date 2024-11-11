import { Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { ChipComponent } from '../../../shared/components/chip/chip.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { DiasEnum } from '../../../shared/models/diasEnum';
import { HorarioXprofesionalService } from '../../../core/services/horariosProfesionalService/horarioProfesional.service';
import { HorarioProfesional } from '../../../core/interfaces/horarioProfesional.interface';
import { ProfesionalInterface } from '../../../core/interfaces/profesional-interface';

//todo: Hay que hacer que cuando el arreglo este con elementos, no se pueda desmarcar el toggle


@Component({
  selector: 'app-horarios',
  standalone: true,
  imports: [MatIcon, CommonModule, FormsModule, MatSlideToggleModule],
  templateUrl: './horarios.component.html',
  styleUrl: './horarios.component.css'
})
export class HorariosComponent  implements OnInit, OnChanges{

  horarioService = inject(HorarioXprofesionalService);
  toggleActivo: boolean = false;

 @Input() horarios: HorarioProfesional [] = [];
 @Input() dia:DiasEnum= DiasEnum.LUNES;
 @Input() profesional: ProfesionalInterface | null = null;


ngOnInit(): void {
  this.toggleActivo = this.cambiarToggle();
}

ngOnChanges(changes: SimpleChanges): void {
  if (changes['horarios'] && this.horarios.length > 0) {
    this.toggleActivo = true;
  }
  this.actualizarHorarios.emit();
}

cambiarToggle(){
  if(this.horarios.length > 0) {
    console.log(this.horarios.length);
    return true;
  }
  else
    return false
}


crearHorario(horarioNuevo: string): HorarioProfesional {
  let  id = 0;
  if(this.profesional?.idUsuario){
     id = this.profesional.idUsuario;
  }
  const dianuevo = this.dia;
  const horario = this.parsearHora(horarioNuevo);

  return{
    horaInicio: horario,
    dia: dianuevo,
    idProfesional: id,
  }
}
  // Función para alternar el estado del toggle
  cambiarEstadoToggle(event: any) {

      this.toggleActivo = event.checked; // Obtiene el estado del toggle desde el evento

  }

  convertirADiasEnum(dia: string): DiasEnum | undefined {
    console.log(dia);
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
    horario.setSeconds(0); // Puedes establecerlo a 0 si no necesitas segundos}
    console.log(horario);
    const horarioParseado:string = `${String(horario.getHours()).padStart(2, '0')}:${String(horario.getMinutes()).padStart(2, '0')}`;;
    console.log(horarioParseado);
    return horarioParseado;
  }

  @Output() actualizarHorarios: EventEmitter<void> = new EventEmitter<void>();


  // Función para añadir un nuevo horario
  agregarHorario() {
    const nuevoHorario = prompt('Ingresa un nuevo horario (HH:mm):');
    if(nuevoHorario){
     const horario = this.crearHorario(nuevoHorario)
      this.postHorarioToBackend(horario);
      this.actualizarHorarios.emit()
    }
  }
  private postHorarioToBackend(horario:any):void{
    try {
      this.horarioService.postHorariosPorProfesional(this.profesional?.idNegocio!, this.profesional?.idUsuario!, horario).subscribe({
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

  //todo: Hacer metodo para eliminar un horario de un porfesional
  //todo: En HORARIO_PROFESIONAL_CONTROLADOR
  // Función para eliminar un horario específico
  eliminarHorario(idServicio: number | undefined) {
    try{
      this.horarioService.deleteHorarioDeProfesional(this.profesional?.idNegocio!, this.profesional?.idUsuario!, idServicio!).subscribe({
        next:(response: any) => {
          console.log(response);
        },
        error:(error: Error) => {
          console.log(error);
        }
      })
    } catch (error) {
      console.log(error);
    }
  }

  escribirGola(){
    console.log("Gola");
  }




}
