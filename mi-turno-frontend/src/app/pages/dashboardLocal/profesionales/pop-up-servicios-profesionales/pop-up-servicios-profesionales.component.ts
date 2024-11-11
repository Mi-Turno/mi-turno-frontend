import {
  Component,
  EventEmitter,
  Inject,
  inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { ServiciosCheckComponent } from '../servicios-check/servicios-check.component';
import { BotonComponent } from '../../../../shared/components/boton/boton.component';
import { CommonModule } from '@angular/common';
import { ServicioInterface } from '../../../../core/interfaces/servicio-interface';
import { ProfesionalInterface } from '../../../../core/interfaces/profesional-interface';
import { ServicioServiceService } from '../../../../core/services/servicioService/servicio-service.service';
import { NegocioServiceService } from '../../../../core/services/negocioService/negocio-service.service';
import { ActivatedRoute } from '@angular/router';
import { normalizePassiveListenerOptions } from '@angular/cdk/platform';
import { ProfesionalesServiceService } from '../../../../core/services/profesionalService/profesionales-service.service';

@Component({
  selector: 'app-pop-up-servicios-profesionales',
  standalone: true,
  imports: [MatIcon, ServiciosCheckComponent, BotonComponent, CommonModule],
  templateUrl: './pop-up-servicios-profesionales.component.html',
  styleUrl: './pop-up-servicios-profesionales.component.css',
})
export class PopUpServiciosProfesionalesComponent implements OnInit, OnChanges {
  @Input() profesional: ProfesionalInterface | null = null;

  servicioService = inject(ServicioServiceService);

  nombreProfesional: string | undefined = '';

  idCards: ServicioInterface[] = [];
  maxCards = 6;
  cardSeleccionada: ServicioInterface | null = null;
  servicios: ServicioServiceService = inject(ServicioServiceService);

  ngOnInit() {
    this.cargarServicios();
    this.nombreProfesional = this.profesional?.nombre;
  }
ngOnChanges(changes: SimpleChanges): void {
    this.cargarServicios();
}

  servicioNegocio: NegocioServiceService = inject(NegocioServiceService);
  servicioProfesional: ProfesionalesServiceService = inject(
    ProfesionalesServiceService
  );
  constructor(private ruta: ActivatedRoute) {}
  idNegocio: number = 0;

  cargarServicios() {
    this.ruta.parent?.params.subscribe((params) => {
      const nombreNegocio = params['nombreNegocio'];
      this.servicioNegocio.getIdNegocioByNombre(nombreNegocio).subscribe({
        next: (idNegocio) => {
          this.idNegocio = idNegocio;
          //obtengo el arreglo de servicios del negocio y lo guardo en la variable idCards
          this.servicios
            .GETserviciosPorIdNegocioYEstado(this.idNegocio, 'true')
            .subscribe({
              next: (response) => {
                this.idCards = [...response];
              },
              error: (error) => {
                console.error('Error al obtener servicios:', error);
              },
            });
        },
        error: (error) => {
          this.idNegocio = -1;
          console.error('Error al obtener el ID del negocio', error);
        },
      });
    });
  }

  profesionalActual: ProfesionalInterface | null = null;

  buscarProfesional() {
    this.servicioProfesional
      .getProfesionalPorIdNegocio(
        this.cardSeleccionada?.idNegocio!,
        this.profesional?.idUsuario!
      )
      .subscribe({
        next: (response) => {
          this.profesionalActual = response;
        },
        error(error) {
          console.error(error);
        },
      });
  }

  verificarEstado(servicio: ServicioInterface): boolean {
    return this.profesional?.listaServicios?.some(
      (s) => s.idServicio === servicio.idServicio
    ) ?? false;
  }


  escribirCards() {
    console.log(this.idCards);
  }

  @Output() desactivarOverlay: EventEmitter<void> = new EventEmitter<void>();
  @Output() activarModificacion: EventEmitter<void> = new EventEmitter<void>();

  cerrarPopUp() {
    console.log('cierro el popup');
    this.desactivarOverlay.emit();
    this.activarModificacion.emit();
  }
  //Lo que hay que hacer es agarrar los nombres de los servicios y mandarlos a los servicios-chek, para que se personalice
}
