import { AfterViewInit, Component, inject, ViewChild } from '@angular/core';
import {
  MatTableModule,
  MatTable,
  MatTableDataSource,
} from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import {
  TablaClientesDataSource,
  TablaClientesItem,
} from './tabla-clientes-datasource';
import { MatFormFieldModule } from '@angular/material/form-field';
import { UsuarioService } from '../../../core/services/usuarioService/usuario.service';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { BotonComponent } from '../boton/boton.component';
import { NegocioServiceService } from '../../../core/services/negocioService/negocio-service.service';
import { AuthService } from '../../../core/guards/auth/service/auth.service';
import { UsuarioInterface } from '../../../core/interfaces/usuario-interface';

@Component({
  selector: 'app-tabla-clientes',
  templateUrl: './tabla-clientes.component.html',
  styleUrl: './tabla-clientes.component.css',
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    BotonComponent,
  ],
})



export class TablaClientesComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<TablaClientesItem>;
  dataSource = new TablaClientesDataSource();
  funteInfo!: MatTableDataSource<TablaClientesItem>;

  informacionUsuarios!: MatTableDataSource<TablaClientesItem>;
  usuarios: TablaClientesItem[] = [];
  clientes: TablaClientesItem[] = [];
  token: string = '';
  segmento: string = '';
  usuarioService: UsuarioService = inject(UsuarioService);
  negocioService: NegocioServiceService = inject(NegocioServiceService);
  authService: AuthService = inject(AuthService);
  router: Router = inject(Router);
  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = [
    'id',
    'nombre',
    'apellido',
    'correo',
    'telefono',
    'fechaNacimiento',
    'rol',
    'estado',
    'acciones',
  ];

  ngAfterViewInit(): void {
    this.funteInfo = new MatTableDataSource(this.dataSource.data);
    this.funteInfo.sort = this.sort;
    this.funteInfo.paginator = this.paginator;
    this.table.dataSource = this.funteInfo;
  }

  estadoMuestra = false;

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.funteInfo.filter = filterValue.trim().toLowerCase();
    this.table.dataSource = this.funteInfo;
    if (this.funteInfo.paginator) {
      this.funteInfo.paginator.firstPage();
    }
  }

  ngOnInit(): void {
    this.token = localStorage.getItem('token')!;
    this.confirmarTabla();
    this.cargarTabla();

  }

  //Esta función renderiza la tabla según lo que se tenga que mostrar en cada pagina
  confirmarTabla() {
    const urlSegments = this.router.url.split('/'); // Divide la URL en segmentos
    this.segmento = urlSegments[urlSegments.length - 1]; // Obtiene el último segmento
    if (this.segmento == 'clientes') {
      this.displayedColumns = [
        'id',
        'nombre',
        'apellido',
        'correo',
        'telefono',
        'fechaNacimiento'
      ];
    }
  }

  cargarTabla() {
    //? nota: se cambio el servicio de usuarioService a negocioService para que en el negocio solo vea a sus clientes(Los que pidieron algun turno en su negocio)
    //? Si se necesita compartir la tabla hay que agregar un if donde verifiquemos si el usuario es administrador o no con el modo y un ngIf en el html para saber cuando usar cada tabla
    if (this.segmento == 'clientes') {
      this.negocioService.getClientesByNegocio(this.authService.getIdUsuario()!).subscribe({
        next: (clientesResponse: TablaClientesItem[]) => {
          this.clientes = clientesResponse.map((cliente) => {
            return {
              id: cliente.id,
              nombre: cliente.nombre,
              apellido: cliente.apellido,
              correo: cliente.correo,
              telefono: cliente.telefono,
              rol: cliente.rol,
              fechaNacimiento: cliente.fechaNacimiento,
              estado: cliente.estado,
            };
          });
          //this.dataSource.data = this.usuarios;

          this.funteInfo.data = this.clientes;
          this.funteInfo.paginator = this.paginator;
          this.funteInfo.sort = this.sort;
          this.table.dataSource = this.funteInfo;
        }
      });
    } else {
      this.usuarioService.getUsuarios(this.token).subscribe({
        next: (usuariosResponse: UsuarioInterface[]) => {
          this.usuarios = usuariosResponse.map((usuario) => {
            return {
              id: Number(usuario.idUsuario) || 0,
              nombre: usuario.nombre,
              apellido: usuario.apellido,
              correo: usuario.credencial.email,
              telefono: usuario.credencial.telefono || '',
              rol: usuario.rolUsuario,
              fechaNacimiento: usuario.fechaNacimiento,
              estado: usuario.credencial.estado,
            };
          });
          //this.dataSource.data = this.usuarios;

          this.funteInfo.data = this.usuarios;
          this.funteInfo.paginator = this.paginator;
          this.funteInfo.sort = this.sort;
          this.table.dataSource = this.funteInfo;
        },
        error: (error) => {
        },
      });
    }





  }

  modificarEstadoUsuario(usuario: TablaClientesItem) {
    this.usuarioService
      .modificarEstadoUsuario(usuario.id)
      .subscribe({
        next: () => {
          this.cargarTabla();
          this.confirmarTabla();
        },
        error: (err: Error) => {
        },
      });
  }
}
