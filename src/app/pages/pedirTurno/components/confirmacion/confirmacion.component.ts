import { CommonModule } from "@angular/common";
import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit, inject, Input, Output, EventEmitter } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "../../../../core/guards/auth/service/auth.service";
import { EmailInterface } from "../../../../core/interfaces/email-interface";
import { NegocioInterface } from "../../../../core/interfaces/negocio-interface";
import { ServicioInterface } from "../../../../core/interfaces/servicio-interface";
import { TurnoInterface } from "../../../../core/interfaces/turno-interface";
import { UsuarioInterface } from "../../../../core/interfaces/usuario-interface";
import { EmailService } from "../../../../core/services/emailService/email-service.service";
import { HorarioXprofesionalService } from "../../../../core/services/horariosProfesionalService/horarioProfesional.service";
import { NegocioServiceService } from "../../../../core/services/negocioService/negocio-service.service";
import { ProfesionalesServiceService } from "../../../../core/services/profesionalService/profesionales-service.service";
import { ServicioServiceService } from "../../../../core/services/servicioService/servicio-service.service";
import { TurnoService } from "../../../../core/services/turnoService/turno.service";
import { UsuarioService } from "../../../../core/services/usuarioService/usuario.service";
import { BotonComponent } from "../../../../shared/components/boton/boton.component";
import { TextoConIconoComponent } from "../../../../shared/components/texto-con-icono/texto-con-icono.component";
import { obtenerDiaEnumPorNumero } from "../../../../shared/models/diasEnum";
import { estadoTurno } from "../../../../shared/models/estadoTurnoEnum";
import { codigoErrorHttp } from "../../../../shared/models/httpError.constants";
import { ICONOS } from "../../../../shared/models/iconos.constants";
import { obtenerMetodosDePagoPorNumero } from "../../../../shared/models/metodosDePago";
import { PopUpConfirmacionComponent } from "../pop-up-confirmacion/pop-up-confirmacion.component";


@Component({
  selector: 'app-confirmacion',
  standalone: true,
  imports: [CommonModule, TextoConIconoComponent, BotonComponent, PopUpConfirmacionComponent],
  templateUrl: './confirmacion.component.html',
  styleUrl: './confirmacion.component.css'
})
export class ConfirmacionComponent implements OnInit {

  //variables
  botonActivado = false;
  iconos = ICONOS;
  servicioTexto: string = '';
  profesionalTexto: string = '';
  precioTexto: string = '';
  ubicacionTexto: string = '';
  metodoDePagoTexto: string = '';
  detalleTexto: string = '';

  //servicios
  UsuarioService: UsuarioService = inject(UsuarioService);
  ServicioServiceService: ServicioServiceService = inject(ServicioServiceService);
  profesionalService: ProfesionalesServiceService = inject(ProfesionalesServiceService);
  NegocioServiceService: NegocioServiceService = inject(NegocioServiceService);
  turnoService: TurnoService = inject(TurnoService);
  authService: AuthService = inject(AuthService);
  horarioProfesionalService: HorarioXprofesionalService = inject(HorarioXprofesionalService);

  //interfaces
  usuario: UsuarioInterface = {} as UsuarioInterface;
  servicio: ServicioInterface = { nombre: '', duracion: 0, precio: 0 };
  profesional: UsuarioInterface = {} as UsuarioInterface;
  negocio: NegocioInterface = {} as NegocioInterface;

  //todo reemplazar por los valores reales que se van asignando en el turno
  //inputs
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
    estado: estadoTurno.RESERVADO
  }




  ngOnInit(): void {
    this.turnoCreado.idCliente = this.authService.getIdUsuario()!;
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
    if (this.servicio.precio !== undefined) {
      this.precioTexto = this.servicio.precio.toString();
    }
    else {

    }


    this.metodoDePagoTexto = this.turnoCreado.metodosDePagoEnum.replace("_", " ").toLocaleLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());;
    this.detalleTexto = 'Se enviará un mail de aviso 2 horas antes del servicio. En caso de cancelar el turno avisar 2 horas antes';
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

      },
      error: (error) => {
        console.log(error);
      }
    })
  }

  obtenerServicio(idNegocio: number, idServicio: number) {

    this.ServicioServiceService.getServicioPorIdNegocio(idNegocio, idServicio).subscribe({
      next: (servicio) => {

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
    const emailCliente = this.usuario.credencial.email;//cliente
    const mensajeEnviar = "Tu turno ha sido confirmado";


    return {
      email: emailCliente,
      emailNegocio: emailNegocio,
      mensaje: mensajeEnviar,
      fecha: this.ajustarFechaLocal(this.turnoCreado.fechaInicio),
      horario: this.turnoCreado.horarioProfesional.horaInicio.toLocaleString(),
      direccion: this.negocio.calle + ' ' + this.negocio.altura,
      servicio: this.servicio.nombre,
      precio: String(this.servicio.precio),
      nombreProfesional: this.profesional.nombre,
      ubicacion: this.ubicacionTexto,
    }
  };
  private ajustarFechaLocal(fecha: Date): Date {
    const copiaDate = new Date(fecha); // copiar la fecha para no modificar la original

    // Restar el offset de la zona horaria local para corregir la fecha
    const offsetMs = copiaDate.getTimezoneOffset() * 60000; // convertir minutos a milisegundos
    const fechaCorrecta = new Date(copiaDate.getTime() - offsetMs);

    return fechaCorrecta;
  }
  @Output() oscurecerFondo = new EventEmitter<boolean>();

  enviarOscurecer() {
    this.oscurecerFondo.emit(true);
  }

  seEnvioBien: boolean = false;


  router = inject(Router);

  confirmarTurno() {
    this.turnoService.postTurno(this.turnoCreado).subscribe({
      next: (respuesta) => {
        //si hay exito envio el mail
        this.reservarTurno();

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

  reservarTurno(){
    const idHorario = this.turnoCreado.horarioProfesional.idHorario!;
    const idNegocio = this.turnoCreado.idNegocio;
    const idProfesional = this.turnoCreado.horarioProfesional.idProfesional;
    const estado = false;
    this.horarioProfesionalService.patchEstadoHorarioProfesional(idHorario, idNegocio, idProfesional, estado).subscribe({
      next: (respuesta) => {
        console.log(respuesta);
      },
      error: (error) => {
        console.error(error);
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
