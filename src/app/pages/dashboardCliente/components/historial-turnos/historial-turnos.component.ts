
import { Component, inject, ViewChild } from '@angular/core';
import { TurnoInterface } from '../../../../core/interfaces/turno-interface';
import { MatTable, MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
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
import { TablaHistorialDataSource, TablaHistorialItem } from './tabla-turno-historial-datasource';


@Component({
  selector: 'app-historial-turnos',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, MatSortModule, CommonModule, MatFormFieldModule, MatInputModule],
  templateUrl: './historial-turnos.component.html',
  styleUrl: './historial-turnos.component.css'
})
export class HistorialTurnosComponent {


  listadoTurnos: TurnoInterface[] = [];
  //tabla material
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<TablaHistorialItem>;
  dataSource = new TablaHistorialDataSource();
  funteInfo!: MatTableDataSource<TablaHistorialItem>;
  turnoTabla: TablaHistorialItem[] = [];
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
  //Variables
  idNegocio = 0;
  estado = estadoTurno;
  turnos: TurnoInterface[] = [];
  nombreCliente: string = '';
  nombreProfesional: string = '';
  nombreServicio: string = '';
  idProfesional: number = 0;
  cuerpoEmail: EmailCancelacion = {} as EmailCancelacion;
  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  //TODO agregar nombre del negocio
  displayedColumns = [
    'estado',
    'numero',
    'fecha',
    'hora',
    'cliente',
    'profesional',
    'servicio',
    'metodoPago'
  ];

  ngOnInit(): void {
    this.cargarTurnos();
  }
  ngAfterViewInit(): void {

    this.funteInfo = new MatTableDataSource(this.dataSource.data);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
    //Verifico el estado por primera vez
    //  Se configura el intervalo para chequar de manera recurrente


    const urlSegments = this.router.url.split('/'); // Divide la URL en segmentos
    this.segmento = urlSegments[urlSegments.length - 1]; // Obtiene el último segmento


  }

  //Funciones para cambiar los estados segun la hora

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
        console.log(this.listadoTurnos);
        this.listadoTurnos.forEach((unTurno) => {
          this.settearAtributosTurno(unTurno);
        });
      },
      error: (error) => {
        console.error('Error al cargar los turnos', error);
      },
    });


  }

  settearAtributosTurno(unTurno: TurnoInterface) {

    const unTurnoAux: TablaHistorialItem = {
      estado: estadoTurno.LIBRE,
      numero: 0,
      fecha: '',
      hora: '',
      cliente: '',
      profesional: '',
      servicio: '',
      metodoPago: MetodosDePago.credito,
    };
    unTurnoAux.fecha = unTurno.fechaInicio.toString();
    unTurnoAux.hora = unTurno.horarioProfesional.horaInicio.toString();
    unTurnoAux.numero = unTurno.idTurno ?? 0;
    unTurnoAux.metodoPago = unTurno.metodosDePagoEnum.replace('_', ' ').toLocaleLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
    unTurnoAux.estado = unTurno.estado!;
    //obtengo el cliente
    this.clienteService.getClienteById(this.authService.getIdUsuario()!).subscribe({
      next: (cliente) => {
        this.nombreCliente = cliente.nombre;
        // Si obtengo el cliente ejecuto todo lo demas
        this.profesionalService
          .getProfesionalPorIdNegocio(
            unTurno.idNegocio,
            unTurno.horarioProfesional.idProfesional
          )
          .subscribe({
            next: (profesional) => {
              this.nombreProfesional = profesional.nombre;
              this.idProfesional = profesional.idUsuario!;
              console.log(unTurno.idNegocio, unTurno.idServicio);
              this.servicioService.getServicioPorIdNegocio(unTurno.idNegocio, unTurno.idServicio).subscribe({
                next: (servicio: any) => {
                  this.nombreServicio = servicio.nombre;

                  // Cuando tengo todo lo asigno
                  unTurnoAux.cliente = this.nombreCliente;
                  unTurnoAux.profesional = this.nombreProfesional;
                  unTurnoAux.servicio = this.nombreServicio;

                  if (unTurnoAux.estado || unTurnoAux.hora > this.horaActual(1)) {

                    if (unTurnoAux.estado == estadoTurno.COBRADO || unTurnoAux.estado == estadoTurno.EN_CURSO || unTurnoAux.estado == estadoTurno.CANCELADO) {
                      this.turnoTabla.push(unTurnoAux);
                    }
                  }

                  this.turnoTabla = this.ordenarArregloTurnos(
                    this.turnoTabla
                  );
                  this.dataSource.data = this.turnoTabla;
                  this.dataSource.actualizarDatos();
                  //TODO: Verificar si esta solución mejora todo
                  this.funteInfo.data = this.turnoTabla;


                },
                error: (error: Error) => {

                },
              });
            },
            error: (error) => {

            },
          });

      },
      error: (error) => {

      },
    });
  }

  ordenarArregloTurnos(arreglo: TablaHistorialItem[]) {
    if (this.segmento == 'dashboard-cliente') {
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


}
