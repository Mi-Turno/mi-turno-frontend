import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, OnInit, inject } from '@angular/core';
import { HorariosComponent } from '../../horarios/horarios.component';
import { BotonComponent } from '../../../../shared/components/boton/boton.component';
import { MatIcon } from '@angular/material/icon';
import { UsuarioService } from '../../../../core/services/usuarioService/usuario.service';
import { UsuarioInterface } from '../../../../core/interfaces/usuario-interface';
import { HorarioProfesional } from '../../../../core/interfaces/horarioProfesional.interface';
import { HorarioXprofesionalService } from '../../../../core/services/horariosProfesionalService/horarioProfesional.service';
import { ProfesionalInterface } from '../../../../core/interfaces/profesional-interface';
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

dia = DiasEnum;

  ngOnInit(): void {
    this.nombreProfesional =  this.profesional?.nombre;
    this.cargarHorariosPorSemana();
  }


horariosProfesional = inject(HorarioXprofesionalService);
  @Input() profesional: ProfesionalInterface | null = null;

  botonConfirmar = "botonConfirmar"



  // Los emitidores funcionan perfecto
  @Output() desactivarOverlay: EventEmitter<void> = new EventEmitter<void>();
  @Output() activarModificacion: EventEmitter<void> = new EventEmitter<void>();



 horariosActuales = {
  [DiasEnum.LUNES]: [] as HorarioProfesional[],
  [DiasEnum.MARTES]: [] as HorarioProfesional[],
  [DiasEnum.MIERCOLES]: [] as HorarioProfesional[],
  [DiasEnum.JUEVES]: [] as HorarioProfesional[],
  [DiasEnum.VIERNES]: [] as HorarioProfesional[],
  [DiasEnum.SABADO]: [] as HorarioProfesional[],
  [DiasEnum.DOMINGO]: [] as HorarioProfesional[]
};

horarios: HorarioProfesional | null = null;


cargarHorariosPorSemana() {
  console.log("recibo el evento");
  if (this.profesional?.idUsuario) {
    // Obtener todos los valores del enum para iterar sobre ellos
    const dias = Object.values(DiasEnum);

    dias.forEach((dia) => {
      const indiceDia = this.obtenerIndiceDia(dia); // Obtener el índice del día en el enum
       if(this.profesional?.idUsuario){
       this.horariosProfesional.obtenerHorariosPorIdProfesionalYDia(this.profesional.idNegocio!, this.profesional.idUsuario!, indiceDia).subscribe({
         next: (response) => {
          this.horariosActuales[dia] = response;
         },
         error: (error: Error) => {
           console.error(`Error al obtener horarios para el día ${dia}:`, error);
         }
       });
     }});
  }
}


obtenerIndiceDia(dia: DiasEnum): number {
  return Object.values(DiasEnum).indexOf(dia);
}


cerrarPopUp() {
  this.desactivarOverlay.emit();
  this.activarModificacion.emit();
}
}


