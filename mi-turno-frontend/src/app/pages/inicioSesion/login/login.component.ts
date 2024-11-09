import { ICONOS } from './../../../shared/models/iconos.constants';
import { Component, ElementRef, EventEmitter, inject, numberAttribute, OnInit, ViewChild } from '@angular/core';
import { InputComponent } from "../../../shared/components/input/input.component";
import { MatIconModule } from '@angular/material/icon';
import { BotonComponent } from '../../../shared/components/boton/boton.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsuarioService } from '../../../core/services/usuarioService/usuario.service';
import { UsuarioInterface } from '../../../core/interfaces/usuario-interface';
import { throwError } from 'rxjs';
import { PLACEHOLDERS } from '../../../shared/models/placeholderInicioSesion.constants';
import { HttpErrorResponse } from '@angular/common/http';
import { codigoErrorHttp } from '../../../shared/models/httpError.constants';
import { ROLES } from '../../../shared/models/rolesUsuario.constants';
import { routes } from '../../../app.routes';
import { Router } from '@angular/router';
import { ClienteService } from '../../../core/services/clienteService/cliente.service';

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

  clienteService = inject(ClienteService);
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
  verificarErrorHttp(error: HttpErrorResponse) {
    if (error.status === codigoErrorHttp.NO_ENCONTRADO) {
      alert('Error 404: Usuario no encontrado');

    } else if (error.status === codigoErrorHttp.ERROR_SERVIDOR) {
      alert('Campos invalidos. ¡Si aun no tiene una cuenta creesela aqui abajo!');

    } else if (error.status === codigoErrorHttp.ERROR_CONTACTAR_SERVIDOR) {
      alert('Error de conexión: No se pudo contactar con el servidor (ERR_CONNECTION_REFUSED)');
    } else if (error.status === codigoErrorHttp.ERROR_REPETIDO) {
      alert('Error 409: Usuario ya existe en el sistema');
    } else {
      alert('Error inesperado. Intente otra vez mas tarde.');
    }
  }
  constructor(private router: Router) { }

  //permito o deniego el acceso a la pagina
  onSubmit() {
    if (this.formularioLogin.valid) {
      console.log(this.formularioLogin.value);
      const objetoDelForm = this.obtenerDatosForm();
      /**PASO 1: CON ESTO VALIDO EL EMAIL Y LA CONTRASEÑA(ES UN POST YA QUE NO PUEDO ENVIAR CONTRASEÑAS POR EL URI) */
      this.clienteService.getClienteByEmailAndPassword(objetoDelForm.email, objetoDelForm.password).subscribe({
        next: (usuarioResponse: UsuarioInterface) => {
          console.log(usuarioResponse);
          console.log(usuarioResponse.idRolUsuario);
          if (usuarioResponse.idRolUsuario == 2 || usuarioResponse.idRolUsuario == ROLES.cliente || usuarioResponse.idRolUsuario == 3|| usuarioResponse.idRolUsuario == ROLES.profesional) {
            this.router.navigate([`/negocios/mi-turno/pedir-turno`]);//${this.nombreNegocio} //todo va esto para la IDE DINAMICA PERO TENGO QUE AGREGAR UN GET CLIENTEXNEGOCIO PARA SABER A CUAL NEGOCIO MANDARLO
            //lo mando al DASHBOARD DE PEDIR TURNO
          } else if (usuarioResponse.idRolUsuario === 4||usuarioResponse.idRolUsuario === ROLES.negocio) {
            //lo mando al DASHBOARD DE LOCAL
            this.router.navigate([`/negocios/mi-turno`]);
          } else if (usuarioResponse.idRolUsuario === 1 || usuarioResponse.idRolUsuario === ROLES.admin) {
            //lo mando al DASHBOARD DE ADMIN
          } else {
            console.log('ROL INEXISTENTE');
          }
        },
        error: (error: HttpErrorResponse) => {
          this.verificarErrorHttp(error);
        }

      })
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
