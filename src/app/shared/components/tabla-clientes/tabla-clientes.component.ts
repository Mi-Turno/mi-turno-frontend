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
import { DataSource } from '@angular/cdk/collections';
import { UsuarioService } from '../../../core/services/usuarioService/usuario.service';
import { UsuarioInterface } from '../../../core/interfaces/usuario-interface';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { BotonComponent } from '../boton/boton.component';

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
  token: string = '';
  segmento: string = '';
  usuarioService: UsuarioService = inject(UsuarioService);
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
    this.cargarTabla();

    this.confirmarTabla();
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
    this.usuarioService.getUsuarios(this.token).subscribe({
      next: (usuariosResponse: UsuarioInterface[]) => {
        this.usuarios = usuariosResponse.map((usuario) => {
          return {
            id: usuario.idUsuario?.toString() || '',
            nombre: usuario.nombre,
            apellido: usuario.apellido,
            correo: usuario.credencial.email,
            telefono: usuario.credencial.telefono,
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
        console.error(error);
      },
    });
  }

  modificarEstadoUsuario(usuario: TablaClientesItem) {
    this.usuarioService
      .modificarEstadoUsuario(Number.parseInt(usuario.id))
      .subscribe({
        next: () => {
          this.cargarTabla();
          this.confirmarTabla();
        },
        error: (err: Error) => {
          console.error('Error al recargar la tabla');
        },
      });
  }
}
