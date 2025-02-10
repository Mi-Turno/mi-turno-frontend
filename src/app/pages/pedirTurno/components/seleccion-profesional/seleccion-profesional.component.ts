import { ServicioServiceService } from './../../../core/services/servicioService/servicio-service.service';
import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { ProfesionalInterface } from '../../../core/interfaces/profesional-interface';
import { CardComponent } from "../../../shared/components/card/card.component";

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
  ServicioService: ServicioServiceService = inject(ServicioServiceService);

  ngOnInit(): void {
    this.obtenerProfesionalesPorIdNegocioYIdServicio(this.idNegocio,this.idServicio);
  }


  obtenerProfesionalesPorIdNegocioYIdServicio(idNegocio:number, idServicio:number){
    //obtengo el arreglo de profesionales del negocio y lo guardo en la variable profesionales

    if(idNegocio == -1 || idServicio == -1){
      return;
    }

    this.ServicioService.getListadoDeProfesionalesPorIdServicioYIdNegocio(idServicio,idNegocio).subscribe({
      next: (profesionales) => {

        this.arregloProfesionales = profesionales
      },error: (error) => {
        console.log(error);
      }

    });

  }

  enviarIdInformacion($event: number) {
    this.idProfesionalSeleccionado.emit($event);
  }

}
