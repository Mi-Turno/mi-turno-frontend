import { UsuarioInterface } from './../../../core/interfaces/usuario-interface';
import { Component, Input, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { CardComponent } from "../../../shared/components/card/card.component";
import { CommonModule } from '@angular/common';
import { ServicioInterface } from '../../../core/interfaces/servicio-interface';
import { ProfesionalInterface } from '../../../core/interfaces/profesional-interface';
import { I } from '@angular/cdk/keycodes';
import { CalendarioHorarioProfesionalComponent } from "../calendario-horario-profesional/calendario-horario-profesional.component";
import { MetodoPagoComponent } from "../metodo-pago/metodo-pago.component";
import { HorarioProfesional } from '../../../core/interfaces/horarioProfesional.interface';
import { ServicioServiceService } from '../../../core/services/servicioService/servicio-service.service';
import { ProfesionalesServiceService } from '../../../core/services/profesionalService/profesionales-service.service';


@Component({
  selector: 'app-seleccion-usuario',
  standalone: true,
  imports: [CommonModule, CardComponent, CalendarioHorarioProfesionalComponent],
  templateUrl: './seleccion-usuario.component.html',
  styleUrl: './seleccion-usuario.component.css'
})

export class SeleccionUsuarioComponent implements OnInit{

  //lo uso para mostrar las diferentes opciones
  @Input() idNegocio:number = 1;
  @Input() idProfesional:number =-1; // para horario profesional
  @Input() pasoActualSeleccion:number = 1;
  @Input() idServicio:number=-1;
  @Output() emitirInformacion: EventEmitter<number> = new EventEmitter();
  @Output() emitirDiaInicio: EventEmitter<Date> = new EventEmitter();

  //servicios
  servicioServicios: ServicioServiceService = inject(ServicioServiceService);
  servicioProfesional: ProfesionalesServiceService = inject(ProfesionalesServiceService);


  //arreglos
  arregloServicios:ServicioInterface[] = [];
  arregloProfesionales:ProfesionalInterface[] = [];

  //init
  ngOnInit(): void {
    this.obtenerServiciosPorIdNegocio(this.idNegocio);

    //lo verifico asi no hago una peticion de mas y ademas tengo el id del servicio para mostrar los profesionales que lo brindan
    if(this.idServicio!=-1){
      this.obtenerProfesionalesPorIdNegocioYIdServicio(this.idNegocio,this.idServicio);
    }

  }



  enviarDiaInicio(event:Date){
    console.log("DIA INICIOOO",event);
    this.emitirDiaInicio.emit(event);
  }

  obtenerServiciosPorIdNegocio(idNegocio:number){

    //obtengo el arreglo de servicios del negocio y lo guardo en la variable servicios
    this.servicioServicios.GETserviciosPorIdNegocio(this.idNegocio).subscribe({
      next: (servicios) => {
        this.arregloServicios= servicios;
      },
      error: (error) => {
        console.error(error)
      }
    });

  }


  obtenerProfesionalesPorIdNegocioYIdServicio(idNegocio:number, idServicio:number){
    //obtengo el arreglo de profesionales del negocio y lo guardo en la variable profesionales
    this.servicioServicios.GETlistadoDeProfesionalesPorIdServicioYIdNegocio(idServicio,idNegocio).subscribe({
      next: (profesionales) => {

        this.arregloProfesionales = profesionales
      },error: (error) => {
        console.log(error);
      }

    });

  }
  //variables

  enviarIdInformacion(e:number) {
    if(this.pasoActualSeleccion==1){
      //me quedo con el id del servicio para mostrar los profesionales que lo brindan
      this.idServicio=e;
      this.obtenerProfesionalesPorIdNegocioYIdServicio(this.idNegocio,e);
    }

   if(this.pasoActualSeleccion==2){
        //me quedo con el id del profesional para mostrar los horarios que tiene
        this.idProfesional=e;

      }

    this.emitirInformacion.emit(e);
  }

  @Output() emitirHorarioProfesionalSeleccionado: EventEmitter<HorarioProfesional> = new EventEmitter<HorarioProfesional>();
  enviarHorarioProfesional(e:HorarioProfesional){
    console.log("HORARIO PROFESIONALLL",e);
    this.emitirHorarioProfesionalSeleccionado.emit(e);
  }


}




