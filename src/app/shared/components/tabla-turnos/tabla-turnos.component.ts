import {
  AfterViewInit,
  Component,
  Inject,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatTableModule, MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import {
  TablaTurnosDataSource,
  TablaTurnosItem,
} from './tabla-turnos-datasource';
import { TurnoService } from '../../../core/services/turnoService/turno.service';
import { estadoTurno } from '../../models/estadoTurnoEnum';
import { CommonModule } from '@angular/common';
import { ClienteService } from '../../../core/services/clienteService/cliente.service';
import { TurnoInterface } from '../../../core/interfaces/turno-interface';
import { MetodosDePago } from '../../models/metodosDePago';
import { ProfesionalesServiceService } from '../../../core/services/profesionalService/profesionales-service.service';
import { ServicioServiceService } from '../../../core/services/servicioService/servicio-service.service';
import { Router } from '@angular/router';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../../core/guards/auth/service/auth.service';
import { HorarioXprofesionalService } from '../../../core/services/horariosProfesionalService/horarioProfesional.service';

@Component({
  selector: 'app-tabla-turnos',
  templateUrl: './tabla-turnos.component.html',
  styleUrl: './tabla-turnos.component.css',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, MatSortModule, CommonModule,     MatFormFieldModule, MatInputModule],
})
export class TablaTurnosComponent implements AfterViewInit, OnInit {
  //tabla material
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<TablaTurnosItem>;
  dataSource = new TablaTurnosDataSource();
  funteInfo!: MatTableDataSource<TablaTurnosItem>;
  turnoTabla: TablaTurnosItem[] = [];
  segmento: string = '';

  //Servicios
  turnoService: TurnoService = inject(TurnoService);
  clienteService = inject(ClienteService);
  profesionalService = inject(ProfesionalesServiceService);
  router = inject(Router);
  authService: AuthService = inject(AuthService);
  servicioService = inject(ServicioServiceService);
  horarioProfesional:HorarioXprofesionalService = inject(HorarioXprofesionalService);

  //Variables
  idNegocio = 0;
  estado = estadoTurno;
  turnos: TurnoInterface[] = [];
  nombreCliente: string = '';
  nombreProfesional: string = '';
  nombreServicio: string = '';
  idProfesional: number = 0;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = [
    'estado',
    'numero',
    'fecha',
    'hora',
    'cliente',
    'profesional',
    'servicio',
    'metodoPago',
    'cancelar',
  ];

  ngOnInit(): void {

    this.idNegocio = this.authService.getIdUsuario()!;
  }
  ngAfterViewInit(): void {

    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
    this.cargarTurnos();
    //Verifico el estado por primera vez
    this.verificarEstadoTurno();
    //  Se configura el intervalo para chequar de manera recurrente

    setInterval(() => {
      this.verificarEstadoTurno();
    }, 30000);

    const urlSegments = this.router.url.split('/'); // Divide la URL en segmentos
    this.segmento = urlSegments[urlSegments.length - 1]; // Obtiene el último segmento
    this.funteInfo = new MatTableDataSource(this.dataSource.data);


  }



  modificarEstado(turno: TablaTurnosItem, idNegocio: number) {
    if (turno) {
      this.turnoService
        .updateTurno(idNegocio, turno.numero!, turno?.estado)
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
  //Funciones para cambiar los estados segun la hora
  verificarEstadoTurno() {
    this.dataSource.data.forEach((turno) => {
      if (
        this.formatearHora(turno.hora) ==
          this.formatearHora(this.horaActual(0)) &&
        turno.estado != estadoTurno.CANCELADO
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

  //Métodos para cargar turnos a la tabal

  // Métodos para cargar los datos a la tabla

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

    const unTurnoAux: TablaTurnosItem = {
      numero: 0,
      cliente: '',
      profesional: '',
      servicio: '',
      metodoPago: MetodosDePago.credito,
      hora: '',
      fecha: '',
      estado: estadoTurno.LIBRE,
    };
    unTurnoAux.fecha = unTurno.fechaInicio.toString();
    unTurnoAux.hora = unTurno.horarioProfesional.horaInicio.toString();
    unTurnoAux.numero = unTurno.idTurno ?? 0;
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
              this.idProfesional = profesional.idUsuario!;

              this.servicioService
                .getServicioPorIdNegocio(this.idNegocio, unTurno.idServicio)
                .subscribe({
                  next: (servicio: any) => {
                    this.nombreServicio = servicio.nombre;

                    // Cuando tengo todo lo asigno
                    unTurnoAux.cliente = this.nombreCliente;
                    unTurnoAux.profesional = this.nombreProfesional;
                    unTurnoAux.servicio = this.nombreServicio;

                    //Lo agrego a la tabla AL FINNN...:)
                    if (
                      unTurnoAux.estado ||
                      unTurnoAux.hora > this.horaActual(1)
                    )
                      this.turnoTabla.push(unTurnoAux);

                    this.turnoTabla = this.ordenarArregloTurnos(
                      this.turnoTabla
                    );
                    this.dataSource.data = this.turnoTabla;
                     this.dataSource.actualizarDatos();
                    //TODO: Verificar si esta solución mejora todo
                    // this.funteInfo.data = this.turnoTabla;


                  },
                  error: (error: Error) => {
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

  ordenarArregloTurnos(arreglo: TablaTurnosItem[]) {
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

    //Filtros para los estados
    cambiarEstado(idNegocio?: number, turno?: TablaTurnosItem) {
      if (idNegocio && turno) {
        if (turno.estado == estadoTurno.EN_CURSO) {
          turno.estado = estadoTurno.COBRADO;
          /**LOGICA PARA DAR DE BAJA EL TURNO Y HABILITAR EL TURNO EN EL HUB */
          this.darDeAltaHorario(turno.numero!,idNegocio,this.idProfesional!,true);
        } else if (turno.estado == estadoTurno.RESERVADO) {
          turno.estado = estadoTurno.CANCELADO;
          /**LOGICA PARA DAR DE BAJA EL TURNO Y HABILITAR EL TURNO EN EL HUB */
          this.cancelarTurno(idNegocio, turno.numero!);
        }
      }
      this.modificarEstado(turno!, idNegocio!);
    }
    cancelarTurno(idNegocio: number, idTurno: number) {

        this.turnoService.updateTurno(idNegocio, idTurno,this.estado.CANCELADO).subscribe({
          next: (response) => {
            console.log('Turno cancelado', response);
            this.darDeAltaHorario(response.horarioProfesional.idHorario!,response.idNegocio,response.horarioProfesional.idProfesional,true);
            alert('Turno cancelado');
            window.location.reload();
          },
          error: (error) => {
            console.error('Error al cancelar turno', error);
          }
        });

    }
    darDeAltaHorario(idHorario:number,idNegocio:number,idProfesional:number,estado:boolean){
      this.horarioProfesional.patchEstadoHorarioProfesional(idHorario,idNegocio,idProfesional,estado).subscribe({
        next: (response) => {
          console.log('Horario dado de alta', response);

        },
        error: (error) => {
          console.error('Error al dar de alta horario', error);
        }
      });
    }
}
