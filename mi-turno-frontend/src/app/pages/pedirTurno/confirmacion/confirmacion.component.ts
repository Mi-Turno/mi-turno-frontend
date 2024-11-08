import { Component, EventEmitter, inject, Input, Output, OnInit } from '@angular/core';
import { NavPedirTurnoComponent } from "../nav-pedir-turno/nav-pedir-turno.component";
import { NavPasosComponent } from "../nav-pasos/nav-pasos.component";
import { ICONOS } from '../../../shared/models/iconos.constants';
import { TextoConIconoComponent } from "../../../shared/components/texto-con-icono/texto-con-icono.component";
import { BotonComponent } from "../../../shared/components/boton/boton.component";
import { EmailInterface } from '../../../core/interfaces/email-interface';
import { EmailService } from '../../../core/services/emailService/email-service.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NavBarComponent } from "../../landing/nav-landing/nav-bar.component";
import { PopUpConfirmacionComponent } from "../pop-up-confirmacion/pop-up-confirmacion.component";
import { CommonModule } from '@angular/common';
import { codigoErrorHttp } from '../../../shared/models/httpError.constants';
import { UsuarioService } from '../../../core/services/usuarioService/usuario.service';
import { UsuarioInterface } from '../../../core/interfaces/usuario-interface';
import { ProfesionalesServiceService } from '../../../core/services/profesionalService/profesionales-service.service';
import { ProfesionalInterface } from '../../../core/interfaces/profesional-interface';
import { ServicioServiceService } from '../../../core/services/servicioService/servicio-service.service';
import { ServicioInterface } from '../../../core/interfaces/servicio-interface';
import { ROLES } from '../../../shared/models/rolesUsuario.constants';

@Component({
  selector: 'app-confirmacion',
  standalone: true,
  imports: [CommonModule, NavPedirTurnoComponent, NavPasosComponent, TextoConIconoComponent, BotonComponent, NavBarComponent, PopUpConfirmacionComponent],
  templateUrl: './confirmacion.component.html',
  styleUrl: './confirmacion.component.css'
})
export class ConfirmacionComponent implements OnInit {

  botonActivado = false;
  iconos = ICONOS;
  //todo reemplazar por los valores reales que se van asignando en el turno
  @Input() idCliente!: number;
  @Input() idNegocio!: number;
  @Input() idServicio!: number | null | undefined;//Es null|undefined porque en pedir-turno-component se asigna el valor en distintos pasos
  @Input() idProfesional: number | null | undefined;//Es null|undefined porque en pedir-turno-component se asigna el valor en distintos pasos

  UsuarioService: UsuarioService = inject(UsuarioService);
  usuario: UsuarioInterface = { idUsuario: 0, nombre: '', apellido: '', email: '', telefono: '', fechaNacimiento: '', password: '', idRolUsuario: 0, estado: undefined };

  ServicioServiceService: ServicioServiceService = inject(ServicioServiceService);
  servicio:ServicioInterface = { nombre:'',duracion: 0, precio: 0};

  profesionalService: ProfesionalesServiceService = inject(ProfesionalesServiceService);
  profesional:  UsuarioInterface = { idUsuario: 0, nombre: '', apellido: '', email: '', telefono: '', fechaNacimiento: '', password: '', idRolUsuario: 0, estado: undefined };


  ngOnInit(): void {
    this.obtenerCliente();
    this.obtenerProfesional();

  }

  obtenerCliente() {
    this.UsuarioService.obtenerUsuarioPorId(this.idCliente).subscribe({
      next: (usuario) => {
        this.usuario = usuario;
      },
      error: (error) => {
        console.log(error);
      }
    })
  }
  obtenerProfesional() {
    if (this.idProfesional !== undefined && this.idProfesional !== null) {
      this.UsuarioService.obtenerUsuarioPorId(this.idCliente).subscribe({
        next: (profesional) => {
          this.profesional = profesional;
        },
        error: (error) => {
          console.log(error);
        }
      })
    }
  }
  obtenerServicio() {
    if (this.idServicio !== undefined && this.idServicio !== null) {
      this.ServicioServiceService.GETservicioPorIdNegocio(this.idNegocio, this.idServicio).subscribe({
        next: (servicio) => {
          this.servicio = servicio;
        },
        error: (error) => {
          console.log(error);
        }
      })
    }
  }
  titulo: string = 'Confirmacion';
  fecha: string = 'Martes 18 de agosto,2024';
  horario: string = '13:00hs';
  //servicio: string = 'Corte';
  // profesional:string='Tahiel';
  //precio:string='11.000';
  ubicacion: string = 'Av. Pescadores 6712';
  detalle: string = 'Se enviará un mail de aviso 3 horas antes del servicio. En caso de cancelar el turno avisar 2 horas antes';

  emailService: EmailService = inject(EmailService)
  crearEmail(): EmailInterface {
    //todo agregar lo que esta comentado en el back para generar el mail con todos los datos
    //este seria el formato para enviarlo
    const emailNegocio = "miturno.flf@gmail.com";//negocio
    const emailCliente = this.usuario.email;//cliente
    const mensajeEnviar = "Tu turno ha sido confirmado";
    //fecha
    //horario
    this.servicio;
    //profesional
    //this.precio;
    const direccion = this.ubicacion;
    return {
      email: emailCliente,
      emailNegocio: emailNegocio,
      mensaje: mensajeEnviar,
      servicio: this.servicio.nombre,
      precio: /*this.profesional.precioServicio.toString()*/'0',//todo hacer metodo de getProfesionalPorIdNegocio
      direccion: direccion
    }
  };

  @Output() oscurecerFondo = new EventEmitter<boolean>();

  enviarOscurecer() {
    this.oscurecerFondo.emit(true);
  }

  seEnvioBien: boolean = false;

  enviarEmailAlCliente() {
    this.botonActivado = true;
    const email: EmailInterface = this.crearEmail();
    this.emailService.postEnviarEmail(email).subscribe({
      next: (response) => {
        this.enviarOscurecer();
        this.seEnvioBien = true;
        console.log(response);
      },
      error: (error: HttpErrorResponse) => {
        if (error.status === codigoErrorHttp.NO_ENCONTRADO) {
          alert('Error 404: Email no encontrado');

        } else if (error.status === codigoErrorHttp.ERROR_SERVIDOR) {
          alert('Error 500: Error del servidor');

        } else if (error.status === codigoErrorHttp.ERROR_CONTACTAR_SERVIDOR) {
          alert('Error de conexión: No se pudo contactar con el servidor (ERR_CONNECTION_REFUSED)');
        } else if (error.status === codigoErrorHttp.ERROR_REPETIDO) {
          alert('Error 409: el Email ya existe en el sistema');
        } else {
          alert('Error al enviar el Email');
        }
        this.botonActivado = false;
        console.log(error);
      }
    })
  }

}
