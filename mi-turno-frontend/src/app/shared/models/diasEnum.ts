export enum DiasEnum{
  LUNES = "LUNES",
  MARTES = "MARTES",
  MIERCOLES = "MIERCOLES",
  JUEVES = "JUEVES",
  VIERNES = "VIERNES",
  SABADO = "SABADO",
  DOMINGO = "DOMINGO"
}

export enum DiasEnumOrdinal{
  DOMINGO = 0,
  LUNES = 1,
  MARTES = 2,
  MIERCOLES = 3,
  JUEVES = 4,
  VIERNES = 5,
  SABADO = 6
}

//parsea un numero a un dia de la semana Enum. Ya que la funcion Date .getDay() devuelve un numero del 0 al 6
export function obtenerDiaEnumPorNumero(hoy:number): DiasEnum{
  switch(hoy){
    case 0:
      return DiasEnum.DOMINGO;
    case 1:
      return DiasEnum.LUNES;
    case 2:
      return DiasEnum.MARTES;
    case 3:
      return DiasEnum.MIERCOLES;
    case 4:
      return DiasEnum.JUEVES;
    case 5:
      return DiasEnum.VIERNES;
    case 6:
      return DiasEnum.SABADO;
    default:
      return DiasEnum.DOMINGO;
  }
}
