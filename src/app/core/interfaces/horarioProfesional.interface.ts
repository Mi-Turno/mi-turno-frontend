import { DiasEnum } from "../../shared/models/diasEnum";

export interface HorarioProfesional {
idHorario?:number;
idProfesional:number;
dia:DiasEnum;
horaInicio:Date|string;
estado?:boolean;

}
