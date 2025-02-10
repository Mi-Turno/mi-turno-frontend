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
import { ModalPreguntaComponent } from "../../../../../shared/components/modal-pregunta/modal-pregunta.component";
import { HttpErrorResponse } from "@angular/common/http";



@Component({
  selector: 'app-pop-up-crear-profesional',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [CommonModule, BotonComponent, ReactiveFormsModule, MatIconModule,MatFormFieldModule, MatInputModule, FormsModule,MatDatepickerModule, ModalPreguntaComponent],
  templateUrl: './pop-up-crear-profesional.component.html',
  styleUrl: './pop-up-crear-profesional.component.css'
})
export class PopUpCrearProfesionalComponent implements OnInit {

//variables

roles = ROLES;
iconos = ICONOS;
placeholders = PLACEHOLDERS;

//servicios
usuarioService = inject(ProfesionalesServiceService);
authService:AuthService = inject(AuthService);

//inputs
@Input() fotoProfesional = "img-default.png";
@Input() textoTitulo:string = "";
@Input() cardSeleccionada?: ProfesionalInterface | null = null;


formularioRegister = new FormGroup ({
  nombre: new FormControl('', Validators.required),
  apellido: new FormControl('', Validators.required),
  email: new FormControl('', [Validators.required, Validators.email]),
  fechaNacimiento: new FormControl('',Validators.required),
  telefono: new FormControl('', Validators.required),
});


idNegocio:number= 0;
ngOnInit(): void {
  this.idNegocio = this.authService.getIdUsuario()!;;
  this.actualizarValores();

}

actualizarValores() {
  this.formularioRegister.patchValue({
    nombre: this.cardSeleccionada?.nombre,
    apellido: this.cardSeleccionada?.apellido,
    email: this.cardSeleccionada?.credencial.email,
    fechaNacimiento: this.cardSeleccionada?.fechaNacimiento,
    telefono: this.cardSeleccionada?.credencial.telefono,
  });
}



crearUnProfesional():ProfesionalInterface {



  const credencial:CredencialInterface = {
    email:this.formularioRegister.get('email')?.value||'',
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

  };
}

private postUsuarioToBackend(usuario:ProfesionalInterface):void{
    this.usuarioService.postProfesionalPorIdNegocio(this.idNegocio,usuario).subscribe({
      next:(usuario:ProfesionalInterface) =>{

      },
      error:(error:HttpErrorResponse)=>{

        if (error.status === codigoErrorHttp.ERROR_SERVIDOR) {
          alert('Error 500: Error del servidor');

        } else if (error.status === codigoErrorHttp.ERROR_CONTACTAR_SERVIDOR) {
          alert('Error de conexión: No se pudo contactar con el servidor (ERR_CONNECTION_REFUSED)');
        } else if(error.status === codigoErrorHttp.ERROR_REPETIDO){
          const mensaje = error.error['mensaje'];

          if (mensaje.includes("email")) {
            // Agrega el error personalizado al FormControl
            this.formularioRegister.get('email')?.setErrors({ emailExiste: true });
          }
          else if (mensaje.includes("telefono")) {
            this.formularioRegister.get('telefono')?.setErrors({ telefonoExiste: true });
          }

        } else {
          alert('Error inesperado. Intente otra vez mas tarde.');
        }
      }
    })

  }


putUsuarioToBackend(idProfesional: number | undefined, idNegocio: number | undefined, ) {
    if (this.formularioRegister.valid) {
      const profesionalActualizado: ProfesionalInterface = this.crearUnProfesional();


      if (idProfesional) {
        this.usuarioService.putUsuarioPorIdNegocio(this.idNegocio!, idProfesional!, profesionalActualizado).subscribe({
          next: (response: ProfesionalInterface) => {
            this.cerrarPopUp();
            window.location.reload();

          },
          error: (e: Error) => {
            console.log(e.message);
          },
        });
      }
    }
}

confirmarUsuario() {
  if (this.formularioRegister.valid) {
    const usuario:ProfesionalInterface = this.crearUnProfesional();

    if(this.cardSeleccionada?.idUsuario){
      this.putUsuarioToBackend(this.cardSeleccionada.idUsuario, this.cardSeleccionada.idNegocio);
    }else{
      this.postUsuarioToBackend(usuario);
    }
    //window.location.reload();
  } else {
    this.formularioRegister.markAllAsTouched();
    // let campoError: string = '';
    // Object.keys(this.formularioRegister.controls).forEach(campo => {
    //   const control = this.formularioRegister.get(campo);
    //   if (control?.invalid) {
    //     campoError += (`${campo} es inválido, `);
    //   }
    // });
    // alert(campoError);
  }

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
  this.modalPregunta.openDialog();
}

manejarRespuesta(respuesta: boolean){
  if (!respuesta) {
    this.eliminarProfesional()
  }
}

eliminarProfesional() {

  if (this.cardSeleccionada?.idUsuario) {
    this.usuarioService.deleteUsuario(this.cardSeleccionada.idNegocio!, this.cardSeleccionada.idUsuario!).subscribe({
      next: (response) => {
        this.cerrarPopUp();

        window.location.reload();
      },
      error(e: Error) {
        console.log(e.message);
      },
    });
  }
  else{
    alert("Todavía no se creo el profesional ");
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
