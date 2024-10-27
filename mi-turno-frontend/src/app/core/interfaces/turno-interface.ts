import { MetodosDePago } from "../../shared/models/metodosDePago";

export interface TurnoInterface{
  idCliente:number;//id del usuario,
  idServicio:number; //id del servicio
  idProfesional:number; //id del profesional
  idNegocio:number; //id del negocio
  fechaInicio:Date;
  horario:Date;
  //hora fin se puede calcular con la duracion del servicio + la hora de inicio
  metodoPago:MetodosDePago;


}

