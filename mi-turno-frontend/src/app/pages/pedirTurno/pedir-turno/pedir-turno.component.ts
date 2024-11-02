import { ServicioServiceService } from './../../../core/services/servicioService/servicio-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TurnoInterface } from './../../../core/interfaces/turno-interface';
import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { NavPedirTurnoComponent } from "../nav-pedir-turno/nav-pedir-turno.component";
import { NavPasosComponent } from "../nav-pasos/nav-pasos.component";
import { CardComponent } from "../../../shared/components/card/card.component";
import { MetodosDePago } from '../../../shared/models/metodosDePago';
import { ConfirmacionComponent } from '../confirmacion/confirmacion.component';
import { SeleccionUsuarioComponent } from "../seleccion-usuario/seleccion-usuario.component";
import { ParseFlags } from '@angular/compiler';
import { ServicioInterface } from '../../../core/interfaces/servicio-interface';
import { ProfesionalInterface } from '../../../core/interfaces/profesional-interface';
import { CalendarioHorarioProfesionalComponent } from "../calendario-horario-profesional/calendario-horario-profesional.component";
import { NegocioServiceService } from '../../../core/services/negocioService/negocio-service.service';
import { ProfesionalesServiceService } from '../../../core/services/profesionalService/profesionales-service.service';
import { E } from '@angular/cdk/keycodes';


@Component({
  selector: 'app-pedir-turno',
  standalone: true,
  imports: [CommonModule, NavPedirTurnoComponent, NavPasosComponent, CardComponent, ConfirmacionComponent, SeleccionUsuarioComponent, CalendarioHorarioProfesionalComponent],
  templateUrl: './pedir-turno.component.html',
  styleUrl: './pedir-turno.component.css'
})



export class PedirTurnoComponent implements OnInit{

 //todo verificar desde la url si el negocio existe
  //todo extraer de la url el nombre del negocio y pegarle al backend para obtener el ID
  //todo extraer de LocalStorage el ID del usuario
  //todo


    constructor(private ruta: ActivatedRoute) { }
    servicioNegocio :NegocioServiceService= inject(NegocioServiceService)
    servicioServicios: ServicioServiceService = inject(ServicioServiceService);
    servicioProfesional: ProfesionalesServiceService = inject(ProfesionalesServiceService);
    idNegocio: number = 1;
    ngOnInit(): void {
      const nombreNegocio = this.ruta.snapshot.paramMap.get('nombreNegocio');

      if (nombreNegocio) {
        this.servicioNegocio.getIdNegocioByNombre(nombreNegocio).subscribe(
          {
            next: (idNegocio) => {
              this.idNegocio = idNegocio;
              //obtengo el arreglo de servicios del negocio y lo guardo en la variable servicios
              this.servicioServicios.GETserviciosPorIdNegocio(this.idNegocio).subscribe({
                next: (servicios) => {
                  this.servicios= servicios;
                },
                error: (error) => {

                }
              });

              //obtengo el arreglo de profesionales del negocio y lo guardo en la variable profesionales
              this.servicioProfesional.getProfesionalesPorIdNegocio(this.idNegocio).subscribe({
                next: (profesionales) => {
                  this.profesionales = this.profesionales.slice(0,profesionales.length);
                },error: (error) => {
                  console.log(error);
                }
              });


            },
            error: (error) => {
              this.idNegocio = -1;
              console.error('Error al obtener el ID del negocio', error);
            }
          }
        );
      } else {
        console.error('Nombre del negocio no encontrado en la URL');
      }
    }

    servicios: ServicioInterface[] = [];
    profesionales: ProfesionalInterface[]=[];





  datos: any[] = []; // Datos que se pasan al componente de selección de usuario


  activarOscurecer: boolean = false; // Variable que controla si se oscurece el fondo para mostrar el pop-up
  manejadorOscurecer(event: boolean): void {
    this.activarOscurecer=event;
  }
  @Input() idCliente: number = 1; // ID del cliente que pide el turno

  turno:TurnoInterface={
    idCliente: this.idCliente,
    idNegocio: this.idNegocio,
  };
  recibirIdInformacion(event:number){

    if(this.pasoActual == 1){
      this.turno.idServicio = event;

    }

    if(this.pasoActual == 2){
      this.turno.idProfesional = event;
    }

    console.log(this.turno);
    this.avanzarPaso();
  }

  servicioSeleccionado(idServicioSeleccionado:number){
    this.turno.idServicio= idServicioSeleccionado;
  }






  pasoActual: number = 1; // Variable que controla el paso actual

  // Función para avanzar al siguiente paso
  avanzarPaso(): void {
    if (this.pasoActual < 4) {
      this.pasoActual++;
    }
  }

  // Función para retroceder al paso anterior
  retrocederPaso(): void {
    if (this.pasoActual > 1) {
      this.pasoActual--;
    }
  }

  // Función para cambiar al paso específico si es permitido
  irAPaso(paso: number): void {
    if (paso <= this.pasoActual) {
      this.pasoActual = paso;
    }
  }

  // Función para confirmar el turno
  confirmarTurno(): void {
    this.pasoActual=5;
  }


}

