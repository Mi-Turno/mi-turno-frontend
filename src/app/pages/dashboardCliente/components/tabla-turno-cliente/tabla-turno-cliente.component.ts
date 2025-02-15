
import { Component, inject, Input, ViewChild } from '@angular/core';
import { TurnoInterface } from '../../../../core/interfaces/turno-interface';
import { MatTable, MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { TurnoService } from '../../../../core/services/turnoService/turno.service';
import { ClienteService } from '../../../../core/services/clienteService/cliente.service';
import { ProfesionalesServiceService } from '../../../../core/services/profesionalService/profesionales-service.service';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/guards/auth/service/auth.service';
import { ServicioServiceService } from '../../../../core/services/servicioService/servicio-service.service';
import { HorarioXprofesionalService } from '../../../../core/services/horariosProfesionalService/horarioProfesional.service';
import { EmailService } from '../../../../core/services/emailService/email-service.service';
import { NegocioServiceService } from '../../../../core/services/negocioService/negocio-service.service';
import { EmailCancelacion } from '../../../../core/interfaces/email-cancelacion-desde-negocio';
import { estadoTurno } from '../../../../shared/models/estadoTurnoEnum';
import { MetodosDePago } from '../../../../shared/models/metodosDePago';
import { TablaTurnoClienteDataSource, TablaTurnoClienteItem } from './tabla-turno-cliente-datasource';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NegocioInterface } from '../../../../core/interfaces/negocio-interface';

@Component({
  selector: 'app-tabla-turno-cliente',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, MatSortModule, CommonModule, MatFormFieldModule, MatInputModule],
  templateUrl: './tabla-turno-cliente.component.html',
  styleUrl: './tabla-turno-cliente.component.css'
})
export class TablaTurnoClienteComponent {
  listadoTurnos: TurnoInterface[] = [];
  //tabla material
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<TablaTurnoClienteItem>;
  dataSource = new TablaTurnoClienteDataSource();
  funteInfo!: MatTableDataSource<TablaTurnoClienteItem>;
  turnoTabla: TablaTurnoClienteItem[] = [];
  segmento: string = '';

  //Servicios
  turnoService: TurnoService = inject(TurnoService);
  clienteService: ClienteService = inject(ClienteService);
  profesionalService: ProfesionalesServiceService = inject(ProfesionalesServiceService);
  router: Router = inject(Router);
  authService: AuthService = inject(AuthService);
  servicioService: ServicioServiceService = inject(ServicioServiceService);
  horarioProfesional: HorarioXprofesionalService = inject(HorarioXprofesionalService);
  emailService: EmailService = inject(EmailService);
  negocioService: NegocioServiceService = inject(NegocioServiceService);

  //Inputs
  @Input() listadoNegocios: NegocioInterface[] = [];
  @Input() modo: 'dashboard' | 'historial' = 'dashboard';

  //Variables
  idNegocio = 0;
  estado = estadoTurno;
  turnos: TurnoInterface[] = [];
  nombreCliente: string = '';
  nombreProfesional: string = '';
  nombreServicio: string = '';
  nombreNegocio: string = '';
  precio: Number = 0;
  idProfesional: number = 0;
  cuerpoEmail: EmailCancelacion = {} as EmailCancelacion;
  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  //TODO agregar nombre del negocio
  displayedColumns = [
    'estado',
    'numero',
    'negocio',
    'fecha',
    'hora',
    'cliente',
    'profesional',
    'servicio',
    'precio',
    'metodoPago',
    'cancelar'
  ];
  negocio: string | String = '';

  ngOnInit(): void {
    if (this.modo === 'historial') {
      this.displayedColumns = this.displayedColumns.filter(
        (columna) => columna !== 'cancelar'
      );
    }
    this.cargarTurnos();
  }
  ngAfterViewInit(): void {

    this.funteInfo = new MatTableDataSource(this.dataSource.data);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
    //Verifico el estado por primera vez
    //  Se configura el intervalo para chequar de manera recurrente
    this.verificarEstadoTurno();

    const urlSegments = this.router.url.split('/'); // Divide la URL en segmentos
    this.segmento = urlSegments[urlSegments.length - 1]; // Obtiene el último segmento
    setInterval(() => {
      this.verificarEstadoTurno();
    }, 30000);

  }

  //Funciones para cambiar los estados segun la hora

  verificarEstadoTurno() {
    this.dataSource.data.forEach((turno) => {
      if (turno.fecha == new Date().toISOString().split('T')[0]) {
        if (this.formatearHora(turno.hora) == this.formatearHora(this.horaActual(0)) && turno.estado != estadoTurno.CANCELADO) {
          turno.estado = estadoTurno.EN_CURSO;
          this.negocioService.getIdNegocioByNombre(turno.negocio).subscribe({
            next: (responseIdNegocio) => {
              this.modificarEstado(turno, responseIdNegocio);
            }
          });
        }
      }

    });
  }


  formatearHora(hora: string): string {
    const [horas, minutos] = hora.split(':');
    return `${horas}:${minutos}`;
  }

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

  // Métodos para cargar los datos a la tabla

  cargarTurnos() {
    this.clienteService.getListadoDeTurnosPorIdCliente(this.authService.getIdUsuario()!).subscribe({
      next: (turnos) => {
        this.listadoTurnos = turnos;
        this.listadoTurnos.forEach((unTurno) => {
          this.settearAtributosTurno(unTurno);
        });
      },
      error: (error) => {
        console.error('Error al cargar los turnos', error);
      },
    });


  }

  settearAtributosTurno(unTurno: TurnoInterface): void {
    const unTurnoAux: TablaTurnoClienteItem = {
      estado: unTurno.estado ?? estadoTurno.LIBRE,
      numero: unTurno.idTurno ?? 0,
      fecha: unTurno.fechaInicio.toString(),
      negocio: '',
      hora: unTurno.horarioProfesional.horaInicio.toString(),
      cliente: '',
      profesional: '',
      servicio: '',
      precio: 0,
      metodoPago: unTurno.metodosDePagoEnum
        .replace('_', ' ')
        .toLocaleLowerCase()
        .replace(/\b\w/g, (char) => char.toUpperCase())
    };

    // Obtengo el cliente
    this.clienteService.getClienteById(this.authService.getIdUsuario()!).subscribe({
      next: (cliente) => {
        this.nombreCliente = cliente.nombre;

        // Obtengo el profesional
        this.profesionalService.getProfesionalPorIdNegocio(unTurno.idNegocio, unTurno.horarioProfesional.idProfesional).subscribe({
          next: (profesional) => {
            this.nombreProfesional = profesional.nombre;
            this.idProfesional = profesional.idUsuario!;
            unTurnoAux.profesional = this.nombreProfesional;
            // Obtengo el servicio
            this.servicioService.getServicioPorIdNegocio(unTurno.idNegocio, unTurno.idServicio).subscribe({
              next: (servicio) => {
                this.nombreServicio = servicio.nombre;
                this.precio = servicio.precio!;
                unTurnoAux.servicio = this.nombreServicio;
                unTurnoAux.precio = this.precio;

                // Obtengo el negocio
                this.negocioService.getNegocioById(unTurno.idNegocio).subscribe({
                  next: (negocio) => {
                    this.nombreNegocio = negocio.nombre;
                    unTurnoAux.negocio = this.nombreNegocio;

                    unTurnoAux.cliente = this.nombreCliente;

                    //Agrego segun el modo de la tabla si es el historial o si es el dashboard principal
                    if (this.modo === 'historial') {
                      // En modo historial se agregan solo turnos que ya ocurrieron:
                      if (unTurnoAux.estado === estadoTurno.COBRADO || unTurnoAux.estado === estadoTurno.EN_CURSO || unTurnoAux.estado === estadoTurno.CANCELADO) {
                        this.turnoTabla.push(unTurnoAux);

                      }
                    } else {
                      if (unTurnoAux.estado || unTurnoAux.hora > this.horaActual(1)) {
                        this.turnoTabla.push(unTurnoAux);
                      }
                    }

                    // Ordeno y actualizo la tabla
                    this.turnoTabla = this.ordenarArregloTurnos(this.turnoTabla);
                    this.dataSource.data = this.turnoTabla;
                    this.dataSource.actualizarDatos();
                    this.funteInfo.data = this.turnoTabla;
                  },
                  error: (error) => {
                    console.error('Error al obtener el negocio:', error);
                  }
                });
              },
              error: (error: Error) => {
                console.error('Error al obtener el servicio:', error);
              }
            });
          },
          error: (error) => {
            console.error('Error al obtener el profesional:', error);
          }
        });
      },
      error: (error) => {
        console.error('Error al obtener el cliente:', error);
      }
    });
  }



  ordenarArregloTurnos(arreglo: TablaTurnoClienteItem[]) {
    if (this.modo == 'dashboard') {
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

      return a.hora.localeCompare(b.hora);
    });
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.funteInfo.filter = filterValue.trim().toLowerCase();
    this.table.dataSource = this.funteInfo;
    if (this.funteInfo.paginator) {
      this.funteInfo.paginator.firstPage();
    }
  }
  cambiarEstado(nombreNegocio: String | string, turno: TablaTurnoClienteItem) {
    const idNegocio = this.listadoNegocios.find((n) => n.nombre == nombreNegocio)?.idUsuario;
    if (idNegocio && turno) {
      if (turno.estado == estadoTurno.EN_CURSO) {
        turno.estado = estadoTurno.COBRADO;
        this.darDeAltaHorario(turno.numero!, idNegocio, this.idProfesional!, true);
      } else if (turno.estado == estadoTurno.RESERVADO) {
        turno.estado = estadoTurno.CANCELADO;
        /**LOGICA PARA DAR DE BAJA EL TURNO Y HABILITAR EL TURNO EN EL HUB */
        this.cancelarTurno(idNegocio, turno.numero!, nombreNegocio);
      }
    }
    this.modificarEstado(turno!, idNegocio!);
  }
  modificarEstado(turno: TablaTurnoClienteItem, idNegocio: number) {
    if (turno) {
      this.turnoService.updateTurno(idNegocio, turno.numero!, turno?.estado).subscribe({
        next: (response) => {
          window.location.reload();
        },
        error: (error: any) => {

        },
      });
    }
  }
  cancelarTurno(idNegocio: number, idTurno: number, nombreNegocio: String) {
    //obtener turno
    this.turnoService.getTurno(idNegocio, idTurno).subscribe({
      next: (turnoResponse) => {
        this.darDeAltaHorario(turnoResponse?.horarioProfesional.idHorario!, idNegocio, turnoResponse?.horarioProfesional.idProfesional!, true);
        this.negocioService.getNumeroDeSoporte(idNegocio).subscribe({
          next: (responseNumeroSoporte) => {
            this.cuerpoEmail.nombreNegocio = nombreNegocio;
            this.cuerpoEmail.nombreCliente = this.authService.getNombreUsuario()!;
            this.cuerpoEmail.emailCliente = this.authService.getEmailUsuario()!;
            this.cuerpoEmail.numeroSoporte = responseNumeroSoporte;
            /*4 Le avisamos al cliente que se cancelo su turno*/
            this.emailService.enviarEmailCancelacionCliente(this.cuerpoEmail).subscribe({
              next: (responseEmail) => {
                alert('Turno cancelado');
              },
              error: (error) => {
              }
            });
          },
          error: (error) => {
          }
        });
      },
      error: (error) => {
      }
    });


  }

  darDeAltaHorario(idHorario: number, idNegocio: number, idProfesional: number, estado: boolean) {
    this.horarioProfesional.patchEstadoHorarioProfesional(idHorario, idNegocio, idProfesional, estado).subscribe({
      next: (response) => {

      },
      error: (error) => {
      }
    });
  }
}
