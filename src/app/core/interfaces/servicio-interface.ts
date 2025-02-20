export interface ServicioInterface {
  idServicio?:number;
  idNegocio?:number;
  nombre:string;
  duracion?:number;
  precio?:Number;
  fotoServicio?:string | File;
}
