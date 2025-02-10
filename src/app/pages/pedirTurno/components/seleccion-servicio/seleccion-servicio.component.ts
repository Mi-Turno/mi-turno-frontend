import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServicioInterface } from '../../../../core/interfaces/servicio-interface';
import { ServicioServiceService } from '../../../../core/services/servicioService/servicio-service.service';
import { CardComponent } from '../../../../shared/components/card/card.component';

@Component({
  selector: 'app-seleccion-servicio',
  standalone: true,
  imports: [CommonModule,CardComponent],
  templateUrl: './seleccion-servicio.component.html',
  styleUrl: './seleccion-servicio.component.css'
})
export class SeleccionServicioComponent implements OnInit{


  //Inputs Outputs
  @Input() idNegocio: number = -1;

  @Output() idServicioSeleccionado:EventEmitter<number> = new EventEmitter();
  //arreglos
  arregloServicios:ServicioInterface[] = [];

  //servicios
  servicioServicios: ServicioServiceService = inject(ServicioServiceService);



  ngOnInit(): void {

    this.obtenerServiciosPorIdNegocio(this.idNegocio);
  }

  obtenerServiciosPorIdNegocio(idNegocio: number) {
    this.servicioServicios.getServiciosPorIdNegocioYEstado(idNegocio, "true").subscribe({
      next: (servicios) => {

        this.arregloServicios= servicios;
      },
      error: (error) => {
        console.error(error)
      }
    });
  }

  enviarIdInformacion($event: number) {
    this.idServicioSeleccionado.emit($event);
  }
}
