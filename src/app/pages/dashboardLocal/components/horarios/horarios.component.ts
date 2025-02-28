

//todo: Hay que hacer que cuando el arreglo este con elementos, no se pueda desmarcar el toggle

import { CommonModule } from "@angular/common";
import { Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, signal, SimpleChanges, ViewChild } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatIcon } from "@angular/material/icon";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { HorarioXprofesionalService } from "../../../../core/services/horariosProfesionalService/horarioProfesional.service";
import { HorarioProfesional } from "../../../../core/interfaces/horarioProfesional.interface";
import { DiasEnum } from "../../../../shared/models/diasEnum";
import { ProfesionalInterface } from "../../../../core/interfaces/profesional-interface";
import { DialogoHorariosProfesionalComponent, DialogoPreguntaHorarios } from "../dialogo-horarios-profesional/dialogo-horarios-profesional.component";


@Component({
  selector: 'app-horarios',
  standalone: true,
  imports: [MatIcon, CommonModule, FormsModule, MatSlideToggleModule, DialogoHorariosProfesionalComponent],
  templateUrl: './horarios.component.html',
  styleUrl: './horarios.component.css'
})
export class HorariosComponent  implements OnInit, OnChanges{

  horarioService = inject(HorarioXprofesionalService);
  toggleActivo: boolean = false;

 @Input() horarios: HorarioProfesional [] = [];
 @Input() dia:DiasEnum= DiasEnum.LUNES;
 @Input() profesional: ProfesionalInterface | null = null;
@ViewChild(DialogoHorariosProfesionalComponent) dialogoHorarios!: DialogoHorariosProfesionalComponent;

ngOnInit(): void {
  this.toggleActivo = this.cambiarToggle();
}

ngOnChanges(changes: SimpleChanges): void {
  if (changes['horarios'] && this.horarios.length > 0) {
    this.toggleActivo = true;
  }

}

cambiarToggle(){
  if(this.horarios.length > 0) {

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

    const horarioParseado:string = `${String(horario.getHours()).padStart(2, '0')}:${String(horario.getMinutes()).padStart(2, '0')}`;;

    return horarioParseado;
  }

  @Output() actualizarHorarios: EventEmitter<void> = new EventEmitter<void>();


  // Función para añadir un nuevo horario
  agregarHorario(nuevoHorario: string) {
    if(nuevoHorario){
     const horario = this.crearHorario(nuevoHorario)
      this.postHorarioToBackend(horario);
    }
  }

  abrirDialogoAgregarHorarios(){
    this.dialogoHorarios.openDialog();
  }

  manejarRespuesta(respuesta:string){
    this.agregarHorario(respuesta);
  }


  private postHorarioToBackend(horario:any):void{
    try {
      this.horarioService.postHorariosPorProfesional(this.profesional?.idNegocio!, this.profesional?.idUsuario!, horario).subscribe({
        next:(horario: HorarioProfesional) =>{
          this.actualizarHorarios.emit()
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
          this.actualizarHorarios.emit()
        },
        error:(error: Error) => {
          console.log(error);
        }
      })
    } catch (error) {
      console.log(error);
    }
  }






}
