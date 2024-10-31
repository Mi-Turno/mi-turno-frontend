import { DiasEnum } from "../../shared/models/diasEnum";

export interface HorarioProfesional {
idProfesional?:number;
dia:DiasEnum;
horaInicio:Date;
//hora fin se puede calcular con la duracion del servicio + la hora de inicio
horaFin:Date;
}
