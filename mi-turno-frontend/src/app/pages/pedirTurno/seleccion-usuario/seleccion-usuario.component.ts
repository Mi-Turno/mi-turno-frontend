import { UsuarioInterface } from './../../../core/interfaces/usuario-interface';
import { Component, Input, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { CardComponent } from "../../../shared/components/card/card.component";
import { CommonModule } from '@angular/common';
import { ServicioInterface } from '../../../core/interfaces/servicio-interface';
import { ProfesionalInterface } from '../../../core/interfaces/profesional-interface';
import { I } from '@angular/cdk/keycodes';
import { CalendarioHorarioProfesionalComponent } from "../calendario-horario-profesional/calendario-horario-profesional.component";
import { MetodoPagoComponent } from "../metodo-pago/metodo-pago.component";


@Component({
  selector: 'app-seleccion-usuario',
  standalone: true,
  imports: [CommonModule, CardComponent, CalendarioHorarioProfesionalComponent, MetodoPagoComponent],
  templateUrl: './seleccion-usuario.component.html',
  styleUrl: './seleccion-usuario.component.css'
})

export class SeleccionUsuarioComponent {

  @Input() arregloServicios:ServicioInterface[] = [];
  @Input() arregloProfesionales:ProfesionalInterface[] = [];
  @Input() pasoActualSeleccion:number = 1;

  @Output() emitirInformacion: EventEmitter<number> = new EventEmitter();



  enviarIdInformacion(e:number) {
    console.log(e);
    this.emitirInformacion.emit(e);
  }

  //servicioService:ServicioServiceService = inject(ServicioServiceService);



  //  recibirInformacion(event:number|string){
  //   this.emitirInformacion.emit(event);
  //  }

    // cargarInformacion(informacion:ServicioInterface[]|UsuarioInterface[]){



    // this.servicioService.GETservicios().subscribe({
    //   next: (response) => {
    //     this.servicios=response.slice(0,response.length);
    //     console.log(response);
    //   },
    //   error: (error) => {
    //     if (error.status === codigoErrorHttp.NO_ENCONTRADO) {
    //       alert('Error 404: Servicio no encontrado');

    //     } else if (error.status === codigoErrorHttp.ERROR_SERVIDOR) {
    //       alert('Error 500: Error del servidor');

    //     } else if (error.status === codigoErrorHttp.ERROR_CONTACTAR_SERVIDOR) {
    //       alert('Error de conexión: No se pudo contactar con el servidor (ERR_CONNECTION_REFUSED)');
    //     } else if(error.status === codigoErrorHttp.ERROR_REPETIDO){
    //       alert('Error 409: Servicio ya existe en el sistema');
    //     } else {
    //       alert('Error inesperado. Intente otra vez mas tarde.');
    //     }
    //   }
    // });
}




