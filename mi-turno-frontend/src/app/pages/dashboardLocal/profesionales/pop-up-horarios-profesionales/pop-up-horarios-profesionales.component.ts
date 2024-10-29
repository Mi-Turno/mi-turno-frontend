import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, OnInit, inject } from '@angular/core';
import { HorariosComponent } from '../../horarios/horarios.component';
import { BotonComponent } from '../../../../shared/components/boton/boton.component';
import { MatIcon } from '@angular/material/icon';
import { UsuarioService } from '../../../../core/services/usuarioService/usuario.service';
import { UsuarioInterface } from '../../../../core/interfaces/usuario-interface';
import { HorarioXProfesionalInterface } from '../../../../core/interfaces/horarios-x-profesionale-interface';
import { HorarioXprofesionalService } from '../../../../core/services/horariosProfesionalService/horario-xprofesional.service';
import { DiasEnum } from '../../../../shared/models/diasEnum';

@Component({
  selector: 'app-pop-up-horarios-profesionales',
  standalone: true,
  imports: [CommonModule, HorariosComponent,BotonComponent, MatIcon],
  templateUrl: './pop-up-horarios-profesionales.component.html',
  styleUrl: './pop-up-horarios-profesionales.component.css'
})
export class PopUpHorariosProfesionalesComponent implements OnInit{

  nombreProfesional:string  | undefined= "";

  ngOnInit(): void {
    this.nombreProfesional =  this.cardSeleccionada?.nombre;
    this.cargarHorarios();
    console.log(this.horarios);
    this.pasarHorariosAhoras();
  }


  horariosProfesional:HorarioXprofesionalService = inject(HorarioXprofesionalService)

  @Input() cardSeleccionada: UsuarioInterface | null = null;

  botonConfirmar = "botonConfirmar"


  // Los emitidores funcionan perfecto
  @Output() desactivarOverlay: EventEmitter<void> = new EventEmitter<void>();
  @Output() activarModificacion: EventEmitter<void> = new EventEmitter<void>();

  horarios:HorarioXProfesionalInterface[] = [];
  horariosActuales:string[] = [];

  cargarHorarios() {
    if(this.cardSeleccionada?.idUsuario){
    this.horariosProfesional.obtenerHorariosPorProfesionalYDia(this.cardSeleccionada?.idUsuario, DiasEnum.lunes).subscribe({
       next: (response) => {
        this.horarios = response;
        this.pasarHorariosAhoras();
      },
      error: (error) => {
        console.error('Error al obtener usuarios:', error);
      }
    });
  }

  }

  pasarHorariosAhoras(){
    this.horarios.forEach(objeto => {

      this.horariosActuales.push(objeto.horario.toString());
    });
    console.log("HorariosActuales" + this.horariosActuales);
  }


  confirmar() {
    console.log(this.horarios);
  }


cerrarPopUp() {
  this.desactivarOverlay.emit();
  this.activarModificacion.emit();
}
}


