import { UsuarioInterface } from "./usuario-interface";

export interface NegocioInterface extends UsuarioInterface{
  rubro:string;
  calle:string;
  altura:string;
  detalle:string;
}
