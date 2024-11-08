import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { CardComponent } from '../../../../shared/components/card/card.component';
import { PopUpCrearProfesionalComponent } from '../../profesionales/pop-up-crear-profesional/pop-up-crear-profesional.component';
import { ServicioInterface } from '../../../../core/interfaces/servicio-interface';
import { ServicioServiceService } from '../../../../core/services/servicioService/servicio-service.service';
import { PopUpCrearServicioComponent } from '../pop-up-crear-servicio/pop-up-crear-servicio.component';
import { NegocioServiceService } from '../../../../core/services/negocioService/negocio-service.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-servicio-main',
  standalone: true,
  imports: [CommonModule, CardComponent, PopUpCrearServicioComponent],
  templateUrl: './servicio-main.component.html',
  styleUrl: './servicio-main.component.css'
})
export class ServicioMainComponent implements OnInit {

  textoBoton = "Modificar";
  rutaImg = "img-default.png";
  textoAlternativo = "Img del servicio";
  textoTitulo = "";
  idCards: ServicioInterface[] = [];
  maxCards = 6;
  cardSeleccionada: ServicioInterface | null = null;


  ngOnInit() {
    this.cargarServicios();
  }
  servicioNegocio:NegocioServiceService = inject(NegocioServiceService);
constructor(private ruta: ActivatedRoute) { }
idNegocio:number = 0;
  cargarServicios() {
    this.ruta.parent?.params.subscribe(params => {
      const nombreNegocio = params['nombreNegocio'];
      console.log(nombreNegocio);

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
  rutaBotonChip = ""

  estaSobrepuesto:boolean=false;
  servicios:ServicioServiceService = inject(ServicioServiceService);
  @Output() activarOverlay: EventEmitter<void> = new EventEmitter<void>();


  cambiarSobreposicion(texto:string, card: ServicioInterface | null) {

    this.estaSobrepuesto = !this.estaSobrepuesto;
    this.textoTitulo = texto;
    this.cardSeleccionada = card;

  }

}
