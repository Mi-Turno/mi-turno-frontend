import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { TurnoInterface } from '../../../../core/interfaces/turno-interface';
import { ClienteService } from '../../../../core/services/clienteService/cliente.service';
import { TurnoService } from '../../../../core/services/turnoService/turno.service';
import { ProfesionalesServiceService } from '../../../../core/services/profesionalService/profesionales-service.service';
import { ServicioServiceService } from '../../../../core/services/servicioService/servicio-service.service';
import { AtributosTurno } from '../../../../core/interfaces/atributos-turno';
import { estadoTurno } from '../../../../shared/models/estadoTurnoEnum';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/guards/auth/service/auth.service';

@Component({
  selector: 'app-turnos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './turnos.component.html',
  styleUrl: './turnos.component.css',
})
export class TurnosComponent implements OnInit {
  turnos: TurnoInterface[] = [];
  turnoTabla: AtributosTurno[] = [];
  // Servicios
  turnoService: TurnoService = inject(TurnoService);
  clienteService: ClienteService = inject(ClienteService);
  profesionalService: ProfesionalesServiceService = inject(
    ProfesionalesServiceService
  );
  servicioService: ServicioServiceService = inject(ServicioServiceService);
  authService: AuthService = inject(AuthService);
  // Variables
  nombreCliente: string = '';
  nombreProfesional: string = '';
  nombreServicio: string = '';
  idNegocio: number = 0;
  segmento: string = '';
  router = inject(Router);

  ngOnInit(): void {
    this.idNegocio = this.authService.getIdUsuario()!;
    this.cargarTurnos();
    setInterval(() => {
      this.verificarEstadoTurno();
    }, 30000);
    const urlSegments = this.router.url.split('/'); // Divide la URL en segmentos
    this.segmento = urlSegments[urlSegments.length - 1]; // Obtiene el último segmento
    console.log(this.segmento);
  }

  estado = estadoTurno;

  horaActual(horasMenos: number) {
    const fechaActual = new Date(); // Obtener la fecha y hora actual

    // Restar 1 hora
    fechaActual.setHours(fechaActual.getHours() - horasMenos);

    // Formatear la hora
    const horas = fechaActual.getHours().toString().padStart(2, '0');
    const minutos = fechaActual.getMinutes().toString().padStart(2, '0');
    const segundos = fechaActual.getSeconds().toString().padStart(2, '0');
    const horaFormateada = `${horas}:${minutos}:${segundos}`;

    return horaFormateada;
  }

  // Crear el string de hora formateada

  cambiarEstado(idNegocio?: number, turno?: AtributosTurno) {
    if (idNegocio && turno) {
      if (turno.estado == estadoTurno.EN_CURSO) {
        turno.estado = estadoTurno.COBRADO;
      } else if (turno.estado == estadoTurno.RESERVADO) {
        turno.estado = estadoTurno.CANCELADO;
      }
    }
    this.modificarEstado(turno!, idNegocio!);
  }

  modificarEstado(turno: AtributosTurno, idNegocio: number) {
    if (turno) {
      this.turnoService
        .updateTurno(idNegocio, turno.idTurno!, turno?.estado)
        .subscribe({
          next: (response) => {
            window.location.reload();
          },
          error: (error: any) => {
            console.error(error);
          },
        });
    }
  }

  verificarEstado(
    fechaTurno: string,
    horaTurno: string,
    estado: boolean
  ): string {
    if (estado) {
      const fechaActual = new Date();

      const [anio, mes, dia] = fechaTurno
        .split('-')
        .map((parte) => parseInt(parte, 10));
      const [hora, minutos] = horaTurno
        .split(':')
        .map((parte) => parseInt(parte, 10));

      const fechaTurnoDate = new Date(anio, mes - 1, dia, hora, minutos, 0, 0);
      if (fechaTurnoDate > fechaActual && horaTurno > this.horaActual(0)) {
        return 'reservado';
      } else if (fechaTurnoDate > fechaActual && !estado) {
        return 'cobrado';
      } else {
        return 'enCurso';
      }
    } else {
      return 'cancelado';
    }
  }

  // 1 - Crear un método que obtenga todos los turnos del negocio
  cargarTurnos() {
    this.turnoService.getTurnos(this.idNegocio).subscribe({
      next: (turnosResponse: TurnoInterface[]) => {
        this.turnos = [...turnosResponse];
        this.turnos.forEach((unTurno) => {
          this.settearAtributosTurno(unTurno);
        });
      },
      error: (error: any) => {
        console.error(error);
      },
    });
  }

  settearAtributosTurno(unTurno: TurnoInterface) {
    const unTurnoAux: AtributosTurno = {
      idTurno: 0,
      nombreCliente: '',
      nombreProfesional: '',
      nombreServicio: '',
      metodoPago: '',
      horaInicio: '',
      fecha: '',
      estado: estadoTurno.LIBRE,
    };

    unTurnoAux.fecha = unTurno.fechaInicio.toString();
    unTurnoAux.horaInicio = unTurno.horarioProfesional.horaInicio.toString();
    unTurnoAux.idTurno = unTurno.idTurno;
    unTurnoAux.metodoPago = unTurno.metodosDePagoEnum
      .replace('_', ' ')
      .toLocaleLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());
    unTurnoAux.estado = unTurno.estado!;
    //obtengo el cliente
    this.clienteService.getClienteById(unTurno.idCliente).subscribe({
      next: (cliente) => {
        this.nombreCliente = cliente.nombre;

        // Si obtengo el cliente ejecuto todo lo demas
        this.profesionalService
          .getProfesionalPorIdNegocio(
            this.idNegocio,
            unTurno.horarioProfesional.idProfesional
          )
          .subscribe({
            next: (profesional) => {
              this.nombreProfesional = profesional.nombre;

              this.servicioService
                .getServicioPorIdNegocio(this.idNegocio, unTurno.idServicio)
                .subscribe({
                  next: (servicio) => {
                    this.nombreServicio = servicio.nombre;

                    // Cuando tengo todo lo asigno
                    unTurnoAux.nombreCliente = this.nombreCliente;
                    unTurnoAux.nombreProfesional = this.nombreProfesional;
                    unTurnoAux.nombreServicio = this.nombreServicio;

                    //Lo agrego a la tabla AL FINNN...:)
                    if (
                      unTurnoAux.estado ||
                      unTurnoAux.horaInicio > this.horaActual(1)
                    )
                      this.turnoTabla.push(unTurnoAux);

                    this.turnoTabla = this.ordenarArregloTurnos(
                      this.turnoTabla
                    );
                  },
                  error: (error) => {
                    console.error(error);
                  },
                });
            },
            error: (error) => {
              console.error(error);
            },
          });
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  ordenarArregloTurnos(arreglo: AtributosTurno[]) {

    if (this.segmento == 'recepcion') {
      arreglo = arreglo.filter(
        (a) =>
          a.estado == estadoTurno.RESERVADO || a.estado == estadoTurno.EN_CURSO
      );
    }

    return arreglo.sort((a, b) => {
      const fecha = a.fecha.localeCompare(b.fecha);
      if (fecha !== 0) {
        return fecha;
      }

      return a.horaInicio.localeCompare(b.horaInicio);
    });
  }

  verificarEstadoTurno() {
    this.turnoTabla.forEach((turno) => {
      if (
        this.formatearHora(turno.horaInicio) ==
        this.formatearHora(this.horaActual(0)) && turno.estado != estadoTurno.CANCELADO
      ) {
        turno.estado = estadoTurno.EN_CURSO;
        this.modificarEstado(turno, this.idNegocio);
      }
    });
  }

  formatearHora(hora: string): string {
    const [horas, minutos] = hora.split(':');
    return `${horas}:${minutos}`;
  }
}
