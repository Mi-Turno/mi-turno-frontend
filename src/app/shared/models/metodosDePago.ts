export enum MetodosDePago {
  efectivo = 'EFECTIVO',
  credito = 'TARJETA_CREDITO',
  debito = 'TARJETA_DEBITO',
  mercadoPago = 'MERCADO_PAGO',
  transferencia = 'TRANSFERENCIA',
  otro = 'OTRO'
}


export function obtenerMetodosDePagoPorNumero(metodoDePago:number): MetodosDePago{
  switch(metodoDePago){
    case 0:
      return MetodosDePago.mercadoPago;
    case 1:
      return MetodosDePago.efectivo;
    case 2:
      return MetodosDePago.credito;
    case 3:
      return MetodosDePago.transferencia;
    case 4:
      return MetodosDePago.debito;
    default:
      return MetodosDePago.otro;
  }
}
export function obtenerIdDePagoPorNombre(metodoDePago:string): number{
  switch(metodoDePago){
    case MetodosDePago.mercadoPago:
      return 0;
    case MetodosDePago.efectivo:
      return 1;
    case MetodosDePago.credito:
      return 2;
    case MetodosDePago.transferencia:
      return 3;
    case MetodosDePago.debito:
      return 4;
    default:
      return 5;
  }
}
