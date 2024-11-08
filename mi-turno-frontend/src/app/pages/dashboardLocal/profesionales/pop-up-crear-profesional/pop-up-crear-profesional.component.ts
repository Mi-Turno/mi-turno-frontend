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
import { ProfesionalesServiceService } from '../../../../core/services/profesionalService/profesionales-service.service';
import { ProfesionalInterface } from '../../../../core/interfaces/profesional-interface';

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
usuarioService = inject(ProfesionalesServiceService);

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

@Input() idNegocio:number = 1;

crearUnProfesional():ProfesionalInterface {
  const nombreForm = this.formularioRegister.get('nombre')?.value ||'';//||'' esto significa que puede ser null
  const apellidoForm = this.formularioRegister.get('apellido')?.value||'';
  const emailForm = this.formularioRegister.get('email')?.value||'';
  const fechaNacimientoForm = this.formularioRegister.get('fechaNacimiento')?.value||'';
  const telefonoForm = this.formularioRegister.get('telefono')?.value||'';
  const password = "Programador";

  return {
    nombre:nombreForm,
    apellido:apellidoForm,
    email:emailForm,
    fechaNacimiento:fechaNacimientoForm,
    telefono:telefonoForm,
    password:password,
    idRolUsuario:3,//profesional
    idNegocio:this.idNegocio//aca deberia ir el idNegocio pero el que este en la URI
  };
}

private postUsuarioToBackend(usuario:UsuarioInterface):void{

    this.usuarioService.postProfesionalPorIdNegocio(1,usuario).subscribe({
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

}


/*private putUsuarioToBackend(id: number, usuario:UsuarioInterface):void{
  try{
    this.usuarioService.putUsuario(id, usuario).subscribe({
      next:(usuario:UsuarioInterface) => {
        console.log(usuario);
      }
      ,error:(error: Error) => {
        console.log(error.message)}
        });
      } catch(error){
        console.log(error);
      }
  }*/


confirmarUsuario() {
  if (this.formularioRegister.valid) {
    const usuario:UsuarioInterface = this.crearUnProfesional();
    if(this.cardSeleccionada?.idUsuario){
      //this.putUsuarioToBackend(this.cardSeleccionada.idUsuario, usuario);
      this.postUsuarioToBackend(usuario);
    }else{
      this.postUsuarioToBackend(usuario);
    }
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
  if(this.cardSeleccionada?.idUsuario) { //todo: Hay que poner el otro pop up
    this.cerrarPopUp();
    this.activarHorarios.emit();
    }else {
      alert("Todavía no se creo el usuario");
    }
}
abrirDiasYHorarios() {
  if(this.cardSeleccionada?.idUsuario) {
  this.cerrarPopUp();
  this.activarHorarios.emit();
  }else {
    alert("Todavía no se creo el usuario");
  }

  console.log("Abro días y horarios");
}

/*eliminarProfesional() {
  console.log(this.cardSeleccionada?.idUsuario);
  if (this.cardSeleccionada?.idUsuario) {
    this.usuarioService.deleteUsuario(this.cardSeleccionada.idUsuario).subscribe({
      next: (response) => {
        this.cerrarPopUp();
        console.log(response);
        window.location.reload();
      },
      error(e: Error) {
        console.log(e.message);
      },
    });
  }
  else{
    alert("Todavía no se creo el profesional ");
  }
}*/
}
