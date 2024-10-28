import { Component, Input, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { CardComponent } from "../../../shared/components/card/card.component";
import { CommonModule } from '@angular/common';
import { ServicioInterface } from '../../../core/interfaces/servicio-interface';
import { UsuarioInterface } from '../../../core/interfaces/usuario-interface';
import { ServicioServiceService } from '../../../core/services/servicioService/servicio-service.service';
import { codigoErrorHttp } from '../../../shared/models/httpError.constants';

@Component({
  selector: 'app-seleccion-usuario',
  standalone: true,
  imports: [CommonModule,CardComponent],
  templateUrl: './seleccion-usuario.component.html',
  styleUrl: './seleccion-usuario.component.css'
})
export class SeleccionUsuarioComponent implements OnInit {
  @Input() servicios:ServicioInterface[]= [];
  @Output()enviarIdServicio:EventEmitter<number> = new EventEmitter();
  @Input() profesionales:UsuarioInterface[]= [];
  @Output() emitirInformacion: EventEmitter<string|number> = new EventEmitter();

  servicioService:ServicioServiceService = inject(ServicioServiceService);

    ngOnInit(): void {
    //ACA TENGO QUE PONER LO QUE QUIERO CARGAR
    this.cargarServicios();
   }

   recibirInformacion(event:number|string){
    this.emitirInformacion.emit(event);
   }

   cargarServicios() {
    this.servicioService.GETservicios().subscribe({
      next: (response) => {
        this.servicios=response.slice(0,response.length);
        console.log(response);
      },
      error: (error) => {
        if (error.status === codigoErrorHttp.NO_ENCONTRADO) {
          alert('Error 404: Servicio no encontrado');

        } else if (error.status === codigoErrorHttp.ERROR_SERVIDOR) {
          alert('Error 500: Error del servidor');

        } else if (error.status === codigoErrorHttp.ERROR_CONTACTAR_SERVIDOR) {
          alert('Error de conexión: No se pudo contactar con el servidor (ERR_CONNECTION_REFUSED)');
        } else if(error.status === codigoErrorHttp.ERROR_REPETIDO){
          alert('Error 409: Servicio ya existe en el sistema');
        } else {
          alert('Error inesperado. Intente otra vez mas tarde.');
        }
      }
    });
  }




}
