import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { map } from 'rxjs/operators';
import { Observable, of as observableOf, merge } from 'rxjs';

// TODO: Replace this with your own data model type
export interface TablaClientesItem {
  id: number;
  nombre: string;
  apellido: string;
  correo: string;
  telefono: string;
  rol: string;
  fechaNacimiento: string;
  estado: boolean;
}

/**
 * Data source for the TablaClientes view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class TablaClientesDataSource extends DataSource<TablaClientesItem> {
  data: TablaClientesItem[] = [];
  paginator: MatPaginator | undefined;
  sort: MatSort | undefined;

  constructor() {
    super();
  }

  mostrarData(){
    console.log(this.data);
  }

  actualizarDatos() {
    if(this.sort){
      this.sort.sortChange.next({ active: this.sort.active, direction: this.sort.direction });
    }
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<TablaClientesItem[]> {
    if (this.paginator && this.sort) {
      // Combine everything that affects the rendered data into one update
      // stream for the data-table to consume.
      return merge(
        observableOf(this.data),
        this.paginator.page,
        this.sort.sortChange
      ).pipe(
        map(() => {
          return this.getPagedData(this.getSortedData([...this.data]));
        })
      );
    } else {
      throw Error(
        'Please set the paginator and sort on the data source before connecting.'
      );
    }
  }

  /**
   *  Called when the table is being destroyed. Use this function, to clean up
   * any open connections or free any held resources that were set up during connect.
   */
  disconnect(): void {}

  /**
   * Paginate the data (client-side). If you're using server-side pagination,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getPagedData(data: TablaClientesItem[]): TablaClientesItem[] {
    if (this.paginator) {
      const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
      return data.splice(startIndex, this.paginator.pageSize);
    } else {
      return data;
    }
  }

  /**
   * Sort the data (client-side). If you're using server-side sorting,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getSortedData(data: TablaClientesItem[]): TablaClientesItem[] {
    if (!this.sort || !this.sort.active || this.sort.direction === '') {
      return data;
    }


    return data.sort((a, b) => {
      const isAsc = this.sort?.direction === 'asc';
      switch (this.sort?.active) {
        case 'nombre':
          return compare(a.nombre.toLowerCase(), b.nombre.toLowerCase(), isAsc);
        case 'id':
          return compare(+a.id, +b.id, isAsc);
        case 'correo':
          return compare(a.correo.toLowerCase(), b.correo.toLowerCase(), isAsc);
        case 'rol':
          return compare(a.rol.toLowerCase(), b.rol.toLowerCase(), isAsc);
          case 'telefono':
            return compare(a.telefono,b.telefono,isAsc);
        default:
          return 0;
      }
    });
  }
}

/** Simple sort comparator for example ID/Name columns (for client-side sorting). */
function compare(
  a: string | number,
  b: string | number,
  isAsc: boolean
): number {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
