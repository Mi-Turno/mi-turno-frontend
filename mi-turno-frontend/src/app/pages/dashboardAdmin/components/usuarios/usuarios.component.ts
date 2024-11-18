import { Component, ViewChild, AfterViewInit, OnInit, inject } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { UsuarioInterface } from '../../../../core/interfaces/usuario-interface';
import { UsuarioService } from '../../../../core/services/usuarioService/usuario.service';

interface UsuarioTableInterface {
  idUsuario?: number;
  nombre: string;
  correo: string;
  telefono: string;
  rol: string;
}

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule],
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements AfterViewInit, OnInit {

  columnas: string[] = ['ID', 'Nombre', 'Correo', 'Telefono', 'Rol', 'Acciones'];
  informacionUsuarios: MatTableDataSource<UsuarioTableInterface>;
  usuarios: UsuarioTableInterface[] = [];

  usuarioService: UsuarioService = inject(UsuarioService);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor() {
    this.informacionUsuarios = new MatTableDataSource(this.usuarios);
  }

  ngOnInit(): void {
    this.cargarTabla();
  }

  cargarTabla() {
    this.usuarioService.getUsuarios().subscribe({
      next: (usuariosResponse: UsuarioInterface[]) => {

        this.usuarios = usuariosResponse.map((usuario) => {
          return {
            idUsuario: usuario.idUsuario,
            nombre: usuario.nombre,
            correo: usuario.credencial.email,
            telefono: usuario.credencial.telefono,
            rol: usuario.rolUsuario
          };
        });

        this.informacionUsuarios = new MatTableDataSource(this.usuarios);

        this.informacionUsuarios.paginator = this.paginator;
        this.informacionUsuarios.sort = this.sort;
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  ngAfterViewInit() {
    this.informacionUsuarios.paginator = this.paginator;
    this.informacionUsuarios.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.informacionUsuarios.filter = filterValue.trim().toLowerCase();

    if (this.informacionUsuarios.paginator) {
      this.informacionUsuarios.paginator.firstPage();
    }
  }
}
