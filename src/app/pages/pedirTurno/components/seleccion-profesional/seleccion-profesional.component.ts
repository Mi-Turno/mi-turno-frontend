import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { ProfesionalInterface } from '../../../../core/interfaces/profesional-interface';
import { ServicioServiceService } from '../../../../core/services/servicioService/servicio-service.service';
import { CardComponent } from '../../../../shared/components/card/card.component';
import { ArchivosServiceService } from '../../../../core/services/archivosService/archivos-service.service';


@Component({
  selector: 'app-seleccion-profesional',
  standalone: true,
  imports: [CardComponent],
  templateUrl: './seleccion-profesional.component.html',
  styleUrl: './seleccion-profesional.component.css'
})
export class SeleccionProfesionalComponent implements OnInit{

  //Input y Output
  @Input() idNegocio:number = -1;
  @Input() idServicio:number =-1; // para horario profesional
  @Output() idProfesionalSeleccionado:EventEmitter<number> = new EventEmitter();
  //arreglos
  arregloProfesionales:ProfesionalInterface[] = [];

  //services
  servicioService: ServicioServiceService = inject(ServicioServiceService);
  archivosService: ArchivosServiceService = inject(ArchivosServiceService);

  ngOnInit(): void {
    this.obtenerProfesionalesPorIdNegocioYIdServicio(this.idNegocio,this.idServicio);
  }


  obtenerProfesionalesPorIdNegocioYIdServicio(idNegocio:number, idServicio:number){
    //obtengo el arreglo de profesionales del negocio y lo guardo en la variable profesionales

    if(idNegocio == -1 || idServicio == -1){
      return;
    }

    this.servicioService.getListadoDeProfesionalesPorIdServicioYIdNegocio(idServicio,idNegocio).subscribe({
      next: (profesionales) => {
        this.setImagenesServicio(profesionales);
        this.arregloProfesionales = profesionales
      },error: (error) => {
        console.log(error);
      }

    });

  }

  setImagenesServicio(profesionales: ProfesionalInterface[]){
      profesionales.map(unProfesional => {
        if(unProfesional.fotoPerfil && unProfesional.idUsuario){

          this.archivosService.getArchivoUsuario(unProfesional.idUsuario).subscribe({
            next: (response) => {

              let reader = new FileReader();
              reader.readAsDataURL(response);
              reader.onload = () => {
                unProfesional.fotoPerfil = reader.result as string;
              }
            },
            error: (err) => {
              unProfesional.fotoPerfil = "img-default.png";
            },
          })
        }
      })
    }


  enviarIdInformacion($event: number) {
    this.idProfesionalSeleccionado.emit($event);
  }

}
