import { ICONOS } from './../../../shared/models/iconos.constants';
import { Component, inject, OnInit } from '@angular/core';
import { InputComponent } from "../../../shared/components/input/input.component";
import { RouterLink } from '@angular/router';
import { BotonComponent } from "../../../shared/components/boton/boton.component";
import { MatIconModule } from '@angular/material/icon';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsuarioInterface } from '../../../core/interfaces/usuario-interface';
import { UsuarioService } from '../../../core/services/usuarioService/usuario.service';
import { PLACEHOLDERS } from '../../../shared/models/placeholderInicioSesion.constants';
import { HttpErrorResponse } from '@angular/common/http';
import { codigoErrorHttp } from '../../../shared/models/httpError.constants';
import { ROLES } from '../../../shared/models/rolesUsuario.constants';
import { getTokenSourceMapRange } from 'typescript';



@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, InputComponent, RouterLink, BotonComponent, MatIconModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  loginHref: string = "login";
  claseAppInput: string = "claseAppInput";
  inputContainer: string = "inputContainer";
  iconos = ICONOS;
  roles = ROLES;
  usuarioService = inject(UsuarioService);


  placeholders = PLACEHOLDERS;
  //form reactivo

  formularioRegister:FormGroup = new FormGroup({
    nombre: new FormControl('', Validators.required),
    apellido: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    fechaNacimiento: new FormControl('',Validators.required),
    telefono: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    passwordRepetida: new FormControl('', Validators.required),
  });


  //metodo para crear un usuario
   crearUsuarioDesdeFormulario():UsuarioInterface {
    const nombreForm = this.formularioRegister.get('nombre')?.value ||'';//||'' esto significa que puede ser null
    const apellidoForm = this.formularioRegister.get('apellido')?.value||'';
    const emailForm = this.formularioRegister.get('email')?.value||'';

    const fechaNacimientoForm = this.formularioRegister.get('fechaNacimiento')?.value||'';

    //const fechaNacimientoDate: Date = new Date(fechaNacimientoForm);//lo parseo para que me lo reconozca
    //console.log(fechaNacimientoDate);
    const telefonoForm = this.formularioRegister.get('telefono')?.value||'';
    const passwordForm = this.formularioRegister.get('password')?.value||'';
    const rol = {rol:this.roles.cliente};
    const estado = true;
    return {
      nombre:nombreForm,
      apellido:apellidoForm,
      email:emailForm,
      fechaNacimiento:fechaNacimientoForm,
      telefono:telefonoForm,
      password:passwordForm,
      rolEntidad:rol,
      estado: estado
    };

    /*return { // esto es una forma simplificada, la de arriba es mas legible y con mas ventajas.
      nombre: this.formularioRegister.get('nombre')?.value ?? '', // Si es null o undefined, asigna un string vacío
      apellido: this.formularioRegister.get('apellido')?.value ?? '',
      email: this.formularioRegister.get('email')?.value ?? '',
      telefono: this.formularioRegister.get('telefono')?.value ?? '',
      password: this.formularioRegister.get('password')?.value ?? '',
    };*/
  }
  //metodo POST
  private postUsuarioToBackend(usuario:UsuarioInterface):void{
    try {
      this.usuarioService.postUsuario(usuario).subscribe({
        next:(usuario:UsuarioInterface) =>{

          console.log(usuario);
        },
        error: (error:HttpErrorResponse) =>{
          if (error.status === codigoErrorHttp.NO_ENCONTRADO) {
            alert('Error 404: Usuario no encontrado');

          } else if (error.status === codigoErrorHttp.ERROR_SERVIDOR) {
            alert('Error 500: Error del servidor');

          } else if (error.status === codigoErrorHttp.ERROR_CONTACTAR_SERVIDOR) {
            alert('Error de conexión: No se pudo contactar con el servidor (ERR_CONNECTION_REFUSED)');
          } else if(error.status === codigoErrorHttp.ERROR_REPETIDO){
            alert('Error 409: el usuario ya existe en el sistema');
          } else {
            alert('Error inesperado. Intente otra vez mas tarde.');
          }
      }
      })
    } catch (error) {
      console.error(error);
    }
  }

  // Método para enviar los valores del formulario al backend
  onSubmit() {
    if (this.formularioRegister.valid) {
      console.log('Usuario enviado con exito');
      console.log(this.formularioRegister.value);
      const usuario:UsuarioInterface = this.crearUsuarioDesdeFormulario();
      //console.log(usuario);
      this.postUsuarioToBackend(usuario);
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


}


