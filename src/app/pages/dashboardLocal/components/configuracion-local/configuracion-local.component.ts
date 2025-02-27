import { Component, inject, OnInit, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  MatSlideToggleChange,
  MatSlideToggleModule,
} from '@angular/material/slide-toggle';
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
import { AuthService } from '../../../../core/guards/auth/service/auth.service';
import { MetodosDePago } from '../../../../shared/models/metodosDePago';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { GeneradorQRComponent } from '../../../../shared/components/generador-qr/generador-qr.component';
import { ArchivosServiceService } from '../../../../core/services/archivosService/archivos-service.service';
import { InputArchivoComponent } from '../../../../shared/components/input-archivo/input-archivo.component';
import { catchError, Observable, of, switchMap, throwError } from 'rxjs';
import { codigoErrorHttp } from '../../../../shared/models/httpError.constants';

@Component({
  selector: 'app-configuracion-local',
  standalone: true,
  imports: [
    MatSlideToggleModule,
    BotonComponent,
    MatIconModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
    CommonModule,
    ModalComponent,
    GeneradorQRComponent,
    InputArchivoComponent,
  ],
  templateUrl: './configuracion-local.component.html',
  styleUrl: './configuracion-local.component.css',
})
export class ConfiguracionLocalComponent implements OnInit {
  // Variables
  nombreNegocio: string | null = null;
  negocioActual: NegocioInterface | null = null;
  placeholders = PLACEHOLDERS;
  iconos = ICONOS;
  QRactivo: boolean = false;
  idNegocio: number = -1;
  //- - - - - - -- - - - --   Toggles de configuraciones - - -- - - - - - - - - - -- - -
  toggleActivoMP: boolean = false;
  toggleActivoDebito: boolean = false;
  toggleActivoCredito: boolean = false;
  toggleActivoTransferencia: boolean = false;
  toggleActivoEfectivo: boolean = false;
  toggleActivoOtro: boolean = false;

  // Inyección de dependencias
  negocioService: NegocioServiceService = inject(NegocioServiceService);
  route: ActivatedRoute = inject(ActivatedRoute);
  authService: AuthService = inject(AuthService);
  urlNegocioQr: string =
    'http://localhost:4200/negocios/' +
    this.authService.getNombreUsuario()! +
    '/pedir-turno'; // URL dinámica para el QR //TODO: Cambiar por la URL de producción

  ngOnInit(): void {
    // Accede al parámetro desde la ruta padre
    this.idNegocio = this.authService.getIdUsuario()!;

    this.obtenerNegocioPorId();
  }

  // Funciones para obtener el negocio

  obtenerNegocioPorId() {
    this.negocioService.getNegocioById(this.idNegocio).subscribe({
      next: (negocio: NegocioInterface) => {

        if (negocio.idUsuario && negocio.fotoPerfil != null) {

          this.obtenerFotoPerfilNegocio(negocio.idUsuario);
          negocio.fotoPerfil = this.fotoNegocio;
        }

        this.negocioActual = negocio; // Ahora el negocio tiene datos

        this.actualizarValores(); // Llamamos a actualizar los valores aquí
        this.establecerToggles(negocio.metodosDePago!); // Llamamos a establecer los toggles aquí
      },
      error: (error: Error) => {
        console.error('Error obteniendo el negocio:', error);
      },
    });
  }
  //--------------------Archivos----------------------

  archivosService: ArchivosServiceService = inject(ArchivosServiceService);
  archivoSeleccionado: File | null = null;
  quiereEliminarArchivo: boolean = false;
  fotoNegocio: string = 'img-default.png';

  postArchivoToBackend(
    idProfesional: number,
    archivoNuevo: File
  ): Observable<Boolean> {
    return this.archivosService
      .postArchivoUsuario(idProfesional, archivoNuevo)
      .pipe(catchError((error) => this.manejarErrores(error)));
  }

  seleccionarArchivo(archivoNuevo: File): void {
    if (archivoNuevo.size > 0 && archivoNuevo != null) {
      this.archivoSeleccionado = archivoNuevo;
      this.quiereEliminarArchivo = false;
      this.formularioModificarNegocio.patchValue({
        fotoPerfil: this.archivoSeleccionado,
      });

      this.fotoNegocio = URL.createObjectURL(this.archivoSeleccionado);
    }
  }

  eliminarArchivo(event?: Event): void {
    this.fotoNegocio = 'img-default.png';
    this.archivoSeleccionado = null;
    this.quiereEliminarArchivo = false;
    this.formularioModificarNegocio.patchValue({
      fotoPerfil: null,
    });
  }

  obtenerFotoPerfilNegocio(idNegocio: number){
    this.archivosService.getArchivoUsuario(idNegocio).subscribe({
      next: (response) => {
        const reader = new FileReader();

        reader.readAsDataURL(response);

        reader.onload = () => {
          this.fotoNegocio = reader.result as string;
        };
      },
      error: (error) => {
        this.fotoNegocio = 'img-default.png';
      },
    });
  }

  verificarFotoPerfil(idUsuario: number | null): Observable<Boolean | null> {
    //verifico si existe el id
    if (idUsuario) {
      //verifico si se selecciono un archivo
      if (this.archivoSeleccionado) {
        return this.postArchivoToBackend(idUsuario, this.archivoSeleccionado);
      }else if(this.quiereEliminarArchivo && this.fotoNegocio === 'img-default.png'){
        return this.archivosService.eliminarArchivoUsuario(idUsuario);
      }
    }
    return of(null);
  }
  //---------------------Toggles--------------------

  cambiarEstadoToggleMP(event: MatSlideToggleChange) {
    this.toggleActivoMP = event.checked; // Obtiene el estado del toggle desde el evento
    if (this.toggleActivoMP) {
      this.darDeAltaMetodoDePago(3);
    } else {
      this.darDeBajaMetodoDePago(3);
    }
  }

  cambiarEstadoToggleDebito(event: MatSlideToggleChange) {
    this.toggleActivoDebito = event.checked; // Obtiene el estado del toggle desde el evento
    if (this.toggleActivoDebito) {
      this.darDeAltaMetodoDePago(4);
    } else {
      this.darDeBajaMetodoDePago(4);
    }
  }

  cambiarEstadoToggleCredito(event: MatSlideToggleChange) {
    this.toggleActivoCredito = event.checked; // Obtiene el estado del toggle desde el evento
    if (this.toggleActivoCredito) {
      this.darDeAltaMetodoDePago(5);
    } else {
      this.darDeBajaMetodoDePago(5);
    }
  }

  cambiarEstadoToggleTransferencia(event: MatSlideToggleChange) {
    this.toggleActivoTransferencia = event.checked; // Obtiene el estado del toggle desde el evento
    if (this.toggleActivoTransferencia) {
      this.darDeAltaMetodoDePago(2);
    } else {
      this.darDeBajaMetodoDePago(2);
    }
  }

  cambiarEstadoToggleEfectivo(event: MatSlideToggleChange) {
    this.toggleActivoEfectivo = event.checked; // Obtiene el estado del toggle desde el evento
    if (this.toggleActivoEfectivo) {
      this.darDeAltaMetodoDePago(1);
    } else {
      this.darDeBajaMetodoDePago(1);
    }
  }
  cambiarEstadoToggleOtro(event: MatSlideToggleChange) {
    this.toggleActivoOtro = event.checked; // Obtiene el estado del toggle desde el evento
    if (this.toggleActivoOtro) {
      this.darDeAltaMetodoDePago(6);
    } else {
      this.darDeBajaMetodoDePago(6);
    }
  }
  // Dar de alta/baja metodo de pago x negocio
  darDeAltaMetodoDePago(idMetodoDePago: number) {
    this.negocioService
      .patchDarDeAltaMetodoDePago(this.idNegocio, idMetodoDePago)
      .subscribe({
        next: (response: NegocioInterface) => {
          console.log(response);
        },
      });
  }
  darDeBajaMetodoDePago(idMetodoDePago: number) {
    this.negocioService
      .patchDarDeBajaMetodoDePago(this.idNegocio, idMetodoDePago)
      .subscribe({
        next: (response: NegocioInterface) => {
          console.log(response);
        },
      });
  }

  //   - - - - - -- - - - - -- - - - - -- -Formulario de modificación de negocio - - - - -- - - - -- - - - -- -

  formularioModificarNegocio: FormGroup = new FormGroup({
    telefono: new FormControl('', Validators.required),
    rubrosControl: new FormControl('', Validators.required),
    calle: new FormControl('', Validators.required),
    altura: new FormControl('', Validators.required),
    detalle: new FormControl('', Validators.required),
    fotoNegocio: new FormControl(),
  });

  obtenerNegocioForm() {
    const credencial: CredencialInterface = {
      email: this.negocioActual?.credencial.email!,
      password: this.negocioActual?.credencial.password!,
      telefono: this.formularioModificarNegocio.get('telefono')?.value,
      estado: true,
    };

    return {
      nombre: this.negocioActual?.nombre || '',
      apellido: this.negocioActual?.nombre || '', //es igual ya que un negocio no tiene apellido
      fechaNacimiento: this.negocioActual?.fechaNacimiento || '', //fecha de nacimiento por defecto que seria la fecha de hoy
      credencial: credencial,
      rubro: this.formularioModificarNegocio.get('rubrosControl')?.value,
      calle: this.formularioModificarNegocio.get('calle')?.value,
      altura: this.formularioModificarNegocio.get('altura')?.value,
      detalle: this.formularioModificarNegocio.get('detalle')?.value,
      rolUsuario: this.negocioActual?.rolUsuario || '',
    };
  }

  actualizarValores() {
    this.formularioModificarNegocio.patchValue({
      telefono: this.negocioActual?.credencial.telefono,
      rubrosControl: this.negocioActual?.rubro,
      calle: this.negocioActual?.calle,
      altura: this.negocioActual?.altura,
      detalle: this.negocioActual?.detalle,
    });
  }
  establecerToggles(metodoDePago: string[]) {
    metodoDePago.forEach((metodo) => {
      switch (metodo) {
        case MetodosDePago.efectivo:
          this.toggleActivoEfectivo = true;
          break;
        case MetodosDePago.transferencia:
          this.toggleActivoTransferencia = true;
          break;
        case MetodosDePago.debito:
          this.toggleActivoDebito = true;
          break;
        case MetodosDePago.credito:
          this.toggleActivoCredito = true;
          break;
        case MetodosDePago.mercadoPago:
          this.toggleActivoMP = true;
          break;
        case MetodosDePago.otro:
          this.toggleActivoOtro = true;
          break;
        default:
      }
    });
  }

  // Metodo para registrar un negocio haciendo el click

  actualizarNegocioBack() {
    if (this.formularioModificarNegocio.valid) {
      const negocioForm: NegocioInterface = this.obtenerNegocioForm();

      let negocioObservable: Observable<NegocioInterface> =
        this.putNegocioToBackend(this.idNegocio, negocioForm);

      negocioObservable
        .pipe(
          switchMap((response: NegocioInterface) => {
            if (response.idUsuario) {
              return this.verificarFotoPerfil(response.idUsuario); // Retorna un Observable para encadenarlo
            }
            return of(null); // Si no hay idUsuario, se retorna un Observable vacío
          })
        )
        .subscribe({
          next: () => {
            //modal de negocio registrado correctamente
            Swal.fire({
              title: 'Datos Actualizados Correctamente',
              icon: 'success',
              confirmButtonText: 'Ok',
            }).then(()=>{
              if(this.archivoSeleccionado){
                window.location.reload();
              }
            });

          },
          error: (error) => {
            console.error('Error en el proceso de guardar al negocio:', error);
          },
        });
    } else {
      this.formularioModificarNegocio.markAllAsTouched();
    }
  }

  putNegocioToBackend(
    idNegocio: number,
    negocioActual: NegocioInterface
  ): Observable<NegocioInterface> {
    return this.negocioService
      .putNegocio(idNegocio, negocioActual)
      .pipe(catchError((error) => this.manejarErrores(error)));
  }

  //Metodo para generar QR de negocio para pedir un turno directamente
  generarQRPedirTurno() {
    if (this.QRactivo) {
      this.QRactivo = false;
    } else {
      this.QRactivo = true;
    }
    console.log(this.QRactivo);
  }

  //- - - - - - - -- - -- - - - Metodos para ocualtr contraseña  -- - - - -- - - -

  ocultarContrasenia = signal(true);
  ocultarContraseniaEvent(event: MouseEvent) {
    this.ocultarContrasenia.set(!this.ocultarContrasenia());
    event.stopPropagation();
  }

  //- - - - - -- - - - -- Metodos para cabiar la contraseña- - - -  -- - -
  //todo: Sería ideal que este boton de mande

  cambiarContrasena() {
    alert('Esto debería madarte a todo el fomrulario de cambiar contraseña');
  }

  //- - - - - - - -- - - - - - - Manejo del combo box - - - - -- - - - -

  rubrosControl = new FormControl<String | null>(null, Validators.required);
  selectFormControl = new FormControl('', Validators.required);
  rubros = Object.values(Rubros);
  //- - - - - - -- - - - - - - Manejo de errores  -- - - - - - - - -- - - - - -
  formularioModificarNegocioTieneError(campo: string, error: string) {
    return (
      this.formularioModificarNegocio.get(campo)?.hasError(error) &&
      this.formularioModificarNegocio.get(campo)?.touched
    );
  }

  private manejarErrores(error: HttpErrorResponse) {
    console.log(error.status);
    switch (error.status) {
      case codigoErrorHttp.ERROR_SERVIDOR:
        alert('Error 500: Error del servidor');
        break;
      case 0:
        alert(
          'Error de conexión: No se pudo contactar con el servidor (ERR_CONNECTION_REFUSED)'
        );
        break;
      case codigoErrorHttp.NO_ENCONTRADO:
        console.log('Not found');
        break;
      default:
        alert('Error inesperado. Intente más tarde.');
        break;
    }

    return throwError(() => error);
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
