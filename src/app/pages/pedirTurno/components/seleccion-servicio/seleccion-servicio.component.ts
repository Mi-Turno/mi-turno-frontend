import { ServicioInterface } from './../../../../core/interfaces/servicio-interface';
import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServicioServiceService } from '../../../../core/services/servicioService/servicio-service.service';
import { CardComponent } from '../../../../shared/components/card/card.component';
import { ArchivosServiceService } from '../../../../core/services/archivosService/archivos-service.service';

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
  archivosService: ArchivosServiceService = inject(ArchivosServiceService);

  ngOnInit(): void {
    this.obtenerServiciosPorIdNegocio(this.idNegocio);
  }

  obtenerServiciosPorIdNegocio(idNegocio: number) {
    this.servicioServicios.getServiciosPorIdNegocioYEstado(idNegocio, "true").subscribe({
      next: (servicios) => {
        //antes de settear el arreglo de servicios, busco las imagenes de los servicios si es que tienen
        this.setImagenesServicio(servicios)

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

  setImagenesServicio(servicios: ServicioInterface[]){
    servicios.map(unServicio => {
      if(unServicio.fotoServicio && unServicio.idNegocio && unServicio.idServicio){
        console.log(unServicio.fotoServicio);
        this.archivosService.getArchivoServicio(unServicio.idServicio,unServicio.idNegocio).subscribe({
          next: (response) => {

            let reader = new FileReader();
            reader.readAsDataURL(response);
            reader.onload = () => {
              unServicio.fotoServicio = reader.result as string;
            }
          },
          error: (err) => {
            unServicio.fotoServicio = "img-default.png";
          },
        })
      }
    })
  }

}


