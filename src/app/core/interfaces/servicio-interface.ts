export interface ServicioInterface {
  idServicio?:number;
  idNegocio?:number;
  nombre:string;
  duracion?:number;
  precio?:number;
  fotoServicio?:string | File;
}
