import { CommonModule } from "@angular/common";
import { Component, EventEmitter, inject, Input, OnInit, Output, ViewChild } from "@angular/core";
import { provideNativeDateAdapter } from "@angular/material/core";
import { BotonComponent } from "../../../../../shared/components/boton/boton.component";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatIconModule } from "@angular/material/icon";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { ROLES } from "../../../../../shared/models/rolesUsuario.constants";
import { ICONOS } from "../../../../../shared/models/iconos.constants";
import { PLACEHOLDERS } from "../../../../../shared/models/placeholderInicioSesion.constants";
import { ProfesionalesServiceService } from "../../../../../core/services/profesionalService/profesionales-service.service";
import { ProfesionalInterface } from "../../../../../core/interfaces/profesional-interface";
import { CredencialInterface } from "../../../../../core/interfaces/credencial.interface";
import { codigoErrorHttp } from "../../../../../shared/models/httpError.constants";
import { AuthService } from "../../../../../core/guards/auth/service/auth.service";
import { HttpErrorResponse } from "@angular/common/http";
import { ModalPreguntaComponent } from "../../../../../shared/components/modal-pregunta/modal-pregunta.component";
import { InputArchivoComponent } from "../../../../../shared/components/input-archivo/input-archivo.component";
import { ArchivosServiceService } from "../../../../../core/services/archivosService/archivos-service.service";
import { catchError, forkJoin, Observable, of, switchMap, throwError } from "rxjs";
import { UsuarioInterface } from "../../../../../core/interfaces/usuario-interface";
import { entidadEnum } from "../../../../../shared/models/entidadEnum";



@Component({
  selector: 'app-pop-up-crear-profesional',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [CommonModule, BotonComponent, ReactiveFormsModule, MatIconModule, MatFormFieldModule, MatInputModule, FormsModule, MatDatepickerModule, ModalPreguntaComponent, InputArchivoComponent],
  templateUrl: './pop-up-crear-profesional.component.html',
  styleUrl: './pop-up-crear-profesional.component.css'
})
export class PopUpCrearProfesionalComponent implements OnInit {

//variables

roles = ROLES;
iconos = ICONOS;
placeholders = PLACEHOLDERS;

//servicios
profesionalService = inject(ProfesionalesServiceService);
authService:AuthService = inject(AuthService);
archivosService:ArchivosServiceService = inject(ArchivosServiceService);

//inputs
@Input() fotoProfesional: string | File | undefined; //string para img-default
@Input() textoTitulo:string = "";
@Input() cardSeleccionada?: ProfesionalInterface | null;

//variables
esNuevoProfesional:boolean = false;
idNegocio:number= 0;

formularioRegister = new FormGroup ({
  nombre: new FormControl('', Validators.required),
  apellido: new FormControl('', Validators.required),
  email: new FormControl('', [Validators.required, Validators.email]),
  fechaNacimiento: new FormControl('',Validators.required),
  telefono: new FormControl('', Validators.required),
  fotoPerfil: new FormControl()
});


ngOnInit(): void {
  this.idNegocio = this.authService.getIdUsuario()!;
  this.actualizarValores();

}

actualizarValores() {

  if(this.cardSeleccionada == null){
    this.esNuevoProfesional = true;
    this.fotoProfesional = "img-default.png";
  }else{

    this.formularioRegister.patchValue({
      nombre: this.cardSeleccionada?.nombre,
      apellido: this.cardSeleccionada?.apellido,
      email: this.cardSeleccionada?.credencial.email,
      fechaNacimiento: this.cardSeleccionada?.fechaNacimiento,
      telefono: this.cardSeleccionada?.credencial.telefono,
      fotoPerfil: this.cardSeleccionada?.fotoPerfil,
    });


    if(this.cardSeleccionada?.fotoPerfil){
      //mostramos la foto de perfil en el formulario
      this.fotoProfesional = this.cardSeleccionada?.fotoPerfil;
    }else{
      this.fotoProfesional = "img-default.png";
    }


  }



}

crearUnProfesional():ProfesionalInterface {

  const credencial:CredencialInterface = {
    email:this.formularioRegister.get('email')?.value||'',
    //Todo: cambiar la contraseña por defecto, a una generada aleatoriamente
    password:"profesional",
    telefono:this.formularioRegister.get('telefono')?.value||'',
    estado:true
  } ;
  return {
    nombre:this.formularioRegister.get('nombre')?.value||'',
    apellido:this.formularioRegister.get('apellido')?.value||'',
    fechaNacimiento:this.formularioRegister.get('fechaNacimiento')?.value||'',
    credencial:credencial,
    rolUsuario:ROLES.profesional,
    fotoPerfil:this.formularioRegister.get('fotoPerfil')?.value|| null,
  };
}

private postUsuarioToBackend(usuario:ProfesionalInterface): Observable<UsuarioInterface> {

  return this.profesionalService.postProfesionalPorIdNegocio(this.idNegocio,usuario)
  .pipe(catchError((error) => this.manejarErrores(error))); // Manejo de errores
}

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
        this.formularioRegister.get('email')?.setErrors({ emailExiste: true });
      } else if (mensaje.includes("telefono")) {
        this.formularioRegister.get('telefono')?.setErrors({ telefonoExiste: true });
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

putUsuarioToBackend(idProfesional: number, idNegocio: number): Observable<UsuarioInterface>{
  const profesionalActualizado: ProfesionalInterface = this.crearUnProfesional();
  return this.profesionalService.putUsuarioPorIdNegocio(idNegocio, idProfesional, profesionalActualizado)
  .pipe(catchError((error) => this.manejarErrores(error)));

}


confirmarUsuario() {
  if (this.formularioRegister.valid) {

    let usuarioObservable;

    if (this.cardSeleccionada?.idUsuario) {
      // Si el usuario ya existe, actualizarlo con PUT
      usuarioObservable = this.putUsuarioToBackend(this.cardSeleccionada.idUsuario, this.idNegocio);
    } else {
      // Si no existe, crearlo con POST
      const usuario: ProfesionalInterface = this.crearUnProfesional();
      usuarioObservable = this.postUsuarioToBackend(usuario);
    }



    usuarioObservable.pipe(
      switchMap((response: UsuarioInterface) => {
        if (response.idUsuario) {
          return this.verificarFotoPerfil(response.idUsuario); // Retorna un Observable para encadenarlo
        }
        return of(null); // Si no hay idUsuario, se retorna un Observable vacío
      })
    ).subscribe({
      next: () => {
        this.cerrarPopUp();
        window.location.reload();
      },
      error: (error) => {
        // console.error("Error en el proceso de guardar al profesional:", error);
      }
    });

  } else {
    this.formularioRegister.markAllAsTouched();
  }

}

verificarFotoPerfil(idUsuario: number | null): Observable<Boolean | null>{
  //verifico si existe el id
  if(idUsuario){

    //verifico si se selecciono un archivo o quiere eliminar
    if(this.archivoSeleccionado){
      const asd = this.archivoSeleccionado == this.cardSeleccionada?.fotoPerfil

      console.log("SON IGUALES: "+asd);
      //verifico si el archivo seleccionado es distinto al que ya tenia, para no subirlo de nuevo
      if(URL.createObjectURL(this.archivoSeleccionado) != this.cardSeleccionada?.fotoPerfil){

        return this.postArchivoToBackend(idUsuario, this.archivoSeleccionado);

      }
    }

    if(this.quiereEliminarArchivo){
      return this.eliminarArchivoBackend(idUsuario);
    }



  }
  return of(null)
}






//--------------archivo----------------
archivoSeleccionado:File | null = null;

postArchivoToBackend(idProfesional:number, archivoNuevo:File): Observable<Boolean>{

  return this.archivosService.postArchivo(idProfesional,archivoNuevo,entidadEnum.USUARIO.toString())
  .pipe(catchError((error) => this.manejarErrores(error)));
}


seleccionarArchivo(archivoNuevo:File): void{



  if(archivoNuevo.size > 0  && archivoNuevo != null){

    this.archivoSeleccionado = archivoNuevo;
    this.quiereEliminarArchivo = false;

    this.formularioRegister.patchValue({
      fotoPerfil:this.archivoSeleccionado
    })

    this.fotoProfesional = URL.createObjectURL(this.archivoSeleccionado);

  }

}

private eliminarArchivoBackend(idProfesional:number):Observable<Boolean>{
  return this.archivosService.eliminarArchivo(idProfesional)
  .pipe(catchError((error) => this.manejarErrores(error)));
}

quiereEliminarArchivo:boolean = false

eliminarArchivo(event:Event):void{

  this.fotoProfesional = "img-default.png";
  this.quiereEliminarArchivo = true;
  this.archivoSeleccionado = null;
  this.formularioRegister.patchValue({
    fotoPerfil:null
  })
}



//--------------emisores de eventos----------------



@Output() desactivarOverlay: EventEmitter<void> = new EventEmitter<void>();
@Output() activarHorarios: EventEmitter<void> = new EventEmitter<void>();
@Output() cardActual: EventEmitter<ProfesionalInterface> = new EventEmitter<ProfesionalInterface>();
@Output() activarServicios: EventEmitter<void> = new EventEmitter<void>();

cerrarPopUp() {
  this.desactivarOverlay.emit();
  if(this.cardSeleccionada){
    this.cardActual.emit(this.cardSeleccionada);
  }
}

abrirServicios() {
  if(this.cardSeleccionada?.idUsuario) { //todo: Hay que poner el otro pop up
    this.cerrarPopUp();
    this.activarServicios.emit();
    }else {
      alert("Todavía no se creo el usuario");
    }
}
abrirDiasYHorarios() {
  if(this.cardSeleccionada?.idUsuario) {
  this.cerrarPopUp();
  this.activarHorarios.emit();
  }else {
    alert("Todavía no se creo el usuario");
  }


}


//Eliminar profesional con modal

@ViewChild(ModalPreguntaComponent) modalPregunta!: ModalPreguntaComponent;


preguntaEliminar = "¿Desea eliminar a " + this.cardSeleccionada?.nombre  +"?";
abrirModal(){
  if (this.cardSeleccionada?.idUsuario) {
  this.modalPregunta.openDialog();
  }else
  alert("No se creo el profesional todavia")


}

manejarRespuesta(respuesta: boolean){
  if (!respuesta) {
    this.eliminarProfesional()
  }
}

eliminarProfesional() {

  if (this.cardSeleccionada?.idUsuario) {

    this.profesionalService.deleteUsuario(this.cardSeleccionada.idNegocio!, this.cardSeleccionada.idUsuario!).subscribe({
      next: (response) => {
        this.cerrarPopUp();

        window.location.reload();
      },
      error(e: Error) {
        console.log(e.message);
      },
    });
  }

}


//--------------verificacion de errores en el formulario----------------

formularioRegisterTieneError(campo:string, error:string) {
  return this.formularioRegister.get(campo)?.hasError(error) && this.formularioRegister.get(campo)?.touched;
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
