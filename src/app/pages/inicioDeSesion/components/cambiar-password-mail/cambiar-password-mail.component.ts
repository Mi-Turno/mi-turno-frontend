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
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
  emailIngresado:string = "";
  fb: FormBuilder = inject(FormBuilder)//Forms reactives

  formularioEmail: FormGroup = this.fb.nonNullable.group({
    email: new FormControl('',[Validators.required,Validators.email]),
  })
  //validaciones campos formularios

  solicitarCambioPasssword() {

    if(this.formularioEmail.valid){
      this.emailIngresado = this.formularioEmail.get('email')?.value;



      this.enviarMailCambioPasswordToBackend(this.emailIngresado);
    }
    else{
      this.formularioEmail.markAllAsTouched();
    }
  }

  enviarMailCambioPasswordToBackend(email:string) {
    this.authService.postGenerarTokenContrasenia(email).subscribe({
      next: (response) => {

        this.mensajeDeSeguirPasos();



      },
      error: (error) => {
        const mensaje = error.error['mensaje'];

        if(mensaje.includes('Email no fue encontrado en el sistema')){

          this.formularioEmail.get('email')?.setErrors({ emailNoExiste: true });

        }else if(mensaje.includes('El correo del usuario no esta verificado')){

          this.formularioEmail.get('email')?.setErrors({ emailNoVerificado: true });
          this.GestionarMailNoVerificado();
          localStorage.setItem('username', this.emailIngresado)
        }




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
      allowEnterKey: false,
    }).then((result)=>{

      if(result.isConfirmed){

        this.router.navigateByUrl("/login")
      }
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

  //error

  //validaciones campos formularios
  tieneErrorLogin(control: string, error: string) {
    return (this.formularioEmail.get(control) as FormControl).hasError(error) && (this.formularioEmail.get(control) as FormControl).touched;
  }

  mostrarMensajeError(error: string) {
    switch (error) {
      case 'emailNoVerificado':
        return 'Email no verificado';
      case 'required':
        return 'Campo requerido';
      case 'email':
        return 'Correo invalido';
      case 'emailNoExiste':
        return 'Correo no existe';
      default:
        return 'Error';
    }
  }
}
