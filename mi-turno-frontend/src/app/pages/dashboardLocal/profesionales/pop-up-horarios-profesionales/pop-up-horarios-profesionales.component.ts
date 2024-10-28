import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { HorariosComponent } from '../../horarios/horarios.component';
import { BotonComponent } from '../../../../shared/components/boton/boton.component';
import { MatIcon } from '@angular/material/icon';
import { UsuarioService } from '../../../../core/services/usuarioService/usuario.service';
import { UsuarioInterface } from '../../../../core/interfaces/usuario-interface';

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
  }


  @Input() cardSeleccionada: UsuarioInterface | null = null;

  botonConfirmar = "botonConfirmar"


// Los emitidores funcionan perfecto
  @Output() desactivarOverlay: EventEmitter<void> = new EventEmitter<void>();
  @Output() activarModificacion: EventEmitter<void> = new EventEmitter<void>();


  confirmar() {
    console.log(this.cardSeleccionada?.nombre);
    console.log(this.nombreProfesional);
  }


cerrarPopUp() {
  this.desactivarOverlay.emit();
  this.activarModificacion.emit();
}
}


