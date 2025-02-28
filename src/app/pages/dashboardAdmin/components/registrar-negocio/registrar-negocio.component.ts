import { Component, inject, signal } from "@angular/core";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { BotonComponent } from "../../../../shared/components/boton/boton.component";
import { MatIconModule } from "@angular/material/icon";
import { ICONOS } from "../../../../shared/models/iconos.constants";
import { ROLES } from "../../../../shared/models/rolesUsuario.constants";
import { PLACEHOLDERS } from "../../../../shared/models/placeholderInicioSesion.constants";
import { NegocioServiceService } from "../../../../core/services/negocioService/negocio-service.service";
import { CredencialInterface } from "../../../../core/interfaces/credencial.interface";
import { NegocioInterface } from "../../../../core/interfaces/negocio-interface";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import Swal from 'sweetalert2'
import { HttpErrorResponse } from "@angular/common/http";
import { Rubros } from "../../../../shared/models/rubrosEnum";
import { MatSelectModule } from "@angular/material/select";
import { MatOptionModule } from "@angular/material/core";
import { CommonModule } from "@angular/common";
import { InputArchivoComponent } from "../../../../shared/components/input-archivo/input-archivo.component";
import { catchError, Observable, of, switchMap, throwError } from "rxjs";
import { codigoErrorHttp } from "../../../../shared/models/httpError.constants";
import { ArchivosServiceService } from "../../../../core/services/archivosService/archivos-service.service";

@Component
({
  selector: 'app-registrar-negocio',
  standalone: true,
  imports: [ReactiveFormsModule, BotonComponent, MatIconModule, MatFormFieldModule, MatInputModule, FormsModule, MatSelectModule, MatOptionModule, CommonModule, InputArchivoComponent],
  templateUrl: './registrar-negocio.component.html',
  styleUrl: './registrar-negocio.component.css'
})
export class RegistrarNegocioComponent {

  claseAppInput: string = "claseAppInput";
  inputContainer: string = "inputContainer";
  iconos = ICONOS;
  roles = ROLES;
  //services
  negocioService:NegocioServiceService = inject(NegocioServiceService);
  archivosService: ArchivosServiceService = inject(ArchivosServiceService);

  placeholders = PLACEHOLDERS;
  //---------------------------Formulario de registro de negocio---------------------------

  formularioRegisterNegocio:FormGroup = new FormGroup({
    nombre: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    telefono: new FormControl('', Validators.required),
    rubrosControl: new FormControl('', Validators.required),
    calle: new FormControl('', Validators.required),
    altura: new FormControl('', Validators.required),
    detalle: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    passwordRepetida: new FormControl('', Validators.required),
  });


  //metodo para crear un negocio
  obtenerNegocioForm() {

    const credencial:CredencialInterface = {
      email:this.formularioRegisterNegocio.get('email')?.value,
      password:this.formularioRegisterNegocio.get('password')?.value,
      telefono:this.formularioRegisterNegocio.get('telefono')?.value,
      estado:true,
    } ;

      return {
        nombre: this.formularioRegisterNegocio.get('nombre')?.value,
        apellido: this.formularioRegisterNegocio.get('nombre')?.value,//es igual ya que un negocio no tiene apellido
        fechaNacimiento: new Date().toISOString().slice(0, 10),//fecha de nacimiento por defecto que seria la fecha de hoy
        credencial: credencial,
        rubro: this.formularioRegisterNegocio.get('rubrosControl')?.value,
        calle: this.formularioRegisterNegocio.get('calle')?.value,
        altura: this.formularioRegisterNegocio.get('altura')?.value,
        detalle: this.formularioRegisterNegocio.get('detalle')?.value,
        rolUsuario: ROLES.negocio,
        fotoPerfil: this.formularioRegisterNegocio.get('fotoPerfil')?.value
      }

  }



  // Metodo para registrar un negocio haciendo el click

  registrarNegocio() {

    if(this.formularioRegisterNegocio.valid){
      const negocio:NegocioInterface = this.obtenerNegocioForm();
      let negocioObservable: Observable<NegocioInterface> = this.postNegocioToBackend(negocio);

      negocioObservable.pipe(
            switchMap((response: NegocioInterface) => {
              if (response.idUsuario) {
                return this.verificarFotoPerfil(response.idUsuario); // Retorna un Observable para encadenarlo
              }
              return of(null); // Si no hay idUsuario, se retorna un Observable vacío
            })
          ).subscribe({
            next: () => {
              //modal de negocio registrado correctamente
              Swal.fire({
                title: 'Negocio registrado correctamente!',
                icon: 'success',
                confirmButtonText: 'Ok'
              })

              this.resetFormulario();
            },
            error: (error) => {
              console.error("Error en el proceso de guardar al negocio:", error);
            }
          });


    }else{
      this.formularioRegisterNegocio.markAllAsTouched();
    }

  }

  postNegocioToBackend(negocio:NegocioInterface): Observable<NegocioInterface>{
    return this.negocioService.postNegocio(negocio)
    .pipe(catchError((error) => this.manejarErrores(error)));
  }

  resetFormulario(): void {
    this.formularioRegisterNegocio.reset({
      nombre: '',
      servicio: { value: '' },
      profesional: { value: '' },
      metodoPago: { value: ''},
      fechaTurno: { value: '' },
      horaTurno: { value: '' },
      fotoPerfil: { value: null}
    });
    this.eliminarArchivo();
    // Opcional: Marcar el formulario como "pristine" y "untouched" para que no aparezcan errores
    this.formularioRegisterNegocio.markAsPristine();
    this.formularioRegisterNegocio.markAsUntouched();
  }


  //-------------- Archivos --------------
quiereEliminarArchivo:boolean = false
fotoNegocio: string | File | undefined = "img-default.png";
archivoSeleccionado:File | null = null;
seleccionoUnArchivo:boolean = true;



postArchivoToBackend(idProfesional:number, archivoNuevo:File): Observable<Boolean>{

  return this.archivosService.postArchivoUsuario(idProfesional,archivoNuevo,)
  .pipe(catchError((error) => this.manejarErrores(error)));
}



seleccionarArchivo(archivoNuevo:File): void{

  if(archivoNuevo.size > 0  && archivoNuevo != null){

    this.archivoSeleccionado = archivoNuevo;
    this.quiereEliminarArchivo = false;
    this.formularioRegisterNegocio.patchValue({
      fotoPerfil:this.archivoSeleccionado
    })

    this.fotoNegocio = URL.createObjectURL(this.archivoSeleccionado);

  }

}

eliminarArchivo(event?:Event):void{

  this.fotoNegocio = "img-default.png";
  this.archivoSeleccionado = null;
  this.formularioRegisterNegocio.patchValue({
    fotoPerfil:null
  })

}


verificarFotoPerfil(idUsuario: number | null): Observable<Boolean | null>{
  //verifico si existe el id
  if(idUsuario){
    //verifico si se selecciono un archivo
    if(this.archivoSeleccionado){
      return this.postArchivoToBackend(idUsuario, this.archivoSeleccionado);
    }
  }
  return of(null)
}


  //metodos para ocultar las contraseñas

  ocultarContrasenia = signal(true);
  ocultarContraseniaEvent(event: MouseEvent) {
    this.ocultarContrasenia.set(!this.ocultarContrasenia());
    event.stopPropagation();
  }

  ocultarContraseniaRepetida = signal(true);
  ocultarContraseniaRepetidaEvent(event: MouseEvent) {
    this.ocultarContraseniaRepetida.set(!this.ocultarContraseniaRepetida());
    event.stopPropagation();
  }

//----------------Logica de rubros--------------

rubros = Object.values(Rubros);

inputOtroRubro: string = '';

otroRubroFlag: boolean = false;
onSelectionChange(event: any) {
  if (event.value !== Rubros.OTRO.toString()) {
    this.otroRubroFlag = false;
    this.inputOtroRubro = ''; // Reset input si no elige "Otro"
  }else{
    this.otroRubroFlag = true;
  }
}

setCustomValue(value: string) {
  if (value.trim() !== '' && value) {
    this.inputOtroRubro = value; // Se asigna el valor ingresado al select
    this.formularioRegisterNegocio.get('rubrosControl')?.setValue(this.inputOtroRubro);
  }else{

    this.inputOtroRubro = '';
    this.formularioRegisterNegocio.get('rubrosControl')?.setErrors({ required: true });
  }
}

  //--------------verificacion de errores en el formulario----------------

  private manejarErrores(error: HttpErrorResponse) {
    console.log(error.status);
    switch (error.status) {
      case codigoErrorHttp.ERROR_SERVIDOR:
        alert('Error 500: Error del servidor');
        break;
      case 0:
        alert('Error de conexión: No se pudo contactar con el servidor (ERR_CONNECTION_REFUSED)');
      break;
      case codigoErrorHttp.ERROR_REPETIDO:
        const mensaje = error.error['mensaje'];

        if (mensaje.includes("email")) {
          // Agrega el error personalizado al FormControl
          this.formularioRegisterNegocio.get('emailRegister')?.setErrors({ emailExiste: true });
        }
        else if (mensaje.includes("telefono")) {
          this.formularioRegisterNegocio.get('telefono')?.setErrors({ telefonoExiste: true });
        }
        else if (mensaje.includes["nombreNegocio"]) {
          this.formularioRegisterNegocio.get('nombre')?.setErrors({ negocioExiste: true });
        }

      break;
      case codigoErrorHttp.NO_ENCONTRADO:
        console.log("Not found");
      break;
      default:
        alert('Error inesperado. Intente más tarde.');
      break;

    }

    return throwError(() => error);

  }

  formularioRegisterNegocioTieneError(campo:string, error:string) {
    return this.formularioRegisterNegocio.get(campo)?.hasError(error) && this.formularioRegisterNegocio.get(campo)?.touched;
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
