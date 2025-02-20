import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { CardComponent } from '../../../../../shared/components/card/card.component';
import { PopUpCrearProfesionalComponent } from '../../profesionales/pop-up-crear-profesional/pop-up-crear-profesional.component';
import { ServicioInterface } from '../../../../../core/interfaces/servicio-interface';
import { ServicioServiceService } from '../../../../../core/services/servicioService/servicio-service.service';
import { PopUpCrearServicioComponent } from '../pop-up-crear-servicio/pop-up-crear-servicio.component';
import { NegocioServiceService } from '../../../../../core/services/negocioService/negocio-service.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../../../core/guards/auth/service/auth.service';
import { ArchivosServiceService } from '../../../../../core/services/archivosService/archivos-service.service';

@Component({
  selector: 'app-servicio-main',
  standalone: true,
  imports: [CommonModule, CardComponent, PopUpCrearServicioComponent],
  templateUrl: './servicio-main.component.html',
  styleUrl: './servicio-main.component.css'
})
export class ServicioMainComponent implements OnInit {

  //servicios
  authService:AuthService = inject(AuthService);
  archivosService: ArchivosServiceService = inject(ArchivosServiceService);
  servicios: ServicioServiceService = inject(ServicioServiceService);
  servicioNegocio: NegocioServiceService = inject(NegocioServiceService);


  //variables
  textoBoton = "Modificar";
  rutaImg = "img-default.png";
  textoAlternativo = "Img del servicio";
  textoTitulo = "";
  idCards: ServicioInterface[] = [];
  maxCards = 6;
  cardSeleccionada: ServicioInterface | null = null;
  idNegocio: number = 0;
  rutaBotonChip = ""
  estaSobrepuesto: boolean = false;


  @Output() activarOverlay: EventEmitter<void> = new EventEmitter<void>();

  //init y constructor

  ngOnInit() {
    this.idNegocio = this.authService.getIdUsuario()!;
    this.cargarServicios();
  }
  constructor(private ruta: ActivatedRoute) { }

  cargarServicios() {
    this.ruta.parent?.params.subscribe(params => {

      //obtengo el arreglo de servicios del negocio y lo guardo en la variable idCards
      this.servicios.getServiciosPorIdNegocioYEstado(this.idNegocio, "true").subscribe({
        next: (response) => {

          response.map((servicio) => {
            if(servicio.idServicio && servicio.idNegocio)
            {
              this.archivosService.getArchivoServicio(servicio.idServicio, servicio.idNegocio).subscribe({
                next: (response) => {
                  let reader = new FileReader();
                  reader.readAsDataURL(response);
                  reader.onload = () => {
                    servicio.fotoServicio = reader.result as string;
                  }
                },
                error: (err) => {},
              });
            }
          });



          this.idCards = [...response];
        },
        error: (error) => {
          console.error('Error al obtener servicios:', error);
        }
      });

    });
  }


  cambiarSobreposicion(texto: string, card: ServicioInterface | null) {

    this.estaSobrepuesto = !this.estaSobrepuesto;
    this.textoTitulo = texto;
    this.cardSeleccionada = card;

  }

}
