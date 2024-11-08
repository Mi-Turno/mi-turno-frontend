import { UsuarioInterface } from "./usuario-interface";

export interface ProfesionalInterface extends UsuarioInterface{
  idNegocio?:number;//Me sirve para el profesional
}
