export enum MetodosDePago {
  credito = 'TARJETA_DE_CREDITO',
  debito = 'TARJETA_DE_DEBITO',
  efectivo = 'EFECTIVO',
  mercadoPago = 'MERCADO_PAGO',
  transferencia = 'TRANSFERENCIA_BANCARIA',
}

export function obtenerMetodosDePagoPorNumero(metodoDePago:number): MetodosDePago{
  switch(metodoDePago){
    case 0:
      return MetodosDePago.credito;
    case 1:
      return MetodosDePago.debito;
    case 2:
      return MetodosDePago.efectivo;
    case 3:
      return MetodosDePago.mercadoPago;
    case 4:
      return MetodosDePago.transferencia;
    default:
      return MetodosDePago.efectivo;
  }
}
