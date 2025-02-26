import { Component, inject, OnInit, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { BotonComponent } from '../../../../shared/components/boton/boton.component';
import { MatError, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../../core/guards/auth/service/auth.service';
import { CambiarContrasenia } from '../../../../core/interfaces/cambiar-contrasenia.interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cambiar-password-password',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatIconModule,
    BotonComponent,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatError,
  ],
  templateUrl: './cambiar-password-password.component.html',
  styleUrl: './cambiar-password-password.component.css',
})
export class CambiarPasswordPasswordComponent implements OnInit {
  //Injections
  activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  fb: FormBuilder = inject(FormBuilder);
  router:Router = inject(Router);
  authService: AuthService = inject(AuthService);
  
  //Variables
  token: string = '';

  //signals
  ocultarContrasenia = signal(true);
  ocultarContraseniaRepetida = signal(true);

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.token = params['token'];
    });

    if(this.token == undefined){
      this.router.navigateByUrl('/login');
      this.router.navigate(['/login'], { replaceUrl: true });
    }
  }

  //- - -- - - - - - Formulario  - - --  - - -

  formularioRegister: FormGroup = this.fb.nonNullable.group(
    {
      passwordRegister: new FormControl('', Validators.required),
      passwordRepetida: new FormControl('', Validators.required),
    },
    { validators: passwordsIgualesValidator() }
  );

  ObtenerFormulario() {
    this.verificarContrasenia();
  }

  verificarContrasenia() {
    if (
      this.formularioRegister.get('passwordRegister')?.value ===
      this.formularioRegister.get('passwordRepetida')?.value
    ) {
      this.patchContrasenia();
    } else {
    }
  }

  patchContrasenia() {

    const request: CambiarContrasenia = {
      token :this.token,
      password : this.formularioRegister.get('passwordRegister')?.value
    }
    console.log(this.token)
    console.log(this.formularioRegister.get('passwordRegister')?.value);
     
    this.authService.cambiarContrasenia(request).subscribe({
      next:(response) => {
        this.mensajeContraseniaCambaidaConExito();
      }, error:(err) => {
        console.error(err);
      }
    })
  }



  mensajeContraseniaCambaidaConExito(){
        Swal.fire({
          title: 'Contrasña modificada con exito!',
          text: 'Ya puedes cerrar esta pestaña!',
          icon: 'success',
          showConfirmButton: true,
          allowOutsideClick: false,
          allowEscapeKey: false,
          allowEnterKey: false,
        });
  }


  //- - -- - - - - - Funciones de oculatar contrasenia - - --  - - -

  ocultarContraseniaEvent(event: MouseEvent) {
    this.ocultarContrasenia.set(!this.ocultarContrasenia());
    event.stopPropagation();
  }

  ocultarContraseniaRepetidaEvent(event: MouseEvent) {
    this.ocultarContraseniaRepetida.set(!this.ocultarContraseniaRepetida());
    event.stopPropagation();
  }

  handleClickAtras() {
    this.router.navigateByUrl("/login/olvide-password");
  }


  //- - - - - - -- -  - - validaciones campos formularios-  -- - - -- - - -- - -
  tieneErrorPassword(control: string, error: string) {
    const formControl = this.formularioRegister.get(control);
    if (!formControl) {
      return (
        this.formularioRegister.hasError(error) &&
        this.formularioRegister.touched
      );
    }
    return formControl.hasError(error) && formControl.touched;
  }

  tieneErrorFormulario(error: string) {
    return (
      this.formularioRegister.hasError(error) && this.formularioRegister.touched
    );
  }

  //se puede modularizar en un servicio
  mostrarMensajeError(error: string) {
    switch (error) {
      case 'fechaInvalida':
        return 'Fecha de nacimiento inválida';
      case 'required':
        return 'Campo requerido';
      case 'email':
        return 'Email invalido';
      case 'emailExiste':
        return 'Email ya registrado';
      case 'telefonoExiste':
        return 'Nro Telefono ya registrado';
      case 'minlength':
        return 'Mínimo 8 caracteres';
      case 'maxlength':
        return 'Máximo 15 caracteres';
      case 'pattern':
        return 'Debe contener al menos una letra y un número';
      case 'passwordsDiferentes':
        return 'Las contraseñas no coinciden';
      case 'emailOContraseniaIncorrectos':
        return 'Email o Contraseña incorrectos';
      default:
        return 'Error';
    }
  }
}

export function passwordsIgualesValidator(): ValidatorFn {
  return (form: AbstractControl): ValidationErrors | null => {
    const password = form.get('passwordRegister')?.value;
    const passwordRepetida = form.get('passwordRepetida')?.value;

    if (password !== passwordRepetida) {
      return { passwordsDiferentes: true }; // Nombre del error
    }
    return null; // Sin error
  };
}
