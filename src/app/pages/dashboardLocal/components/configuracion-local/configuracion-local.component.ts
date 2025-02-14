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
import { Rubros } from '../../../../shared/models/rubrosEnum';

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
nombreNegocio: string | null = null;
negocio: NegocioInterface | null= null;
idNegocio: number | undefined = 0;

ngOnInit(): void {
    // Accede al parámetro desde la ruta padre
    this.route.parent?.paramMap.subscribe(params => {
      this.nombreNegocio = params.get('nombreNegocio');
    });

    this.ObtenerNegocioPorNombre();
}


// Fuciones para obtener el negocio

ObtenerNegocioPorNombre() {
  this.negocioService.getIdNegocioByNombre(this.nombreNegocio!).subscribe({
    next: (response: number) => {
      this.negocioService.getNegocioById(response).subscribe({
        next: (negocio: NegocioInterface) => {
          this.negocio = negocio; // Ahora el negocio tiene datos
          this.idNegocio = negocio.idUsuario;

          this.actualizarValores(); // Llamamos a actualizar los valores aquí
        },
        error: (error: Error) => {
          console.error('Error obteniendo el negocio:', error);
        }
      });
    },
    error: (error: Error) => {
      console.error('Error obteniendo ID del negocio:', error);
    }
  });
}







  placeholders = PLACEHOLDERS;
  iconos = ICONOS;




  //- - - - - - -- - - - --   TOggles de configuraciones - - -- - - - - - - - - - -- - -
  toggleActivoMP: boolean = true;
  toggleActivoDebito: boolean = true;
  toggleActivoCredito: boolean = true;
  toggleActivoTransferencia: boolean = true;
  toggleActivoEfectivo: boolean = true;

cambiarEstadoToggleMP(event:MatSlideToggleChange){
      this.toggleActivoMP = event.checked; // Obtiene el estado del toggle desde el evento
}

cambiarEstadoToggleDebito(event:MatSlideToggleChange){
  this.toggleActivoDebito= event.checked; // Obtiene el estado del toggle desde el evento
}

cambiarEstadoToggleCredito(event:MatSlideToggleChange){
  this.toggleActivoCredito = event.checked; // Obtiene el estado del toggle desde el evento
}

cambiarEstadoToggleTransferencia(event:MatSlideToggleChange){
  this.toggleActivoTransferencia = event.checked; // Obtiene el estado del toggle desde el evento
}

cambiarEstadoToggleEfectivo(event:MatSlideToggleChange){
  this.toggleActivoEfectivo = event.checked; // Obtiene el estado del toggle desde el evento
}

//   - - - - - -- - - - - -- - - - - -- -Formulario de modificación de negocio - - - - -- - - - -- - - - -- -

  formularioModificarNegocio:FormGroup = new FormGroup({
    telefono: new FormControl('', Validators.required),
    rubrosControl: new FormControl('', Validators.required),
    calle: new FormControl('', Validators.required),
    altura: new FormControl('', Validators.required),
    detalle: new FormControl('', Validators.required),
  });

    obtenerNegocioForm() {

      const credencial:CredencialInterface = {
        email:this.negocio?.credencial.email!,
        password:this.negocio?.credencial.password!,
        telefono:this.formularioModificarNegocio.get('telefono')?.value,
        estado:true,
      } ;

        return {
          nombre: this.negocio?.nombre || '',
          apellido: this.negocio?.nombre || '', //es igual ya que un negocio no tiene apellido
          fechaNacimiento: this.negocio?.fechaNacimiento || '', //fecha de nacimiento por defecto que seria la fecha de hoy
          credencial: credencial,
          rubro: this.formularioModificarNegocio.get('rubrosControl')?.value,
          calle: this.formularioModificarNegocio.get('calle')?.value,
          altura: this.formularioModificarNegocio.get('altura')?.value,
          detalle: this.formularioModificarNegocio.get('detalle')?.value,
          rolUsuario: this.negocio?.rolUsuario || ''
        }

    }



    actualizarValores() {

      this.formularioModificarNegocio.patchValue({
        telefono: this.negocio?.credencial.telefono,
        rubrosControl: this.negocio?.rubro,
        calle: this.negocio?.calle,
        altura: this.negocio?.altura,
        detalle: this.negocio?.detalle,
      });



    }

    // Metodo para registrar un negocio haciendo el click

    actualizarNegocioBack() {

      if(this.formularioModificarNegocio.valid){
        const negocioForm:NegocioInterface = this.obtenerNegocioForm();
        this.negocioService.putNegocio(this.idNegocio!,negocioForm).subscribe({
          next:(response) =>{
            //modal de negocio registrado correctamente
            Swal.fire({
              title: 'Datos Actualizados Correctamente',
              icon: 'success',
              confirmButtonText: 'Ok'
            })
            //limpiar formulario
          },
          error:(error:HttpErrorResponse) =>{
            const mensaje = error.error['mensaje'];

            if (mensaje.includes("telefono")) {
              this.formularioModificarNegocio.get('telefono')?.setErrors({ telefonoExiste: true });
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
rubros = Object.values(Rubros);
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
