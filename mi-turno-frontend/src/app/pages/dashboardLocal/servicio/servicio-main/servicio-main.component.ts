import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { CardComponent } from '../../../../shared/components/card/card.component';
import { PopUpCrearProfesionalComponent } from '../../profesionales/pop-up-crear-profesional/pop-up-crear-profesional.component';
import { ServicioInterface } from '../../../../core/interfaces/servicio-interface';
import { ServicioServiceService } from '../../../../core/services/servicioService/servicio-service.service';
import { PopUpCrearServicioComponent } from '../pop-up-crear-servicio/pop-up-crear-servicio.component';

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
  cargarServicios() {
    this.servicios.GETserviciosPorCriterio(undefined,true).subscribe({
      next: (response) => {

        this.idCards = response.slice(0, this.maxCards);  // Limitar la cantidad de tarjetas
      },
      error: (error) => {
        console.error('Error al obtener servicios:', error);
      }
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
