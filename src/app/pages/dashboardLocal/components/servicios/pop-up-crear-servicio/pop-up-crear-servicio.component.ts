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
import { InputArchivoComponent } from "../../../../../shared/components/input-archivo/input-archivo.component";
import { ArchivosServiceService } from "../../../../../core/services/archivosService/archivos-service.service";
import { catchError, Observable, of, switchMap, throwError } from "rxjs";
import { entidadEnum } from "../../../../../shared/models/entidadEnum";

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
    ModalPreguntaComponent,
    InputArchivoComponent
],
  templateUrl: './pop-up-crear-servicio.component.html',
  styleUrl: './pop-up-crear-servicio.component.css',
})
export class PopUpCrearServicioComponent implements OnInit {

  //variables

  iconos = ICONOS;
  placeholders = PLACEHOLDERS;
  tipoPopUp = 'servicios';
  esNuevoServicio:boolean = false;
  idNegocio: number = 0;

  //Servicios
  servicioService: ServicioServiceService = inject(ServicioServiceService);
  authService: AuthService = inject(AuthService);
  //inputs

  @Input() fotoServicio: string | File | undefined= 'img-default.png'; //poner imagen de un servicio
  @Input() estadoPopUp: boolean = true;
  @Input() textoTitulo: string = '';
  @Input() cardSeleccionada: ServicioInterface | null = null;
  //outputs

  @Output() desactivarOverlay: EventEmitter<void> = new EventEmitter<void>();

  cerrarPopUp() {

    this.estadoPopUp = false;
    this.desactivarOverlay.emit();
  }

  //formulario

  formularioServicio = new FormGroup({
    nombre: new FormControl('', Validators.required),
    duracion: new FormControl('', [Validators.required, Validators.min(1), Validators.max(600)]),
    precio: new FormControl('', [Validators.required, Validators.min(1)]),
    fotoServicioFormulario: new FormControl()
  });



  //init y constructor

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.idNegocio = this.authService.getIdUsuario()!;
    this.actualizarValores();
  }

  actualizarValores() {
    if(this.cardSeleccionada != null){
      this.formularioServicio.patchValue({
        nombre: this.cardSeleccionada?.nombre,
        duracion: this.cardSeleccionada?.duracion?.toString(),
        precio: this.cardSeleccionada?.precio?.toString(),
        fotoServicioFormulario: this.cardSeleccionada?.fotoServicio
      });
    }else{
      this.esNuevoServicio = true;
    }

    if(this.cardSeleccionada?.fotoServicio){
      //mostramos la foto de perfil en el formulario
      this.fotoServicio = this.cardSeleccionada?.fotoServicio;
    }else{
      this.fotoServicio = "img-default.png";
    }

  }

  crearUnServicio(): ServicioInterface {
    const nombre: string = this.formularioServicio.get('nombre')?.value || '';
    const duracion = parseFloat(
      this.formularioServicio.get('duracion')?.value || '0'
    );
    const precio = parseFloat(
      this.formularioServicio.get('precio')?.value || '0'
    );

    const fotoServicio = this.formularioServicio.get('fotoServicioFormulario')?.value || 'img-default.png';

    return {
      nombre,
      duracion,
      precio,
      fotoServicio
    };
  }


  postServicioToBackend(servicio:ServicioInterface): Observable<ServicioInterface> {

      return this.servicioService.postCrearUnServicio(servicio, this.idNegocio)
      .pipe(catchError((error) => this.manejarErrores(error)))

  }

  putServicioToBackend(idServicio: number | undefined, idNegocio: number | undefined): Observable<ServicioInterface> {
    const servicioActualizado: ServicioInterface = this.crearUnServicio();
      return this.servicioService.putServicio(idServicio!, idNegocio!, servicioActualizado)
      .pipe(catchError((error) => this.manejarErrores(error)))
  }

  // - - - Eliminar Servicio - - -
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

  confirmarServicio() {
    if (this.formularioServicio.valid) {

      let servicioObservable : Observable<ServicioInterface>;

          if (this.cardSeleccionada) {
            // Si el usuario ya existe, actualizarlo con PUT
            servicioObservable = this.putServicioToBackend(this.cardSeleccionada.idServicio, this.idNegocio);
          } else {
            // Si no existe, crearlo con POST
            const servicio: ServicioInterface = this.crearUnServicio();
            servicioObservable = this.postServicioToBackend(servicio);
          }



          servicioObservable.pipe(
            switchMap((response: ServicioInterface ) => {
              if (response.idServicio) {
                return this.verificarFotoPerfil(response.idServicio); // Retorna un Observable para encadenarlo
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
    }else{
      this.formularioServicio.markAllAsTouched();
    }
  }

  quiereEliminarArchivo:boolean = false;

  verificarFotoPerfil(idServicio: number | null): Observable<Boolean | null>{
    //verifico si existe el id
    if(idServicio){

      //verifico si se selecciono un archivo o quiere eliminar
      if(this.archivoSeleccionado){
        return this.postArchivoToBackend(idServicio,this.idNegocio, this.archivoSeleccionado);
      }
      else if(this.quiereEliminarArchivo && this.cardSeleccionada?.fotoServicio){
        return this.eliminarArchivoBackend(idServicio);
      }
    }
    return of(null)
  }




// - - - Archivos - - - -

  archivosService: ArchivosServiceService = inject(ArchivosServiceService);
  archivoSeleccionado : File | null = null;


  postArchivoToBackend(idServicio:number,idNegocio:number, archivoNuevo:File): Observable<Boolean>{
    return this.archivosService.postArchivoServicio(idServicio,idNegocio,archivoNuevo)
    .pipe(catchError((error) => this.manejarErrores(error)));
  }


  seleccionarArchivo(archivoNuevo:File): void{

    if(archivoNuevo.size > 0  && archivoNuevo != null){
      this.archivoSeleccionado = archivoNuevo;

      this.quiereEliminarArchivo = false;

      this.formularioServicio.patchValue({
        fotoServicioFormulario: this.archivoSeleccionado
      })

      this.fotoServicio = URL.createObjectURL(this.archivoSeleccionado);
    }

  }

  private eliminarArchivoBackend(idProfesional:number):Observable<Boolean>{
    return this.archivosService.eliminarArchivoServicio(idProfesional)
    .pipe(catchError((error) => this.manejarErrores(error)));
  }

  eliminarArchivo(event:Event):void{

    this.fotoServicio = "img-default.png";
    this.archivoSeleccionado = null;
    this.formularioServicio.patchValue({
      fotoServicioFormulario:null
    })
  }

  // - - - Manejar Errores - - -

  formularioServicioTieneError(campo:string, error:string) {
    return this.formularioServicio.get(campo)?.hasError(error) && this.formularioServicio.get(campo)?.touched;
  }

  mostrarMensajeError(error: string) {

    switch (error) {
      case 'required':
        return 'Campo requerido';
      case 'servicioYaExiste':
        return 'Servicio ya existe';
      case 'min':
        return "Duración mínima 1 minuto";
      case 'max':
        return "Duración máxima 600 minutos";
      case 'precioInvalido':
        return 'Precio inválido';
      case 'nombreInvalido':
        return 'Nombre inválido';
      default:
        return 'Error';
    }

  }

  private manejarErrores(error: HttpErrorResponse) {
    switch (error.status) {
      case codigoErrorHttp.ERROR_SERVIDOR:
        alert('Error 500: Error del servidor');
        break;
      case 0:
        alert('Error de conexión: No se pudo contactar con el servidor (ERR_CONNECTION_REFUSED)');
      break;
      case codigoErrorHttp.ERROR_REPETIDO:
        const mensaje = error.error['mensaje'];
        console.log(mensaje);
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

}


