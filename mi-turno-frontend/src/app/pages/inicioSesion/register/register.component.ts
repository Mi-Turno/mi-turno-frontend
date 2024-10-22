import { ICONOS } from './../../../shared/models/iconos.constants';
import { Component, inject, OnInit } from '@angular/core';
import { InputComponent } from "../../../shared/components/input/input.component";
import { RouterLink } from '@angular/router';
import { BotonComponent } from "../../../shared/components/boton/boton.component";
import { MatIconModule } from '@angular/material/icon';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsuarioInterface } from '../../../core/interfaces/usuario-interface';
import { UsuarioService } from '../../../core/services/usuarioService/usuario.service';



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
  usuarioService = inject(UsuarioService);

  placeholders = {
    nombre: "Nombre",
    apellido: "Apellido",
    email: "Email",
    telefono: "Teléfono móvil",
    contrasenia: "Contraseña",
    repetirContrasenia: "Repetir Contraseña",
  }
  //form reactivo
  formularioRegister = new FormGroup({
    nombre: new FormControl('', Validators.required),
    apellido: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    telefono: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    passwordRepetida: new FormControl('', Validators.required),
  });


  //metodo para crear un usuario
   crearUsuarioDesdeFormulario():UsuarioInterface {
    const nombreForm = this.formularioRegister.get('nombre')?.value ||'';//||'' esto significa que puede ser null
    const apellidoForm = this.formularioRegister.get('apellido')?.value||'';
    const emailForm = this.formularioRegister.get('email')?.value||'';
    const telefonoForm = this.formularioRegister.get('telefono')?.value||'';
    const passwordForm = this.formularioRegister.get('password')?.value||'';
    const passwordRepetidaForm = this.formularioRegister.get('passwordRepetida')?.value||'';
    const rol = 'CLIENTE';
    return {
      nombre:nombreForm,
      apellido:apellidoForm,
      email:emailForm,
      telefono:telefonoForm,
      password:passwordForm,
      passwordRepetida:passwordRepetidaForm,
      rol:rol
    };

    /*return { // esto es una forma simplificada, la de arriba es mas legible y con mas ventajas.
      nombre: this.formularioRegister.get('nombre')?.value ?? '', // Si es null o undefined, asigna un string vacío
      apellido: this.formularioRegister.get('apellido')?.value ?? '',
      email: this.formularioRegister.get('email')?.value ?? '',
      telefono: this.formularioRegister.get('telefono')?.value ?? '',
      password: this.formularioRegister.get('password')?.value ?? '',
      passwordRepetida: this.formularioRegister.get('passwordRepetida')?.value ?? ''
    };*/
  }
  //metodo POST
  private postUsuarioToBackend(usuario:UsuarioInterface): void{
    try {
      this.usuarioService.postUsuario(usuario).subscribe({
        next:(usuario) =>{
          usuario
        },
        error:(error)=>{
          console.error(error);
        }
      })
    } catch (error) {
      console.error(error);
    }
  }

  // Método para enviar los valores del formulario al backend
  onSubmit() {
    if (this.formularioRegister.valid) {
      console.log(this.formularioRegister.value);
      const usuario:UsuarioInterface = this.crearUsuarioDesdeFormulario();
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


