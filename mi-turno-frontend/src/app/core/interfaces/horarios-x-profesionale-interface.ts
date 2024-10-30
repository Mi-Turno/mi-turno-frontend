import { DiasEnum } from "../../shared/models/diasEnum";

export interface  HorarioXProfesionalInterface{
  idHorarioXProfesional?: number;
  idProfesional: number;
  dia: DiasEnum;
  horario: string;
}
