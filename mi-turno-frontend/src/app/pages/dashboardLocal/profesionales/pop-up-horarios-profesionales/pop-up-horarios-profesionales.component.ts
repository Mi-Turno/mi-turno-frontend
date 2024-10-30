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
    this.cargarHorariosPorSemana();
    console.log(this.horarios);
  }


  horariosProfesional:HorarioXprofesionalService = inject(HorarioXprofesionalService)

  @Input() cardSeleccionada: UsuarioInterface | null = null;

  botonConfirmar = "botonConfirmar"



  // Los emitidores funcionan perfecto
  @Output() desactivarOverlay: EventEmitter<void> = new EventEmitter<void>();
  @Output() activarModificacion: EventEmitter<void> = new EventEmitter<void>();

  horarios:HorarioXProfesionalInterface[] = [];

  //horariosActuales:string[] = [];

// Define el tipo que usa DiasEnum como claves y cada clave tiene un arreglo de strings


 horariosActuales = {
  [DiasEnum.LUNES]: [] as string[],
  [DiasEnum.MARTES]: [] as string[],
  [DiasEnum.MIERCOLES]: [] as string[],
  [DiasEnum.JUEVES]: [] as string[],
  [DiasEnum.VIERNES]: [] as string[],
  [DiasEnum.SABADO]: [] as string[],
  [DiasEnum.DOMINGO]: [] as string[]
};


cargarHorariosPorSemana() {
  if (this.cardSeleccionada?.idUsuario) {
    // Obtener todos los valores del enum para iterar sobre ellos
    const dias = Object.values(DiasEnum);

    dias.forEach((dia) => {
      if(this.cardSeleccionada?.idUsuario){
      this.horariosProfesional.obtenerHorariosPorProfesionalYDia(this.cardSeleccionada.idUsuario, dia).subscribe({
        next: (response) => {
          this.horarios = response;
          this.pasarHorariosAhoras(dia);
        },
        error: (error) => {
          console.error(`Error al obtener horarios para el día ${dia}:`, error);
        }
      });
    }});
  }
}


pasarHorariosAhoras(dia: DiasEnum) {
  this.horariosActuales[dia] = this.horarios.map(objeto => objeto.horario.toString());
  console.log(`HorariosActuales para ${dia}:`, this.horariosActuales[dia]);
}

  confirmar() {
    console.log(this.horarios);
  }


cerrarPopUp() {
  this.desactivarOverlay.emit();
  this.activarModificacion.emit();
}
}


