import { Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSlideToggleChange, MatSlideToggleModule } from '@angular/material/slide-toggle';
import { PLACEHOLDERS } from '../../../../shared/models/placeholderInicioSesion.constants';
import { ICONOS } from '../../../../shared/models/iconos.constants';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { CredencialInterface } from '../../../../core/interfaces/credencial.interface';
import { ROLES } from '../../../../shared/models/rolesUsuario.constants';
import { NegocioInterface } from '../../../../core/interfaces/negocio-interface';
import Swal from 'sweetalert2';
import { NegocioServiceService } from '../../../../core/services/negocioService/negocio-service.service';
import { HttpErrorResponse } from '@angular/common/http';
import { BotonComponent } from '../../../../shared/components/boton/boton.component';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-configuracion-local',
  standalone: true,
  imports: [MatSlideToggleModule, BotonComponent, MatIconModule,ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatOptionModule, MatSelectModule, CommonModule],
  templateUrl: './configuracion-local.component.html',
  styleUrl: './configuracion-local.component.css'
})
export class ConfiguracionLocalComponent implements OnInit {

negocioService:NegocioServiceService = inject(NegocioServiceService);
route: ActivatedRoute = inject(ActivatedRoute);
nombreNegocio: string = "";
ngOnInit(): void {
  this.obtenerNombreNegocio();
    // this.obtenerNegocio();
}

obtenerNombreNegocio(){



}

// Fuciones para obtener el negocio

// obtenerNegocio(){
//   this.negocioService.getIdNegocioByNombre(this.nombreNegocio).subscribe() =
// }



  placeholders = PLACEHOLDERS;
  iconos = ICONOS;




  //- - - - - - -- - - - --   TOggles de configuraciones - - -- - - - - - - - - - -- - -
  toggleActivo1: boolean = true;
  toggleActivo2: boolean = true;
  toggleActivo3: boolean = true;
cambiarEstadoToggle1(event:MatSlideToggleChange){
      this.toggleActivo1 = event.checked; // Obtiene el estado del toggle desde el evento
}

cambiarEstadoToggle2(event:MatSlideToggleChange){
  this.toggleActivo2 = event.checked; // Obtiene el estado del toggle desde el evento
}

cambiarEstadoToggle3(event:MatSlideToggleChange){
  this.toggleActivo3 = event.checked; // Obtiene el estado del toggle desde el evento
}

//   - - - - - -- - - - - -- - - - - -- -Formulario de modificación de negocio - - - - -- - - - -- - - - -- -

  formularioModificarNegocio:FormGroup = new FormGroup({
    nombre: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    telefono: new FormControl('', Validators.required),
    rubro: new FormControl('', Validators.required),
    calle: new FormControl('', Validators.required),
    altura: new FormControl('', Validators.required),
    detalle: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    passwordRepetida: new FormControl('', Validators.required),
  });

    //metodo para crear un negocio
    obtenerNegocioForm() {

      const credencial:CredencialInterface = {
        email:this.formularioModificarNegocio.get('email')?.value,
        password:this.formularioModificarNegocio.get('password')?.value,
        telefono:this.formularioModificarNegocio.get('telefono')?.value,
        estado:true,
      } ;

        return {
          nombre: this.formularioModificarNegocio.get('nombre')?.value,
          apellido: this.formularioModificarNegocio.get('nombre')?.value,//es igual ya que un negocio no tiene apellido
          fechaNacimiento: new Date().toISOString().slice(0, 10),//fecha de nacimiento por defecto que seria la fecha de hoy
          credencial: credencial,
          rubro: this.formularioModificarNegocio.get('rubro')?.value,
          calle: this.formularioModificarNegocio.get('calle')?.value,
          altura: this.formularioModificarNegocio.get('altura')?.value,
          detalle: this.formularioModificarNegocio.get('detalle')?.value,
          rolUsuario: ROLES.negocio
        }

    }

    // Metodo para registrar un negocio haciendo el click

    registrarNegocio() {

      if(this.formularioModificarNegocio.valid){
        const negocio:NegocioInterface = this.obtenerNegocioForm();
        this.negocioService.postNegocio(negocio).subscribe({
          next:(response) =>{

            //modal de negocio registrado correctamente
            Swal.fire({
              title: 'Negocio registrado correctamente!',
              // text: 'Do you want to continue',
              icon: 'success',
              confirmButtonText: 'Ok'
            })


            //limpiar formulario
            this.formularioModificarNegocio.reset();
          },
          error:(error:HttpErrorResponse) =>{
            const mensaje = error.error['mensaje'];





            if (mensaje.includes("email")) {
              // Agrega el error personalizado al FormControl
              this.formularioModificarNegocio.get('emailRegister')?.setErrors({ emailExiste: true });
            }
            else if (mensaje.includes("telefono")) {
              this.formularioModificarNegocio.get('telefono')?.setErrors({ telefonoExiste: true });
            }
            else if (mensaje.includes["nombreNegocio"]) {
              this.formularioModificarNegocio.get('nombre')?.setErrors({ negocioExiste: true });
            }

          }
        })
      }else{
        this.formularioModificarNegocio.markAllAsTouched();
      }

    }


//- - - - - - - -- - -- - - - Metodos para ocualtr contraseña  -- - - - -- - - -

  ocultarContrasenia = signal(true);
  ocultarContraseniaEvent(event: MouseEvent) {
    this.ocultarContrasenia.set(!this.ocultarContrasenia());
    event.stopPropagation();
  }


//- - - - - -- - - - -- Metodos para cabiar la contraseña- - - -  -- - -
//todo: Sería ideal que este boton de mande

cambiarContrasena(){
alert("Esto debería madarte a todo el fomrulario de cambiar contraseña")
}


//- - - - - - - -- - - - - - - Manejo del combo box - - - - -- - - - -

rubrosControl = new FormControl<String | null>(null, Validators.required);
selectFormControl = new FormControl('', Validators.required);
rubros: String[] = ["Peluquería", "Barbería", "Centro de Estética", "Veterinaria", "Dentista"];

//- - - - - - -- - - - - - - Manejo de errores  -- - - - - - - - -- - - - - -
  formularioModificarNegocioTieneError(campo:string, error:string) {
    return this.formularioModificarNegocio.get(campo)?.hasError(error) && this.formularioModificarNegocio.get(campo)?.touched;
  }

  mostrarMensajeError(error: string) {

    switch (error) {
      case 'required':
        return 'Campo requerido';
      case 'email':
        return 'Email invalido';
      case 'emailExiste':
        return 'Email ya registrado';
      case 'telefonoExiste':
        return 'Nro Telefono ya registrado';
      case 'negocioExiste':
        return 'Nombre de negocio ya registrado';
      case 'maxlength':
        return 'Máximo 15 caracteres';
      case 'pattern':
        return 'Debe contener al menos una letra y un número';
      case 'passwordsDiferentes':
        return 'Las contraseñas no coinciden';
      default:
        return 'Error';
    }

  }

}
