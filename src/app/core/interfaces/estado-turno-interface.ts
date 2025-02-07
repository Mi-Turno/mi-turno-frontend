import { estadoTurno } from '../../shared/models/estadoTurnoEnum';
export interface estadoTurnoInterface {
  id:number,
  estadoTurno: estadoTurno,
  turnoEntidad: estadoTurno[]
}
