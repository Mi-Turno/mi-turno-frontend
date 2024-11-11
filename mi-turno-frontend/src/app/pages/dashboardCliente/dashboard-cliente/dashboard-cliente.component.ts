import { TurnoInterface } from './../../../core/interfaces/turno-interface';
import { ChangeDetectorRef, Component, inject, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { NavPedirTurnoComponent } from "../../pedirTurno/nav-pedir-turno/nav-pedir-turno.component";
import { WidgetBienvenidaComponent } from "../widget-bienvenida/widget-bienvenida.component";
import { TablaTurnosComponent } from "../tabla-turnos/tabla-turnos.component";
import { NegocioInterface } from '../../../core/interfaces/negocio-interface';
import { NegocioServiceService } from '../../../core/services/negocioService/negocio-service.service';
import { ClienteService } from '../../../core/services/clienteService/cliente.service';
import { ClienteInterface } from '../../../core/interfaces/cliente-interface';
import { MetodosDePago } from '../../../shared/models/metodosDePago';
import { PopupElegirNegocioComponent } from "../popup-elegir-negocio/popup-elegir-negocio.component";
import { CommonModule } from '@angular/common';
import { DiasEnum } from '../../../shared/models/diasEnum';




@Component({
  selector: 'app-dashboard-cliente',
  standalone: true,
  imports: [CommonModule,NavPedirTurnoComponent, WidgetBienvenidaComponent, TablaTurnosComponent, PopupElegirNegocioComponent],
  templateUrl: './dashboard-cliente.component.html',
  styleUrl: './dashboard-cliente.component.css'
})
export class DashboardClienteComponent implements OnInit{

  idCliente: number = 0;

  //arreglos

  listadoNegocios:NegocioInterface[] = [];

  //servicios
  servicioNegocio: NegocioServiceService = inject(NegocioServiceService);
  servicioCliente: ClienteService = inject(ClienteService);


  //variables
  popupLevantado:boolean = false;
  clienteActual:ClienteInterface={
    nombre:'',
    apellido:'',
    email:'',
    password:'',
    telefono:'',
    fechaNacimiento:'',
    idRolUsuario:''
  }

  ngOnInit(): void {
    this.idCliente = Number(localStorage.getItem('idUsuario'));

    this.obtenerInfo()

  }



  listadoTurnos:TurnoInterface[] = [];

  obtenerInfo(){


  //obtener todos los negocios
  this.servicioNegocio.getTodosLosNegocios().subscribe({
    next: (negocios: NegocioInterface[])=>{
      console.log("Negocios que recibod del back",negocios);
      // this.listadoNegocios= negocios;

      negocios.map((unNegocio:NegocioInterface)=>{
        this.listadoNegocios.push({
          idUsuario:unNegocio.idUsuario,
          nombre: unNegocio.nombre,
          apellido: unNegocio.apellido,
          email: unNegocio.email,
          password: unNegocio.password,
          telefono: unNegocio.telefono,
          fechaNacimiento: unNegocio.fechaNacimiento,
          idRolUsuario: unNegocio.idRolUsuario,
          rubro: unNegocio.rubro,
          calle: unNegocio.calle,
          altura: unNegocio.altura,
          detalle: unNegocio.detalle
        });


      })
      
    },
    error: (error)=>{
      console.error(error);
    }
  })




  //obtener nombre y apellido del cliente
  this.servicioCliente.getClienteById(this.idCliente).subscribe({
    next:(unCliente:ClienteInterface)=>{
      this.clienteActual=unCliente;
    },
    error:(error)=>{
      console.error(error)
    }
  })

  }
  estiloGeneralContainer:string="generalContainer"

  manejarLevantarPopUp(event:number){
    if(event === 1 ){
      this.estiloGeneralContainer="generalContainerSobrepuesto"
      this.popupLevantado = true;
    }

    if(event===0){
      this.estiloGeneralContainer="generalContainer"
      this.popupLevantado = false;
    }
  }

}
