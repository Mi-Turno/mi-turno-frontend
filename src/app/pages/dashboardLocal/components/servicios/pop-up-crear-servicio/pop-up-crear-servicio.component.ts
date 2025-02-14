import { CommonModule } from "@angular/common";
import { Component, EventEmitter, inject, Input, OnInit, Output, ViewChild } from "@angular/core";
import { BotonComponent } from "../../../../../shared/components/boton/boton.component";
import { InputComponent } from "../../../../../shared/components/input/input.component";
import { MatIcon, MatIconModule } from "@angular/material/icon";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { ICONOS } from "../../../../../shared/models/iconos.constants";
import { PLACEHOLDERS } from "../../../../../shared/models/placeholderInicioSesion.constants";
import { ServicioServiceService } from "../../../../../core/services/servicioService/servicio-service.service";
import { ServicioInterface } from "../../../../../core/interfaces/servicio-interface";
import { Router } from "@angular/router";
import { HttpErrorResponse } from "@angular/common/http";
import { codigoErrorHttp } from "../../../../../shared/models/httpError.constants";
import { AuthService } from '../../../../../core/guards/auth/service/auth.service';
import { ModalPreguntaComponent } from "../../../../../shared/components/modal-pregunta/modal-pregunta.component";

@Component({
  selector: 'app-pop-up-crear-servicio',
  standalone: true,
  imports: [
    CommonModule,
    BotonComponent,
    MatIcon,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    ModalPreguntaComponent
  ],
  templateUrl: './pop-up-crear-servicio.component.html',
  styleUrl: './pop-up-crear-servicio.component.css',
})
export class PopUpCrearServicioComponent implements OnInit {

  //variables

  iconos = ICONOS;
  placeholders = PLACEHOLDERS;
  tipoPopUp = 'servicios';

  //Servicios
  servicioService: ServicioServiceService = inject(ServicioServiceService);
  authService: AuthService = inject(AuthService);
  //inputs

  @Input() fotoServicio = 'img-default.png'; //poner imagen de un servicio
  @Input() estadoPopUp: boolean = true;
  @Input() textoTitulo: string = '';
  @Input() cardSeleccionada: ServicioInterface | null = null;
  //outputs

  @Output() desactivarOverlay: EventEmitter<void> = new EventEmitter<void>();

  cerrarPopUp() {

    this.estadoPopUp = false;
    this.desactivarOverlay.emit();
  }

  formularioServicio = new FormGroup({
    nombre: new FormControl('', Validators.required),
    duracion: new FormControl('', [Validators.required, Validators.min(0)]),
    precio: new FormControl('', Validators.required),
  });
  idNegocio: number = 0;
  ngOnInit(): void {
    this.idNegocio = this.authService.getIdUsuario()!;
    this.actualizarValores();
  }

  actualizarValores() {
    this.formularioServicio.patchValue({
      nombre: this.cardSeleccionada?.nombre,
      duracion: this.cardSeleccionada?.duracion?.toString(),
      precio: this.cardSeleccionada?.precio?.toString(),
    });

  }

  crearUnServicio(): ServicioInterface {
    const nombre: string = this.formularioServicio.get('nombre')?.value || '';
    const duracion = parseFloat(
      this.formularioServicio.get('duracion')?.value || '0'
    );
    const precio = parseFloat(
      this.formularioServicio.get('precio')?.value || '0'
    );
    return {
      nombre,
      duracion,
      precio,
    };
  }
  constructor(private router: Router) { }

  postServicioToBackend() {
    if (this.formularioServicio.valid) {
      const servicioNuevo: ServicioInterface = this.crearUnServicio();

      this.servicioService.postCrearUnServicio(servicioNuevo, this.idNegocio).subscribe({//todo deberia tener el id del negocio
        next: (response) => {
          this.cerrarPopUp();
          window.location.reload();

        },
        error: (error: HttpErrorResponse) => {
          if (error.status === codigoErrorHttp.NO_ENCONTRADO) {
            alert('Error 404: Servicio no encontrado');
          } else if (error.status === codigoErrorHttp.ERROR_SERVIDOR) {
            alert('Error 500: Error del servidor');
          } else if (
            error.status === codigoErrorHttp.ERROR_CONTACTAR_SERVIDOR
          ) {
            alert(
              'Error de conexión: No se pudo contactar con el servidor (ERR_CONNECTION_REFUSED)'
            );
          } else if (error.status === codigoErrorHttp.ERROR_REPETIDO) {
            alert('Error 409: Servicio ya existe en el sistema');
          } else {
            alert('Error inesperado. Intente otra vez mas tarde.');
          }
        },
      });
    } else {
      let campoError: string = '';
      Object.keys(this.formularioServicio.controls).forEach((campo) => {
        const control = this.formularioServicio.get(campo);
        if (control?.invalid) {
          campoError += `${campo} es inválido, `;
        }
      });
    }
  }

  putServicio(idServicio: number | undefined, idNegocio: number | undefined) {

    if (this.formularioServicio.valid) {
      const servicioActualizado: ServicioInterface = this.crearUnServicio();
      if (idServicio) {
        this.servicioService.putServicio(idServicio!, idNegocio!, servicioActualizado).subscribe({
          next: (response) => {
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

//Eliminar Servicio
@ViewChild(ModalPreguntaComponent) modalPregunta!: ModalPreguntaComponent;
preguntaEliminar = "¿Desea eliminar el servicio " + this.cardSeleccionada?.nombre + "?";
abrirModal(){
  if (this.cardSeleccionada) {
  this.modalPregunta.openDialog();
  }
}

manejarRespuesta(respuesta: boolean){
  if (!respuesta) {
    this.eliminarServicio(this.cardSeleccionada?.idServicio,this.cardSeleccionada?.idNegocio)
  }
}

  eliminarServicio(idServicio: number | undefined, idNegocio: number | undefined) {

    if (idServicio) {
      this.servicioService.deleteServicio(idServicio!, idNegocio!).subscribe({
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

  manejarServicio() {
    if (this.cardSeleccionada) {

      this.putServicio(this.cardSeleccionada.idServicio, this.cardSeleccionada.idNegocio);
    } else if (!this.cardSeleccionada) {
      this.postServicioToBackend();
    }
  }

  formularioServicioTieneError(campo:string, error:string) {
    return this.formularioServicio.get(campo)?.hasError(error) && this.formularioServicio.get(campo)?.touched;
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

