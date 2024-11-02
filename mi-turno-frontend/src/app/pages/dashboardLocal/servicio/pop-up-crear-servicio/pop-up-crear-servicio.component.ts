import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { BotonComponent } from '../../../../shared/components/boton/boton.component';
import { InputComponent } from '../../../../shared/components/input/input.component';
import { MatIcon } from '@angular/material/icon';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ICONOS } from '../../../../shared/models/iconos.constants';
import { PLACEHOLDERS } from '../../../../shared/models/placeholderInicioSesion.constants';
import { CardComponent } from '../../../../shared/components/card/card.component';
import { ServicioInterface } from '../../../../core/interfaces/servicio-interface';
import { ServicioServiceService } from '../../../../core/services/servicioService/servicio-service.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { codigoErrorHttp } from '../../../../shared/models/httpError.constants';
import { UsuarioInterface } from '../../../../core/interfaces/usuario-interface';

@Component({
  selector: 'app-pop-up-crear-servicio',
  standalone: true,
  imports: [
    CommonModule,
    BotonComponent,
    InputComponent,
    MatIcon,
    ReactiveFormsModule,
    CardComponent,
  ],
  templateUrl: './pop-up-crear-servicio.component.html',
  styleUrl: './pop-up-crear-servicio.component.css',
})
export class PopUpCrearServicioComponent implements OnInit {
  icono = ICONOS;
  placeholder = PLACEHOLDERS;
  tipoPopUp = 'servicios';

  @Input() fotoServicio = 'img-default.png'; //poner imagen de un servicio
  servicioService: ServicioServiceService = inject(ServicioServiceService);

  @Input() estadoPopUp: boolean = true;
  @Input() textoTitulo: string = '';
  @Input() cardSeleccionada: ServicioInterface | null = null;

  @Output() desactivarOverlay: EventEmitter<void> = new EventEmitter<void>();

  cerrarPopUp() {
    console.log(this.cardSeleccionada);
    this.estadoPopUp = false;
    this.desactivarOverlay.emit();
  }

  formularioServicio = new FormGroup({
    nombre: new FormControl('', Validators.required),
    duracion: new FormControl('', [Validators.required, Validators.min(0)]),
  });

  ngOnInit(): void {
    this.actualizarValores();
  }

  actualizarValores() {
    this.formularioServicio.patchValue({
      nombre: this.cardSeleccionada?.nombre,
      duracion: this.cardSeleccionada?.duracion?.toString(),
    });
    console.log(this.cardSeleccionada?.idServicio);
  }

  crearUnServicio(): ServicioInterface {
    const nombre: string = this.formularioServicio.get('nombre')?.value || '';
    const duracion = parseFloat(
      this.formularioServicio.get('duracion')?.value || '0'
    );
    return {
      nombre,
      duracion,
    };
  }
  constructor(private router: Router) {}
  postServicioToBackend() {
    if (this.formularioServicio.valid) {
      const servicioNuevo: ServicioInterface = this.crearUnServicio();
      this.servicioService.POSTcrearUnServicio(servicioNuevo,1).subscribe({//todo deberia tener el id del negocio
        next: (response) => {
          this.cerrarPopUp();
          window.location.reload();
          console.log(response);
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

  putServicio(id: number | undefined) {
    if (this.formularioServicio.valid) {
      const servicioActualizado: ServicioInterface = this.crearUnServicio();
      if (id) {
        this.servicioService.PUTservicio(id, servicioActualizado).subscribe({
          next: (response) => {
            this.cerrarPopUp();
            window.location.reload();
            console.log(response);
          },
          error: (e: Error) => {
            console.log(e.message);
          },
        });
      }
    }
  }

  eliminarServicio(id: number | undefined) {
    if (id) {
      this.servicioService.DELETEservicio(id).subscribe({
        next: (response) => {
          this.cerrarPopUp();
          console.log(response);
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
      this.putServicio(this.cardSeleccionada.idServicio);
    } else if (!this.cardSeleccionada) {
      this.postServicioToBackend();
    }
  }
}
