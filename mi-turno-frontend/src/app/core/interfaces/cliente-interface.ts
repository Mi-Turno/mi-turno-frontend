import { TurnoInterface } from "./turno-interface";
import { UsuarioInterface } from "./usuario-interface";

export interface ClienteInterface extends UsuarioInterface{
  listadoDeTurnos?:Array<TurnoInterface>;
}
