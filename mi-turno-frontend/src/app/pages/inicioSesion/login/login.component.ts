import { ICONOS } from './../../../shared/models/iconos.constants';
import { Component, ElementRef, EventEmitter, inject, OnInit, ViewChild } from '@angular/core';
import { InputComponent } from "../../../shared/components/input/input.component";
import { MatIconModule } from '@angular/material/icon';
import { BotonComponent } from '../../../shared/components/boton/boton.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsuarioService } from '../../../core/services/usuarioService/usuario.service';
import { UsuarioInterface } from '../../../core/interfaces/usuario-interface';
import { throwError } from 'rxjs';
import { PLACEHOLDERS } from '../../../shared/models/placeholderInicioSesion.constants';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [InputComponent, MatIconModule, BotonComponent, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  registerHref: string = "register";
  iconos = ICONOS;

  placeholders = PLACEHOLDERS;

  usuarioService = inject(UsuarioService);
  //form reactivo
  formularioLogin = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required)
  });
  //obtengo los datos del formulario reactivo
  private obtenerDatosForm() {
    const emailForm = this.formularioLogin.get('email')?.value || '';
    const passwordForm = this.formularioLogin.get('password')?.value || '';

    return {
      email: emailForm,
      password: passwordForm
    };
  }


  //permito o deniego el acceso a la pagina
  onSubmit() {
    if (this.formularioLogin.valid) {
      console.log(this.formularioLogin.value);
      try {
        const objetoDelForm = this.obtenerDatosForm();
        this.usuarioService.getUsuariosByEmailAndPassword(objetoDelForm.email, objetoDelForm.password).subscribe({
          next: (response) => {
            console.log(response);
            if(response.rol ==='CLIENTE'){
              //lo mando al DASHBOARD DE PEDIR TURNO
            }else if(response.rol==='PROPIETARIO'){
              //lo mando al DASHBOARD DE LOCAL
            }else if(response.rol==='ADMIN'){
              //lo mando al DASHBOARD DE ADMIN
            }else{
              alert('ROL INEXISTENTE');
            }
          },
          error: (error: HttpErrorResponse) => {
            if (error.status === 404) {
              alert('Error 404: Usuario no encontrado');

            } else if (error.status === 500) {
              alert('Error 500: Error del servidor');

            } else if (error.status === 0) {
              alert('Error de conexión: No se pudo contactar con el servidor (ERR_CONNECTION_REFUSED)');
            } else {
              alert('Error inesperado. Intente otra vez mas tarde.');
            }
          }

        })

      } catch (error) {
        console.log(error);
      }
    } else {
      let campoError: string = '';
      Object.keys(this.formularioLogin.controls).forEach(campo => {
        const control = this.formularioLogin.get(campo);
        if (control?.invalid) {
          campoError += (`${campo} es inválido, `);
        }
      });
      alert(campoError);
    }
  }

}
