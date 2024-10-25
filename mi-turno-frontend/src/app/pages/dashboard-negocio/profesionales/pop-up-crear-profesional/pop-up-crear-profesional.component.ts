import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BotonComponent } from '../../../../shared/components/boton/boton.component';
import { InputComponent } from '../../../../shared/components/input/input.component';
import { MatIcon } from '@angular/material/icon';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ICONOS } from '../../../../shared/models/iconos.constants';
import { PLACEHOLDERS } from '../../../../shared/models/placeholderInicioSesion.constants';
import { PopUpServiciosProfesionalComponent } from '../pop-up-servicios-profesional/pop-up-servicios-profesional.component';

@Component({
  selector: 'app-pop-up-crear-profesional',
  standalone: true,
  imports: [CommonModule, BotonComponent, InputComponent, MatIcon, ReactiveFormsModule, PopUpServiciosProfesionalComponent],
  templateUrl: './pop-up-crear-profesional.component.html',
  styleUrl: './pop-up-crear-profesional.component.css'
})
export class PopUpCrearProfesionalComponent {

icono = ICONOS;
placeholder = PLACEHOLDERS;
tipoPopUp = 'profesionales'

@Input() fotoProfesional = "img-default.png"

formularioRegister = new FormGroup ({

  nombre: new FormControl('', Validators.required),
  apellido: new FormControl('', Validators.required),
  email: new FormControl('', [Validators.required, Validators.email]),
  telefono: new FormControl('', Validators.required),
  fechaNacimiento: new FormControl('', Validators.required),

});

@Output() desactivarOverlay: EventEmitter<void> = new EventEmitter<void>();

cerrarPopUp() {
  this.desactivarOverlay.emit();
}

abrirServicios() {
  console.log("Abro servicios que ofrece");
}
abrirDiasYHorarios() {
  console.log("Abro días y horarios");
}

crearProfesional() {
  console.log("Cree un profesional");
}

eliminarProfesional() {
  console.log("Elimine el profesional");
}


}
