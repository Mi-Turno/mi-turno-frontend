import { MetodosDePago } from "../../shared/models/metodosDePago";

export interface TurnoInterface{
  id?:number;//id del turno
  idUsuario:number;//id del usuario,
  idServicio:number; //id del servicio
  idProfesional:string; //id del profesional
  fecha:Date;
  horaInicio:Date;
  //hora fin se puede calcular con la duracion del servicio + la hora de inicio
  metodoPago:MetodosDePago;
}

