import { CommonModule } from '@angular/common';
import {
  Component,
  inject,
  Input,
  OnInit,
  importProvidersFrom,
  Output,
  EventEmitter,
} from '@angular/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ServicioInterface } from '../../../../core/interfaces/servicio-interface';
import { ServicioServiceService } from '../../../../core/services/servicioService/servicio-service.service';
import { ProfesionalesServiceService } from '../../../../core/services/profesionalService/profesionales-service.service';
import { ProfesionalInterface } from '../../../../core/interfaces/profesional-interface';

@Component({
  selector: 'app-servicios-check',
  standalone: true,
  imports: [MatSlideToggleModule, CommonModule],
  templateUrl: './servicios-check.component.html',
  styleUrl: './servicios-check.component.css',
})
export class ServiciosCheckComponent implements OnInit {
  profesionalService = inject(ProfesionalesServiceService);

  ngOnInit(): void {
    this.nombreServicio = this.servicioCompleto?.nombre;

  }

  @Input() servicioCompleto: ServicioInterface | null = null;
  @Input() toggleActivo: boolean | null = null;
  @Input() profesionalCompleto: ProfesionalInterface | null = null;
  nombreServicio = this.servicioCompleto?.nombre;


  // Función para alternar el estado del toggle
  cambiarEstadoToggle(event: any) {
    console.log(event.checked);
    this.toggleActivo = event.checked; // Obtiene el estado del toggle desde el evento
    this.modificarServicioProfesional();
  }

  modificarServicioProfesional() {
    if (this.toggleActivo) {
      this.putServiciosEnProfesionalEnNegocio(
        this.servicioCompleto?.idNegocio!,
        this.profesionalCompleto?.idUsuario!,
        this.servicioCompleto?.idServicio!
      );

      console.log('hago el put');
    } else if (!this.toggleActivo) {
      this.putServiciosEnProfesionalEnNegocio(
        this.servicioCompleto?.idNegocio!,
        this.profesionalCompleto?.idUsuario!,
        this.servicioCompleto?.idServicio!
      );
    }
  }

  servicios = [];

  putServiciosEnProfesionalEnNegocio(
    idNegocio: number,
    idProfesional: number,
    idServicio: number
  ) {
    console.log('entroAca');
    console.log(idNegocio, idProfesional, idServicio, this.profesionalCompleto);

    if (idNegocio && idProfesional && idServicio && this.profesionalCompleto) {
      this.profesionalService
        .putServicioEnProfecionalEnNegocio(
          idNegocio,
          idProfesional,
          idServicio,
          this.profesionalCompleto
        )
        .subscribe({
          next: (response: ProfesionalInterface) => {
            console.log(response);
          },
          error: (e: Error) => {
            console.log(e.message);
          },
        });


    }
  }

  deleteServiciosDeProfecionalDeNegocio(
    idNegocio: number,
    idProfesional: number,
    idServicio: number
  ) {
    console.log('entroAca');
    console.log(idNegocio, idProfesional, idServicio, this.profesionalCompleto);

    if (idNegocio && idProfesional && idServicio && this.profesionalCompleto) {
      this.profesionalService
        .deleteServicioDeProfesionalDeNegocio(
          idNegocio,
          idProfesional,
          idServicio,
          this.profesionalCompleto
        )
        .subscribe({
          next: (response: ProfesionalInterface) => {
            console.log(response);
          },
          error: (e: Error) => {
            console.log(e.message);
          },
        });
    }
  }
}
