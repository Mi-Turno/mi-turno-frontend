import { DiasEnum } from "../../shared/models/diasEnum";

export interface  HorarioXProfesionalInterface{
  idHorarioXProfesional?: number;
  idProfesional: number;
  diaEntidad:{
    id:number;
    dia:DiasEnum;
  }
  horario: Date;
}
