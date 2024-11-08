import { MetodosDePago } from "../../shared/models/metodosDePago";
import { HorarioProfesional } from "./horarioProfesional.interface";

export interface TurnoInterface{
  idCliente?:number;//id del usuario,
  idServicio?:number; //id del servicio
  idProfesional?:number; //id del profesional
  idNegocio?:number; //id del negocio
  fechaInicio?:Date;
  horarioProfesional?:HorarioProfesional;
  metodoPago?:MetodosDePago|string;
}

