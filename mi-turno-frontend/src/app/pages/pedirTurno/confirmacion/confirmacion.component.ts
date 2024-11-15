import { ROLES } from './../../../shared/models/rolesUsuario.constants';
import { NegocioServiceService } from './../../../core/services/negocioService/negocio-service.service';
import { HorarioProfesional } from './../../../core/interfaces/horarioProfesional.interface';
import { Component, EventEmitter, inject, Input, Output, OnInit } from '@angular/core';
import { NavPedirTurnoComponent } from "../nav-pedir-turno/nav-pedir-turno.component";
import { NavPasosComponent } from "../nav-pasos/nav-pasos.component";
import { ICONOS } from '../../../shared/models/iconos.constants';
import { TextoConIconoComponent } from "../../../shared/components/texto-con-icono/texto-con-icono.component";
import { BotonComponent } from "../../../shared/components/boton/boton.component";
import { EmailInterface } from '../../../core/interfaces/email-interface';
import { EmailService } from '../../../core/services/emailService/email-service.service';
import { HttpErrorResponse } from '@angular/common/http';
import { PopUpConfirmacionComponent } from "../pop-up-confirmacion/pop-up-confirmacion.component";
import { CommonModule } from '@angular/common';
import { codigoErrorHttp } from '../../../shared/models/httpError.constants';
import { UsuarioService } from '../../../core/services/usuarioService/usuario.service';
import { UsuarioInterface } from '../../../core/interfaces/usuario-interface';
import { ProfesionalesServiceService } from '../../../core/services/profesionalService/profesionales-service.service';
import { ServicioServiceService } from '../../../core/services/servicioService/servicio-service.service';
import { ServicioInterface } from '../../../core/interfaces/servicio-interface';
import { TurnoInterface } from '../../../core/interfaces/turno-interface';
import { obtenerDiaEnumPorNumero } from '../../../shared/models/diasEnum';
import { MetodosDePago, obtenerMetodosDePagoPorNumero } from '../../../shared/models/metodosDePago';
import { NegocioInterface } from '../../../core/interfaces/negocio-interface';
import { TurnoService } from '../../../core/services/turnoService/turno.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-confirmacion',
  standalone: true,
  imports: [CommonModule, TextoConIconoComponent, BotonComponent, PopUpConfirmacionComponent],
  templateUrl: './confirmacion.component.html',
  styleUrl: './confirmacion.component.css'
})
export class ConfirmacionComponent implements OnInit {


  botonActivado = false;
  iconos = ICONOS;
  //todo reemplazar por los valores reales que se van asignando en el turno

  @Input() turnoCreado: TurnoInterface = {
    idCliente: 0,
    idNegocio: 0,
    horarioProfesional: {
      idHorario: 0,
      idProfesional: 0,
      dia: obtenerDiaEnumPorNumero(0),
      horaInicio: new Date(),
    },
    metodosDePagoEnum: obtenerMetodosDePagoPorNumero(0),
    idServicio: 0,
    fechaInicio: new Date(),
    estado: true
  }



  UsuarioService: UsuarioService = inject(UsuarioService);
  usuario: UsuarioInterface = {} as UsuarioInterface;

  ServicioServiceService: ServicioServiceService = inject(ServicioServiceService);
  servicio: ServicioInterface = { nombre: '', duracion: 0, precio: 0 };

  profesionalService: ProfesionalesServiceService = inject(ProfesionalesServiceService);
  profesional: UsuarioInterface = {} as UsuarioInterface;

  NegocioServiceService: NegocioServiceService = inject(NegocioServiceService);

  negocio: NegocioInterface = {} as NegocioInterface;



  turnoService: TurnoService = inject(TurnoService);



  servicioTexto: string = '';
  profesionalTexto: string = '';
  precioTexto: string = '';
  ubicacionTexto: string = '';
  metodoDePagoTexto: string = '';
  detalleTexto: string = '';



  ngOnInit(): void {
    this.turnoCreado.idCliente = Number(localStorage.getItem('idUsuario'));
    this.obtenerCliente(this.turnoCreado.idCliente);
    this.obtenerProfesional(this.turnoCreado.horarioProfesional.idProfesional);
    this.obtenerServicio(this.turnoCreado.idNegocio, this.turnoCreado.idServicio);
    this.obtenerNegocio(this.turnoCreado.idNegocio);

    this.settearMostrarInfo();

  }
  settearMostrarInfo() {
    this.servicioTexto = this.servicio.nombre;
    this.profesionalTexto = this.profesional.nombre;


    this.fecha ='Fecha: '+ this.formatearFecha(this.turnoCreado.fechaInicio);
    //this.turnoCreado.horarioProfesional.horaInicio = new Date(this.turnoCreado.horarioProfesional.horaInicio);
    if (this.servicio.precio !== undefined) {
      this.precioTexto = this.servicio.precio.toString();
    }
    else {
      console.log("SERVICIO PRECIO UNDEFINED");
    }


    this.metodoDePagoTexto = this.turnoCreado.metodosDePagoEnum.replace("_", " ").toLocaleLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());;
    this.detalleTexto = 'Se enviará un mail de aviso 3 horas antes del servicio. En caso de cancelar el turno avisar 2 horas antes';
  }
  formatearFecha(fecha: Date): string {
    if (!fecha) return '';

    return fecha.toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }


  obtenerCliente(idCliente: number) {
    this.UsuarioService.obtenerUsuarioPorId(idCliente).subscribe({
      next: (usuario) => {
        this.usuario = usuario;
        console.log(usuario);
      },
      error: (error) => {
        console.log(error);
      }
    })
  }
  obtenerProfesional(idProfesional: number) {
    this.UsuarioService.obtenerUsuarioPorId(idProfesional).subscribe({
      next: (nuevoProfesional) => {
        this.profesional = nuevoProfesional;
        console.log(nuevoProfesional);
      },
      error: (error) => {
        console.log(error);
      }
    })
  }

  obtenerServicio(idNegocio: number, idServicio: number) {

    this.ServicioServiceService.GETservicioPorIdNegocio(idNegocio, idServicio).subscribe({
      next: (servicio) => {
        console.log(servicio);
        this.servicio = servicio;
      },
      error: (error) => {
        console.log(error);
      }
    })

  }
  obtenerNegocio(idNegocio: number) {

    this.NegocioServiceService.getNegocioById(idNegocio).subscribe({
      next: (negocio) => {
        this.negocio = negocio;
        console.log(negocio);
        this.ubicacionTexto = negocio.calle + ', ' + negocio.altura + ', ' + negocio.detalle;
      },
      error: (error) => {
        console.log(error);
      }
    });
  }



  // titulo: string = 'Confirmacion';
  fecha: string = "Fecha de turno: " + this.turnoCreado.fechaInicio.toDateString();

  settearHorario(): string {
    return `Hora de inicio: ${this.turnoCreado.horarioProfesional.horaInicio}`;
  }



  emailService: EmailService = inject(EmailService)
  crearEmail(): EmailInterface {
    //formato para enviarlo
    const emailNegocio = "miturno.flf@gmail.com";//negocio
    const emailCliente = this.usuario.email;//cliente
    const mensajeEnviar = "Tu turno ha sido confirmado";


    return {
      email: emailCliente,
      emailNegocio: emailNegocio,
      mensaje: mensajeEnviar,
      fecha: this.turnoCreado.fechaInicio,
      horario: this.turnoCreado.horarioProfesional.horaInicio.toLocaleString(),
      direccion: this.negocio.calle + ' ' + this.negocio.altura,
      servicio: this.servicio.nombre,
      precio: String(this.servicio.precio),
      nombreProfesional: this.profesional.nombre,
      ubicacion: this.ubicacionTexto,
    }
  };

  @Output() oscurecerFondo = new EventEmitter<boolean>();

  enviarOscurecer() {
    this.oscurecerFondo.emit(true);
  }

  seEnvioBien: boolean = false;


  router = inject(Router);

  confirmarTurno() {


    this.turnoService.postTurno(this.turnoCreado).subscribe({
      next: (respuesta) => {
        console.log(respuesta);
        //si hay exito envio el mail
        this.enviarEmailAlCliente();

        setTimeout(() => {
          this.router.navigateByUrl('/dashboard-cliente');
        }, 3000);

      },
      error: (error) => {
        console.error(error, "Error al confirmar el turno");
      }
    });

  }



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
