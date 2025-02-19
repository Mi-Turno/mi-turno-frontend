export enum MetodosDePago {
  efectivo = 'EFECTIVO',
  credito = 'TARJETA_CREDITO',
  debito = 'TARJETA_DEBITO',
  mercadoPago = 'MERCADO_PAGO',
  transferencia = 'TRANSFERENCIA',
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
      return MetodosDePago.efectivo;
  }
}
