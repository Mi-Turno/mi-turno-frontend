import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output, OnInit } from '@angular/core';
import { BotonComponent } from '../../../../shared/components/boton/boton.component';
import { InputComponent } from '../../../../shared/components/input/input.component';
import { MatIcon } from '@angular/material/icon';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ICONOS } from '../../../../shared/models/iconos.constants';
import { PLACEHOLDERS } from '../../../../shared/models/placeholderInicioSesion.constants';
import { UsuarioInterface } from '../../../../core/interfaces/usuario-interface';
import { ROLES } from '../../../../shared/models/rolesUsuario.constants';
import { UsuarioService } from '../../../../core/services/usuarioService/usuario.service';
import { RouterLink } from '@angular/router';
import { codigoErrorHttp } from '../../../../shared/models/httpError.constants';

@Component({
  selector: 'app-pop-up-crear-profesional',
  standalone: true,
  imports: [CommonModule, BotonComponent, InputComponent, MatIcon, ReactiveFormsModule,RouterLink],
  templateUrl: './pop-up-crear-profesional.component.html',
  styleUrl: './pop-up-crear-profesional.component.css'
})
export class PopUpCrearProfesionalComponent implements OnInit {

roles = ROLES;
icono = ICONOS;
placeholder = PLACEHOLDERS;
usuarioService = inject(UsuarioService);

@Input() fotoProfesional = "img-default.png";
@Input() textoTitulo:string = "";
@Input() cardSeleccionada?: UsuarioInterface | null = null;


formularioRegister = new FormGroup ({
  nombre: new FormControl('', Validators.required),
  apellido: new FormControl('', Validators.required),
  email: new FormControl('', [Validators.required, Validators.email]),
  fechaNacimiento: new FormControl('',Validators.required),
  telefono: new FormControl('', Validators.required),
});


ngOnInit(): void {
    this.actualizarValores();
    console.log(this.cardSeleccionada);
}

actualizarValores() {
  this.formularioRegister.patchValue({
    nombre: this.cardSeleccionada?.nombre,
    apellido: this.cardSeleccionada?.apellido,
    email: this.cardSeleccionada?.email,
    fechaNacimiento: this.cardSeleccionada?.fechaNacimiento,
    telefono: this.cardSeleccionada?.telefono,
  });
}

crearUnProfesional():UsuarioInterface {
  const nombreForm = this.formularioRegister.get('nombre')?.value ||'';//||'' esto significa que puede ser null
  const apellidoForm = this.formularioRegister.get('apellido')?.value||'';
  const emailForm = this.formularioRegister.get('email')?.value||'';
  const fechaNacimientoForm = this.formularioRegister.get('fechaNacimiento')?.value||'';
  const telefonoForm = this.formularioRegister.get('telefono')?.value||'';
  const password = "Programador";
  const rol = this.roles.profesional;
  return {
    nombre:nombreForm,
    apellido:apellidoForm,
    email:emailForm,
    fechaNacimiento:fechaNacimientoForm,
    telefono:telefonoForm,
    password:password,
    rol:rol
  };
}

private postUsuarioToBackend(usuario:UsuarioInterface):void{
  try {
    this.usuarioService.postUsuario(usuario).subscribe({
      next:(usuario:UsuarioInterface) =>{

        console.log(usuario);
      },
      error:(error)=>{
        if (error.status === codigoErrorHttp.NO_ENCONTRADO) {
          alert('Error 404: Profesional no encontrado');

        } else if (error.status === codigoErrorHttp.ERROR_SERVIDOR) {
          alert('Error 500: Error del servidor');

        } else if (error.status === codigoErrorHttp.ERROR_CONTACTAR_SERVIDOR) {
          alert('Error de conexión: No se pudo contactar con el servidor (ERR_CONNECTION_REFUSED)');
        } else if(error.status === codigoErrorHttp.ERROR_REPETIDO){
          alert('Error 409: Profesional ya existe en el sistema');
        } else {
          alert('Error inesperado. Intente otra vez mas tarde.');
        }
      }
    })
  } catch (error) {
    console.error(error);
  }
}

onSubmit() {
  if (this.formularioRegister.valid) {

    const usuario:UsuarioInterface = this.crearUnProfesional();

    this.postUsuarioToBackend(usuario);
    window.location.reload();
  } else {
    let campoError: string = '';
    Object.keys(this.formularioRegister.controls).forEach(campo => {
      const control = this.formularioRegister.get(campo);
      if (control?.invalid) {
        campoError += (`${campo} es inválido, `);
      }
    });
    alert(campoError);
  }
}

mostrarCard() {
  console.log(this.cardSeleccionada?.nombre);
}



@Output() desactivarOverlay: EventEmitter<void> = new EventEmitter<void>();
@Output() activarHorarios: EventEmitter<void> = new EventEmitter<void>();
@Output() cardActual: EventEmitter<UsuarioInterface> = new EventEmitter<UsuarioInterface>();

cerrarPopUp() {
  this.desactivarOverlay.emit();
  if(this.cardSeleccionada){
    console.log(this.cardSeleccionada);
    this.cardActual.emit(this.cardSeleccionada);
  }
}

abrirServicios() {
  console.log("Abro servicios que ofrece");
}
abrirDiasYHorarios() {
  this.cerrarPopUp();
  this.activarHorarios.emit();

  console.log("Abro días y horarios");
}

eliminarProfesional() {
  console.log("Elimine el profesional");
}


}
