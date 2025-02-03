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
     MatInputModule
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
  usuarioService: UsuarioService = inject(UsuarioService);
  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['id', 'nombre', 'correo', 'telefono', 'rol', 'acciones'];

  ngAfterViewInit(): void {
    this.funteInfo = new MatTableDataSource(this.dataSource.data);
    this.funteInfo.sort = this.sort;
    this.funteInfo.paginator = this.paginator;
    this.table.dataSource = this.funteInfo;


  }

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
  }

  cargarTabla() {
    this.usuarioService.getUsuarios(this.token).subscribe({
      next: (usuariosResponse: UsuarioInterface[]) => {
        this.usuarios = usuariosResponse.map((usuario) => {
          return {
            id: usuario.idUsuario?.toString() || '',
            nombre: usuario.nombre,
            correo: usuario.credencial.email,
            telefono: usuario.credencial.telefono,
            rol: usuario.rolUsuario,
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
}
