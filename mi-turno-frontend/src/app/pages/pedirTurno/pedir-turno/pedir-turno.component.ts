import { ServicioServiceService } from './../../../core/services/servicioService/servicio-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TurnoInterface } from './../../../core/interfaces/turno-interface';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
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
import { MetodoPagoComponent } from "../metodo-pago/metodo-pago.component";
import { MetodosDePagoServiceService } from '../../../core/services/metodosDePago/metodos-de-pago-service.service';
import { MetodosDePagoInterface } from '../../../core/interfaces/metodos-de-pagos-interface';
import { HorarioXprofesionalService } from '../../../core/services/horariosProfesionalService/horarioProfesional.service';


@Component({
  selector: 'app-pedir-turno',
  standalone: true,
  imports: [CommonModule, NavPedirTurnoComponent, NavPasosComponent, CardComponent, ConfirmacionComponent, SeleccionUsuarioComponent, CalendarioHorarioProfesionalComponent, MetodoPagoComponent],
  templateUrl: './pedir-turno.component.html',
  styleUrl: './pedir-turno.component.css'
})



export class PedirTurnoComponent implements OnInit{

  ruta: ActivatedRoute = inject(ActivatedRoute)
  servicioNegocio :NegocioServiceService= inject(NegocioServiceService)

  servicioMetodoDePago: MetodosDePagoServiceService = inject(MetodosDePagoServiceService);

  servicioHorarioProfesional: HorarioXprofesionalService = inject(HorarioXprofesionalService);


    servicios: ServicioInterface[] = [];
    profesionales: ProfesionalInterface[]=[];
    idNegocio: number = 1;

    ngOnInit(): void {
      const nombreNegocio = this.ruta.snapshot.paramMap.get('nombreNegocio');

      if (nombreNegocio) {
        this.servicioNegocio.getIdNegocioByNombre(nombreNegocio).subscribe(
          {
            next: (idNegocio) => {
              this.idNegocio = idNegocio;


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


    metodoDePagoSeleccionado: number | null = null;
    onMetodoPagoRecibido(metodoId: number) {
      this.metodoDePagoSeleccionado = metodoId;
      console.log('Método de pago seleccionado:', metodoId);
      this.idMetodoPagoToString();
    }


    metodoDePagoString:string = '';
    idMetodoPagoToString(){
      this.servicioMetodoDePago.getMetodosDePago().subscribe({
        next:(response:string[])=> {
          //obtengo todos los metodos de pago
         const  metodosDePago =  response.map((metodo): MetodosDePagoInterface => ({
            metodoDePago: metodo,
          }));
          if ( this.metodoDePagoSeleccionado !== null && this.metodoDePagoSeleccionado >= 0 && this.metodoDePagoSeleccionado < metodosDePago.length) {
            const nombreMetodoDePago = metodosDePago[this.metodoDePagoSeleccionado].metodoDePago;
            console.log('Nombre del método de pago seleccionado:', nombreMetodoDePago);
            this.metodoDePagoString = nombreMetodoDePago;
          } else {
            console.error('ID de método de pago no válido.');
          }


        },error:(error) =>{

        }
      })
    }



  activarOscurecer: boolean = false; // Variable que controla si se oscurece el fondo para mostrar el pop-up
  manejadorOscurecer(event: boolean): void {
    this.activarOscurecer=event;
  }
  @Input() idCliente: number = 1; // ID del cliente que pide el turno

  turno:TurnoInterface={
    idCliente: this.idCliente,
    idNegocio: this.idNegocio,
    metodoPago:this.metodoDePagoString
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






  pasoActual: number = 1; // Variable que controla el paso actual

  // Función para avanzar al siguiente paso
  avanzarPaso(): void {
    if (this.pasoActual < 6) {
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
    this.pasoActual=6;
  }


}

