import { UsuarioService } from './../../core/services/usuarioService/usuario.service';
import { Component, inject, OnInit, Signal, signal } from '@angular/core';
import { BotonComponent } from "../../shared/components/boton/boton.component";
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { VerificarUsuarioInterface } from '../../core/interfaces/verificar-usuario.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-verificacion-mail',
  standalone: true,
  imports: [BotonComponent,ReactiveFormsModule],
  templateUrl: './verificacion-mail.component.html',
  styleUrl: './verificacion-mail.component.css'
})
export class VerificacionMailComponent {



  fb:FormBuilder = inject(FormBuilder)//Forms reactives
  mensajeReenviandoMail = ""
  usuarioService:UsuarioService = inject(UsuarioService);
  router:Router = inject(Router);

  handleClickAtras() {
    this.router.navigateByUrl("/login");
  }

  //-----------------Formulario de verificacion de email -----------------

  formularioCodigo:FormGroup = this.fb.nonNullable.group({
      codigo: new FormControl('', [Validators.required,Validators.minLength(6),Validators.maxLength(6)]),
  });

  // Método para verificar si un campo tiene un error específico
  tieneErrorFormularioCodigo(controlName: string, errorName: string): boolean {
    const control = this.formularioCodigo.get(controlName);

    if (!control) {
      return false; // Si el control no existe, no hay error
    }

    return control?.hasError(errorName) && control.touched;
  }


  obtenerVerificarUsuarioInterface():VerificarUsuarioInterface{
    const username: string = localStorage.getItem('username') || '';
    const codigoVerificacion: string = this.formularioCodigo.get('codigo')?.value || '';


    return {
      email: username,
      codigo: codigoVerificacion
    } as VerificarUsuarioInterface;
  }

  botonDisabled = signal(false);
  mensajeBoton = signal("Aceptar")
  exito = signal(false);

  handleSubmit(e: Event) {
    e.preventDefault();

    if (this.formularioCodigo.invalid) {
      this.formularioCodigo.markAllAsTouched();
      return;
    }

    this.botonDisabled.set(true);
    this.mensajeBoton.set("Enviando...");

    this.usuarioService.verificarEmail(this.obtenerVerificarUsuarioInterface())
    .subscribe({
      next: (response) => {

        this.exito.set(true);
        this.mensajeBoton.set("Email verificado");

        localStorage.removeItem('username'); //eliminamos el email del localstorage
        setTimeout(() => {

          this.router.navigateByUrl('/login');

        }, 2000);



      },
      error: (error) => {
        this.botonDisabled.set(false);
        this.mensajeBoton.set("Aceptar");

        this.formularioCodigo.get('codigo')?.setErrors({incorrect: true});

        console.error('Error al verificar email:', error);
      },
    });

  }

  handleReenviarCodigo() {
    const username= localStorage.getItem('username') || '';

    if(username.length === 0){
      console.log("username vacio");
      return;
    }

    //this.mensajeReenviandoMail="Reenviando correo con código de verificación...";

    if(this.esperando()){
      console.log("Esperando");
      return;
    }

    this.usuarioService.reenviarCodigoDeVerificacion(username).subscribe({
      next: (response) => {


        this.iniciarContador();
      },
      error: (error) => {
        const mensaje = error.error['mensaje'];
        console.log(mensaje);

        if (mensaje.includes("verificada")) {
          // Agrega el error personalizado al FormControl
          this.formularioCodigo.get('codigo')?.setErrors({ cuentaVerificada: true });
        }
        console.error('Error al reenviar código:', error);
      }
    });
  }

  tiempoRestante: number = 60; // Tiempo de espera en segundos
  esperando = signal(false);
  intervalo: any;

  iniciarContador() {
    this.esperando = signal(true);
    this.tiempoRestante = 60; // Reiniciar el contador cada vez que se hace clic en reenviar

    this.intervalo = setInterval(() => {
      this.mensajeReenviandoMail=`Código reenviado. Tiempo restante para poder reenviar codigo de verificacion: ${this.tiempoRestante } segundos`;
      this.tiempoRestante--;
      if (this.tiempoRestante <= 0) {
        clearInterval(this.intervalo);
        this.esperando = signal(false);
        this.mensajeReenviandoMail="";
      }
    }, 1000);
  }

  mostrarMensajeError(error: string) {

    switch (error) {
      case 'cuentaVerificada':
      return 'Cuenta ya se encuentra verificada';
      case 'incorrect':
        return 'Código incorrecto';
      case 'required':
        return 'Campo requerido';
      case 'minlength':
        return 'Mínimo 6 caracteres';
      case 'maxlength':
        return 'Máximo 6 caracteres';
      default:
        return 'Error';
    }

  }

}
