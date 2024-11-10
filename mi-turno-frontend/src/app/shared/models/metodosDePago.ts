export enum MetodosDePago {
  efectivo = 'EFECTIVO',
  credito = 'TARJETA_CREDITO',
  debito = 'TARJETA_DEBITO',
  mercadoPago = 'MERCADO_PAGO',
  transferencia = 'TRANSFERENCIA',
}

export function obtenerMetodosDePagoPorNumero(metodoDePago:number): MetodosDePago{
  console.log(metodoDePago);
  switch(metodoDePago){
    case 0:
      return MetodosDePago.efectivo;
    case 1:
      return MetodosDePago.mercadoPago;
    case 2:
      return MetodosDePago.credito;
    case 3:
      return MetodosDePago.debito;
    case 4:
      return MetodosDePago.transferencia;
    default:
      return MetodosDePago.efectivo;
  }
}
