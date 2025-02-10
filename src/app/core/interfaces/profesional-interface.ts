import { HorarioProfesional } from "./horarioProfesional.interface";
import { ServicioInterface } from "./servicio-interface";
import { TurnoInterface } from "./turno-interface";
import { UsuarioInterface } from "./usuario-interface";

export interface ProfesionalInterface extends UsuarioInterface{
  idNegocio?:number;//Me sirve para el profesional
  listaServicios?: ServicioInterface[];
  horariosDisponibles?: HorarioProfesional[];
  turnosAgendados?: TurnoInterface[];
}
