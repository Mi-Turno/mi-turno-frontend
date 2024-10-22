import { ICONOS } from './../../../shared/models/iconos.constants';
import { Component, OnInit } from '@angular/core';
import { InputComponent } from "../../../shared/components/input/input.component";
import { RouterLink } from '@angular/router';
import { BotonComponent } from "../../../shared/components/boton/boton.component";
import { MatIconModule } from '@angular/material/icon';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';



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
    email: new FormControl('', [Validators.required,Validators.email]),
    telefono: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    passwordRepetida: new FormControl('', Validators.required),
  });
    /**const nombreForm = this.formularioRegister.get('nombre').value;
    console.log('Nombre:', nombreValor); */


  // Método para mostrar los valores del formulario
  onSubmit() {
    if (this.formularioRegister.valid) {
      console.log(this.formularioRegister.value);
    } else {
      let campoError:string ='';
      Object.keys(this.formularioRegister.controls).forEach(campo => {
        const control = this.formularioRegister.get(campo);
        if (control?.invalid) {
          campoError +=(`${campo} es inválido, `);
        }
      });
      alert(campoError);
    }
  }

}


