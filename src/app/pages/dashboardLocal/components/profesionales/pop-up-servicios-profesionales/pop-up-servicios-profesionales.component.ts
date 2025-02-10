import { Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, SimpleChanges } from "@angular/core";
import { MatIcon } from "@angular/material/icon";
import { ServiciosCheckComponent } from "../servicios-check/servicios-check.component";
import { BotonComponent } from "../../../../../shared/components/boton/boton.component";
import { CommonModule } from "@angular/common";
import { ProfesionalInterface } from "../../../../../core/interfaces/profesional-interface";
import { ServicioServiceService } from "../../../../../core/services/servicioService/servicio-service.service";
import { ServicioInterface } from "../../../../../core/interfaces/servicio-interface";
import { NegocioServiceService } from "../../../../../core/services/negocioService/negocio-service.service";
import { ProfesionalesServiceService } from "../../../../../core/services/profesionalService/profesionales-service.service";
import { AuthService } from '../../../../../core/guards/auth/service/auth.service';


@Component({
  selector: 'app-pop-up-servicios-profesionales',
  standalone: true,
  imports: [MatIcon, ServiciosCheckComponent, BotonComponent, CommonModule],
  templateUrl: './pop-up-servicios-profesionales.component.html',
  styleUrl: './pop-up-servicios-profesionales.component.css',
})
export class PopUpServiciosProfesionalesComponent implements OnInit, OnChanges {

  //variables
  nombreProfesional: string | undefined = '';
  idCards: ServicioInterface[] = [];
  maxCards = 6;
  cardSeleccionada: ServicioInterface | null = null;
  idNegocio: number = 0;

  //servicios
  servicioService = inject(ServicioServiceService);
  servicios: ServicioServiceService = inject(ServicioServiceService);
  servicioNegocio: NegocioServiceService = inject(NegocioServiceService);
  servicioProfesional: ProfesionalesServiceService = inject(ProfesionalesServiceService);
  authService: AuthService = inject(AuthService);
  //inputs
  @Input() profesional: ProfesionalInterface | null = null;

  ngOnInit() {
    this.cargarServicios();
    this.nombreProfesional = this.profesional?.nombre;
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.cargarServicios();
  }


  cargarServicios() {

    this.idNegocio = this.authService.getIdUsuario() ?? 0;

      this.servicioNegocio.getNegocioById(this.idNegocio).subscribe({
        next: (responseNegocio) => {
          this.servicios.getServiciosPorIdNegocioYEstado(this.idNegocio, 'true')
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




  @Output() desactivarOverlay: EventEmitter<void> = new EventEmitter<void>();
  @Output() activarModificacion: EventEmitter<void> = new EventEmitter<void>();

  cerrarPopUp() {

    this.desactivarOverlay.emit();
    this.activarModificacion.emit();
  }
  //Lo que hay que hacer es agarrar los nombres de los servicios y mandarlos a los servicios-chek, para que se personalice
}
