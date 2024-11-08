import { DiasEnum } from "../../shared/models/diasEnum";

export interface HorarioProfesional {
idHorario?:number;
diaEntidad:DiasEnum;
horaInicio:number;
estado:boolean;

}
