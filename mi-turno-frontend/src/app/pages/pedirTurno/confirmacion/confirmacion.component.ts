import { Component, inject } from '@angular/core';
import { NavPedirTurnoComponent } from "../nav-pedir-turno/nav-pedir-turno.component";
import { NavPasosComponent } from "../nav-pasos/nav-pasos.component";
import { ICONOS } from '../../../shared/models/iconos.constants';
import { TextoConIconoComponent } from "../../../shared/components/texto-con-icono/texto-con-icono.component";
import { BotonComponent } from "../../../shared/components/boton/boton.component";
import { EmailInterface } from '../../../core/interfaces/email-interface';
import { EmailService } from '../../../core/services/emailService/email-service.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NavBarComponent } from "../../landing/nav-landing/nav-bar.component";

@Component({
  selector: 'app-confirmacion',
  standalone: true,
  imports: [NavPedirTurnoComponent, NavPasosComponent, TextoConIconoComponent, BotonComponent, NavBarComponent],
  templateUrl: './confirmacion.component.html',
  styleUrl: './confirmacion.component.css'
})
export class ConfirmacionComponent {

  desactivado=false;
  iconos = ICONOS;
  //todo reemplazar por los valores reales que se van asignando en el turno
  titulo:string='Confirmacion';
  fecha:string='Martes 18 de agosto,2024';
  horario:string='13:00hs';
  servicio:string='Corte';
  profesional:string='Tahiel';
  precio:string='11.000';
  ubicacion:string ='Av. Pescadores 6712';
  detalle:string ='Se enviará un mail de aviso 3 horas antes del servicio. En caso de cancelar el turno avisar 2 horas antes';

emailService:EmailService = inject(EmailService)
crearEmail():EmailInterface{
  //todo agregar lo que esta comentado en el back para generar el mail con todos los datos
  //este seria el formato para enviarlo
  const emailNegocio ="miturno.flf@gmail.com";//negocio
  const emailCliente="leonardocaimmi1@gmail.com";//cliente
  const mensajeEnviar="Tu turno ha sido confirmado";
  //fecha
  //horario
  this.servicio;
  //profesional
  this.precio;
  const direccion=this.ubicacion;
  return {
    email:emailCliente,
    emailNegocio:emailNegocio,
    mensaje:mensajeEnviar,
    servicio:this.servicio,
    precio:this.precio,
    direccion:direccion
  }
};
enviarEmailAlCliente(){
  this.desactivado=true;
  const email:EmailInterface = this.crearEmail();
  this.emailService.postEnviarEmail(email).subscribe({
    next:(response) =>{
      console.log(response);
    },
    error:(error:HttpErrorResponse)=>{
      this.desactivado=false;
      alert('Error al enviar el mail');
      console.log(error);
    }
  })
}

}
