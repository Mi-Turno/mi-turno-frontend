import { Component, inject } from '@angular/core';
import {
  MatError,
  MatFormFieldModule,
  MatLabel,
} from '@angular/material/form-field';
import { ICONOS } from '../../../../shared/models/iconos.constants';
import { BotonComponent } from '../../../../shared/components/boton/boton.component';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { NgClass } from '@angular/common';
import Swal from 'sweetalert2';
import { AuthService } from '../../../../core/guards/auth/service/auth.service';
import { ReservarTurnoLocalComponent } from '../../../dashboardLocal/components/reservar-turno-local/reservar-turno-local.component';
import { UsuarioInterface } from '../../../../core/interfaces/usuario-interface';

@Component({
  selector: 'app-cambiar-password-mail',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatIconModule,
    BotonComponent,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
  ],
  templateUrl: './cambiar-password-mail.component.html',
  styleUrl: './cambiar-password-mail.component.css',
})
export class CambiarPasswordMailComponent {
  iconos = ICONOS;
  router: Router = inject(Router);
  authService: AuthService = inject(AuthService);

  //Variables
  mailValido: boolean = false;
  email: string = '';

  //validaciones campos formularios

  solicitarCambioPasssword() {

    this.verificarMail()
    //this.pedirMailValido()

  }



  verificarMail(){
    this.authService.getUsuarioPorEmail(this.email).subscribe({
      next:(response: UsuarioInterface) => {
        console.log(response);
        if(response.credencial.email === this.email){
          this.pedirMailValido();
        }
      },error:(err) => {
        if(err.status === 404){
          Swal.fire({
            title: 'Error',
            text: 'El email ingresado no se encuentra registrado',
            icon: 'error',
            showConfirmButton: true,
            allowOutsideClick: false,
            allowEscapeKey: false,
          });

        }
      console.log(err);
      }
    })
  }


  pedirMailValido() {
    this.authService.postGenerarTokenContrasenia(this.email).subscribe({
      next: (response) => {
        this.mailValido = true;
        this.mensajeDeSeguirPasos();
      },
      error: (err) => {
        this.mailValido = false;
        this.GestionarMailNoVerificado();
        localStorage.setItem('username', this.email)
      },
    });
  }

  mensajeDeSeguirPasos() {
    Swal.fire({
      title: 'Revisa tu correo!',
      text: 'Recibirás un mail con los pasos a seguir',
      icon: 'success',
      showConfirmButton: true,
      allowOutsideClick: false,
      allowEscapeKey: false,
    });
  }

  GestionarMailNoVerificado() {
    //Lo llevo para que pueda poner el codigo
    //lo retorno al main cuando se verifique

    Swal.fire({
      title: 'Correo no verificado!',
      text: 'Redirigiendo a verificar el correo',
      icon: 'warning', // Ícono del mensaje
      timer: 5000, // Duración en milisegundos (5000ms = 5s)
      timerProgressBar: true, // Muestra una barra de progreso
      showConfirmButton: false, // Oculta el botón "OK"
    });

    setTimeout(() => {
      this.RedirigirAVerificarMail();
    }, 5000);
  }

  RedirigirAVerificarMail() {
    this.router.navigateByUrl('/verificacion-email');
  }

  handleClickAtras() {
    this.router.navigateByUrl("/login");
  }

}
