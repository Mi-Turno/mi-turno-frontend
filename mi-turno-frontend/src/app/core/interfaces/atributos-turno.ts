import { estadoTurno } from "../../shared/models/estadoTurnoEnum";

export interface AtributosTurno {
  idTurno?: number;
  nombreCliente: string;
  nombreProfesional: string;
  nombreServicio: string;
  metodoPago: string;
  horaInicio: string;
  fecha: string;
  estado: estadoTurno;
}
