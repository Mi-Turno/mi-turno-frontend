import { TurnoInterface } from '../../core/interfaces/turno-interface';
import { Component, inject, OnInit  } from '@angular/core';
import { NavPedirTurnoComponent } from "../pedirTurno/nav-pedir-turno/nav-pedir-turno.component";
import { NegocioInterface } from '../../core/interfaces/negocio-interface';
import { NegocioServiceService } from '../../core/services/negocioService/negocio-service.service';
import { ClienteService } from '../../core/services/clienteService/cliente.service';
import { ClienteInterface } from '../../core/interfaces/cliente-interface';
import { CommonModule } from '@angular/common';
import { WidgetBienvenidaComponent } from './components/widget-bienvenida/widget-bienvenida.component';
import { TablaTurnosComponent } from './components/tabla-turnos/tabla-turnos.component';
import { PopupElegirNegocioComponent } from './components/popup-elegir-negocio/popup-elegir-negocio.component';
import { NavBarLandingComponent } from "../landing-page/components/nav-bar-landing/nav-bar-landing.component";





@Component({
  selector: 'app-dashboard-cliente',
  standalone: true,
  imports: [CommonModule, NavPedirTurnoComponent, WidgetBienvenidaComponent, TablaTurnosComponent, PopupElegirNegocioComponent],
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
    rolUsuario:''
  }

  ngOnInit(): void {
    this.idCliente = Number(localStorage.getItem('idUsuario'));
    this.obtenerInfo()
  }



  listadoTurnos:TurnoInterface[] = [];
/*

  obtenerInfo(){
  //obtener todos los negocios
  this.servicioNegocio.getTodosLosNegocios().subscribe({
    next: (negocios: NegocioInterface[])=>{
      this.listadoNegocios= negocios;
console.log("Negocios del back crudos", negocios);
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

*/


obtenerInfo() {
  // Obtener todos los negocios
  this.servicioNegocio.getTodosLosNegocios().subscribe({
    next: (negocios: NegocioInterface[]) => {
      // Asignar directamente los negocios a listadoNegocios
      this.listadoNegocios = negocios;
      console.log("Negocios que recibo del back", this.listadoNegocios);
    },
    error: (error) => {
      console.error(error);
    }
  });

  // Obtener nombre y apellido del cliente
  this.servicioCliente.getClienteById(this.idCliente).subscribe({
    next: (unCliente: ClienteInterface) => {
      this.clienteActual = unCliente;
    },
    error: (error) => {
      console.error(error);
    }
  });
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

mostrarNegocios() {
  console.log("Negocios que recibo del back", this.listadoNegocios);

}

}
