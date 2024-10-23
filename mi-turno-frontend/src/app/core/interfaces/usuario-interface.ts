export interface UsuarioInterface {
  id?:number;
  nombre:string;
  apellido:string;
  email:string;
  telefono:string;
  fechaNacimiento?:Date;
  password:string;
  rol:String;
}
