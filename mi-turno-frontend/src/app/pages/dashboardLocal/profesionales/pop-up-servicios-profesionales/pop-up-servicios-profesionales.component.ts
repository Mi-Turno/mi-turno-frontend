import { Component, inject, Input, OnInit } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { ServiciosCheckComponent } from '../servicios-check/servicios-check.component';
import { BotonComponent } from "../../../../shared/components/boton/boton.component";
import { CommonModule } from '@angular/common';
import { ServicioInterface } from '../../../../core/interfaces/servicio-interface';
import { ProfesionalInterface } from '../../../../core/interfaces/profesional-interface';
import { ServicioServiceService } from '../../../../core/services/servicioService/servicio-service.service';
import { NegocioServiceService } from '../../../../core/services/negocioService/negocio-service.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-pop-up-servicios-profesionales',
  standalone: true,
  imports: [MatIcon, ServiciosCheckComponent, BotonComponent, CommonModule],
  templateUrl: './pop-up-servicios-profesionales.component.html',
  styleUrl: './pop-up-servicios-profesionales.component.css'
})
export class PopUpServiciosProfesionalesComponent implements OnInit {


@Input() profesional: ProfesionalInterface | null = null;

servicioService = inject(ServicioServiceService);



cerrarPopUp() {
  console.log("Cierro el pop up");
}




idCards: ServicioInterface[] = [];
maxCards = 6;
cardSeleccionada: ServicioInterface | null = null;
servicios:ServicioServiceService = inject(ServicioServiceService);

ngOnInit() {
  this.cargarServicios();
}
servicioNegocio:NegocioServiceService = inject(NegocioServiceService);
constructor(private ruta: ActivatedRoute) { }
idNegocio:number = 0;


cargarServicios() {
  this.ruta.parent?.params.subscribe(params => {
    const nombreNegocio = params['nombreNegocio'];
      this.servicioNegocio.getIdNegocioByNombre("Juan").subscribe(
        {
          next: (idNegocio) => {
            this.idNegocio = idNegocio;
            //obtengo el arreglo de servicios del negocio y lo guardo en la variable idCards
            this.servicios.GETserviciosPorIdNegocioYEstado(this.idNegocio, "true").subscribe({
              next: (response) => {
                this.idCards = [...response];
              },
              error: (error) => {
                console.error('Error al obtener servicios:', error);
              }
            });
          },
          error: (error) => {
            this.idNegocio = -1;
            console.error('Error al obtener el ID del negocio', error);
          }
        }
      );
  });
}


verificarEstado() {
  return false;
  //Aca hay que buscar si el id del servicio está en los servicios que ofrece el profesional.
  //En caso de que esté mandamos true, para que no se pueda volver a poner
  //En caso de que no esté mandamos false, para que lo pueda agregar si quiere
}

escribirCards(){
  console.log(this.idCards);
}



//Lo que hay que hacer es agarrar los nombres de los servicios y mandarlos a los servicios-chek, para que se personalice


nombreProfesional = "'Nashe'";







}
