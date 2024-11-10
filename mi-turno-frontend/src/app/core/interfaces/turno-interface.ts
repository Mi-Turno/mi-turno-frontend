import { MetodosDePago } from "../../shared/models/metodosDePago";
import { HorarioProfesional } from "./horarioProfesional.interface";

export interface TurnoInterface{
  idTurno?:number; //id del turno
  idCliente:number;//id del usuario,
  idServicio:number; //id del servicio
  idNegocio:number; //id del negocio
  fechaInicio:Date; //fecha del turno
  horarioProfesional:HorarioProfesional;
  metodoPago:MetodosDePago; //metodo de pago
  estado?:boolean
}

