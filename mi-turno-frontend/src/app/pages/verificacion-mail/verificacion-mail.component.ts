import { UsuarioService } from './../../core/services/usuarioService/usuario.service';
import { Component, inject, signal } from '@angular/core';
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
  loading = signal(false);
  usuarioService:UsuarioService = inject(UsuarioService);
  router:Router = inject(Router);

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
      codigoVerificacion: codigoVerificacion
    } as VerificarUsuarioInterface;
  }

  botonDisabled = signal(false);
  mensajeBoton = signal("Aceptar")

  handleClickBoton() {
    this.botonDisabled.set(false);
    this.mensajeBoton.set("Enviando...");


  }

  handleSubmit(e: Event) {
    e.preventDefault();


    this.usuarioService.verificarEmail(
      this.obtenerVerificarUsuarioInterface()
    ).subscribe({
      next: (response) => {
        this.router.navigateByUrl('/');
        console.log(response, "email verificado!");
        localStorage.removeItem('username'); //eliminamos el email del localstorage
      },
      error: (error) => {
        console.error('Error al verificar email:', error);
      },
    });
    
  }

  handleReenviarCodigo() {
    this.loading.set(true);

    const username= localStorage.getItem('username') || '';

    if(username.length === 0){
      return;
    }

    this.usuarioService.reenviarCodigoDeVerificacion(username).subscribe({
      next: (response) => {
        console.log('Código reenviado:', response);
      },
      error: (error) => {
        console.error('Error al reenviar código:', error);
      },
      complete: () => {
        this.loading.set(false);
      }
    });
  }

  mostrarMensajeError(error: string) {

    switch (error) {
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
