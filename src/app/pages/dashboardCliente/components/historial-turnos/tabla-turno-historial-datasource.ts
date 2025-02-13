import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { map } from 'rxjs/operators';
import { Observable, of as observableOf, merge } from 'rxjs';
import { estadoTurno } from '../../../../shared/models/estadoTurnoEnum';



//Modelo mostrado en la tabla
export interface TablaHistorialItem {
  estado: estadoTurno;
  numero: number;
  fecha: string;
  hora: string;
  cliente: string;
  profesional: string;
  servicio: string;
  metodoPago: string;
}


/**
 * Data source for the TablaTurnos view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class TablaHistorialDataSource extends DataSource<TablaHistorialItem> {


  data: TablaHistorialItem[] = [];
  paginator: MatPaginator | undefined;
  sort: MatSort | undefined;

  constructor() {
    super();
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
  connect(): Observable<TablaHistorialItem[]> {
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
  private getPagedData(data: TablaHistorialItem[]): TablaHistorialItem[] {
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
  private getSortedData(data: TablaHistorialItem[]): TablaHistorialItem[] {

    if (!this.sort || !this.sort.active || this.sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      const isAsc = this.sort?.direction === 'asc';
      switch (this.sort?.active) {
        case 'estado':
          return compare(a.estado, b.estado, isAsc);
        case 'numero':
          return compare(a.numero, b.numero, isAsc);
        case 'fecha':   return compare(new Date(a.fecha).getTime(), new Date(b.fecha).getTime(), isAsc);

        case 'hora':
          return compare(a.hora, b.hora, isAsc); // Ajustar si es necesario
        case 'cliente':
          return compare(
            a.cliente.toLowerCase(),
            b.cliente.toLowerCase(),
            isAsc
          );
        case 'profesional':
          return compare(
            a.profesional.toLowerCase(),
            b.profesional.toLowerCase(),
            isAsc
          );
        case 'servicio':
          return compare(
            a.servicio.toLowerCase(),
            b.servicio.toLowerCase(),
            isAsc
          );
        case 'metodoPago':
          return compare(a.metodoPago, b.metodoPago, isAsc);
        default:
          return 0;
      }
    });

    /** Simple sort comparator for example ID/Name columns (for client-side sorting). */
    function compare(
      a: string | number,
      b: string | number,
      isAsc: boolean
    ): number {
      return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
    }
  }





}
