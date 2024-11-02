export interface UsuarioInterface {
  idUsuario?: number;
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  telefono: string;
  fechaNacimiento: string; // O puedes usar Date si prefieres
  idRol:number//4-NEGOCIO |3-PROFESIONAL| 2-CLIENTE | 1-ADMIN
  estado?: boolean;
  idNegocio?:number;//Me sirve para el profesional
}
