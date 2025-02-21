import { Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';

@Injectable()
export class CustomMatPaginatorIntl extends MatPaginatorIntl {
  override itemsPerPageLabel = 'Elementos por página'; // Personaliza el label

  // Si necesitas personalizar otros textos, puedes hacerlo aquí:
  override nextPageLabel = 'Página siguiente';
  override previousPageLabel = 'Página anterior';
  override getRangeLabel = function (page: number, pageSize: number, length: number) {
    const startIndex = page * pageSize;
    const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex;
    return startIndex + 1 + ' - ' + endIndex + ' de ' + length;
  };
}