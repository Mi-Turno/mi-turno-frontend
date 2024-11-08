import { UsuarioInterface } from "./usuario-interface";
//todo modificar para tener todos los precios de todos los servicios
export interface ProfesionalInterface extends UsuarioInterface{
  precioServicio:number;//mapa de servicios con sus precios

}
