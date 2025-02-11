
import { ChangeDetectorRef, Component, inject, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServicioServiceService } from '../../../../core/services/servicioService/servicio-service.service';
import { ProfesionalesServiceService } from '../../../../core/services/profesionalService/profesionales-service.service';
import { NegocioInterface } from '../../../../core/interfaces/negocio-interface';
import { ServicioInterface } from '../../../../core/interfaces/servicio-interface';
import { TurnoInterface } from '../../../../core/interfaces/turno-interface';
import { ClienteService } from '../../../../core/services/clienteService/cliente.service';
import { TurnoService } from '../../../../core/services/turnoService/turno.service';
import { estadoTurno } from '../../../../shared/models/estadoTurnoEnum';
import { catchError, defaultIfEmpty, forkJoin, map, Observable, of, switchMap } from 'rxjs';
import { AuthService } from '../../../../core/guards/auth/service/auth.service';
import { HorarioXprofesionalService } from '../../../../core/services/horariosProfesionalService/horarioProfesional.service';
import { EmailService } from '../../../../core/services/emailService/email-service.service';
import { EmailCancelacion } from '../../../../core/interfaces/email-cancelacion-desde-negocio';
import { NegocioServiceService } from '../../../../core/services/negocioService/negocio-service.service';


interface mostrarTurnosInterface {
  nombreNegocio: string,
  fechaInicio: string,
  horario: string,
  nombreServicio: string,
  precioServicio: string,
  nombreProfesional: string,
  estado: estadoTurno,
  idNegocio: number,
  idTurno: number
}



@Component({
  selector: 'app-tabla-turnos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tabla-turnos.component.html',
  styleUrl: './tabla-turnos.component.css'
})
export class TablaTurnosComponent implements OnInit {

  //variables
  idCliente: number = 0;
  estado = estadoTurno;

  //servicios
  servicioServicios: ServicioServiceService = inject(ServicioServiceService);
  servicioProfesional: ProfesionalesServiceService = inject(ProfesionalesServiceService);
  turnoService: TurnoService = inject(TurnoService);
  servicioCliente: ClienteService = inject(ClienteService);
  authService: AuthService = inject(AuthService);
  horarioProfesional: HorarioXprofesionalService = inject(HorarioXprofesionalService);
  emailService: EmailService = inject(EmailService);
  cuerpoEmail: EmailCancelacion = {} as EmailCancelacion;
  negocioService: NegocioServiceService = inject(NegocioServiceService);
  //arreglos
  @Input() listadoNegocios: NegocioInterface[] = [];
  listadoTurnos: TurnoInterface[] = [];
  listadoMostrarTurnos: mostrarTurnosInterface[] = [];

  //constructor
  constructor(private cdr: ChangeDetectorRef) { }
  ngOnInit(): void {
    this.idCliente = this.authService.getIdUsuario()!;
    this.setearTurnos();

  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['listadoNegocios'] || changes['listadoTurnos']) {
      if (this.listadoNegocios.length > 0 && this.listadoTurnos.length > 0) {
        this.setearTurnos();
      }
    }
  }
  obtenerNumeroSoporteNegocio(idNegocio: number) {
    this.negocioService.getNumeroDeSoporte(this.authService.getIdUsuario()!).subscribe({
      next: (numeroResponse) => {
        this.cuerpoEmail.numeroSoporte = numeroResponse;
        console.log(numeroResponse);
      },
      error: (error) => {
      }
    });
  }

  setearTurnos() {
    this.listadoMostrarTurnos = []; // Limpiar antes de agregar nuevos turnos

    this.servicioCliente.getListadoDeTurnosPorIdCliente(this.idCliente).pipe(
      switchMap((turnos: TurnoInterface[]) => {
        this.listadoTurnos = turnos;

        //Mapeamos cada turno segun las necesidades de la tabla
        return forkJoin(
          turnos.map((unTurno: TurnoInterface) =>
            this.obtenerDatosTurno(unTurno) //Función para manejar cada turno
          )
        );
      })
    ).subscribe({
      next: (turnosMostrados: mostrarTurnosInterface[]) => {
        this.listadoMostrarTurnos = this.ordenarArregloTurnos(turnosMostrados);
        this.cdr.detectChanges(); //Reflejar los cambios en la vista
      },
      error: (error) => {
        console.error('Error al obtener los turnos:', error);
      }
    });
  }

  ordenarArregloTurnos(arreglo: mostrarTurnosInterface[]) {
    return arreglo.sort((a, b) => {
      const fecha = a.fechaInicio.toString().localeCompare(b.fechaInicio.toString());
      if (fecha !== 0) {
        return fecha;
      }
      return a.horario.toString().localeCompare(b.horario.toString());
    });
  }

  //Metodo combina las llamadas para un único turno
  obtenerDatosTurno(unTurno: TurnoInterface): Observable<mostrarTurnosInterface> {
    const unTurnoAux: mostrarTurnosInterface = {
      fechaInicio: unTurno.fechaInicio.toString(),
      horario: unTurno.horarioProfesional.horaInicio.toString(),
      nombreNegocio: this.listadoNegocios.find((n) => n.idUsuario === unTurno.idNegocio)?.nombre || '',
      idNegocio: unTurno.idNegocio,
      idTurno: unTurno.idTurno!,
      estado: unTurno.estado!,
      nombreServicio: '',
      precioServicio: '',
      nombreProfesional: ''
    };

    return forkJoin({
      servicio: this.servicioServicios.getServicioPorIdNegocio(unTurno.idNegocio, unTurno.idServicio),
      profesional: this.servicioProfesional.getProfesionalPorIdNegocio(unTurno.idNegocio, unTurno.horarioProfesional.idProfesional)
    }).pipe(
      map(({ servicio, profesional }) => {
        unTurnoAux.nombreServicio = servicio.nombre;
        unTurnoAux.precioServicio = servicio.precio ? servicio.precio.toString() : '';
        unTurnoAux.nombreProfesional = profesional.nombre;
        return unTurnoAux;
      })
    );
  }

  verificarEstado(fechaTurno: string, horaTurno: string): 'Pagado' | 'Reservado' {
    const fechaActual = new Date();
    const [anio, mes, dia] = fechaTurno.split('-').map(Number);
    const [hora, minutos] = horaTurno.split(':').map(Number);

    if (isNaN(anio) || isNaN(mes) || isNaN(dia) || isNaN(hora) || isNaN(minutos)) {
      console.error('Fecha u hora con formato incorrecto');
      return 'Reservado';
    }

    const fechaTurnoDate = new Date(anio, mes - 1, dia, hora, minutos);
    return fechaTurnoDate < fechaActual ? 'Pagado' : 'Reservado';
  }

  determinarEstado(unTurno: any): string {
    if (unTurno.estado) {
      return unTurno.estado;
    }
    return this.verificarEstado(unTurno.fechaInicio, unTurno.horario);
  }




  cancelarTurno(idNegocio: number, idTurno: number) {
    const estadoTurno = this.determinarEstado({ estado: idTurno });

    if (estadoTurno !== this.estado.COBRADO && estadoTurno !== this.estado.CANCELADO) {
      this.turnoService.updateTurno(idNegocio, idTurno, this.estado.CANCELADO).subscribe({
        next: (response) => {
          this.darDeAltaHorario(response.horarioProfesional.idHorario!, response.idNegocio, response.horarioProfesional.idProfesional, true);

          const nombreNegocio = this.listadoNegocios.find((negocio) => negocio.idUsuario === response.idNegocio)?.nombre || '';
          const emailCliente = this.authService.getEmailUsuario()!;

          // Obtener número de soporte con manejo de errores
          const numeroSoporte$ = this.negocioService.getNumeroDeSoporte(response.idNegocio).pipe(
            catchError((error) => {
              console.error('Error obteniendo número de soporte', error);
              return of(null); // Si falla, devuelve null
            }),
            defaultIfEmpty(null) // Si no hay respuesta, devuelve null
          );

          // Ejecutamos ambas llamadas en paralelo
          forkJoin({ numeroSoporte: numeroSoporte$ }).subscribe({
            next: ({ numeroSoporte }) => {
              this.cuerpoEmail = {
                nombreCliente: this.authService.getNombreUsuario()!,
                nombreNegocio: nombreNegocio,
                emailCliente: emailCliente,
                numeroSoporte: typeof numeroSoporte === 'number' ? numeroSoporte : 0 // Si es null o no es número, usa 0 por defecto
              };

              this.emailService.enviarEmailCancelacionCliente(this.cuerpoEmail).subscribe({
                next: (response) => {
                  console.log('Email enviado', response);
                },
                error: (error) => {
                  console.error('Error al enviar email', error);
                }
              });

              alert('Turno cancelado');
              window.location.reload();
            },
            error: (error) => {
              console.error('Error en forkJoin', error);
            }
          });
        },
        error: (error) => {
          console.error('Error al cancelar turno', error);
        }
      });
    } else {
      alert('No se puede cancelar este turno. Está cobrado o ya fue cancelado.');
    }
  }

  darDeAltaHorario(idHorario: number, idNegocio: number, idProfesional: number, estado: boolean) {
    this.horarioProfesional.patchEstadoHorarioProfesional(idHorario, idNegocio, idProfesional, estado).subscribe({
      next: (response) => {
        console.log('Horario dado de alta', response);

      },
      error: (error) => {
        console.error('Error al dar de alta horario', error);
      }
    });
  }
}




