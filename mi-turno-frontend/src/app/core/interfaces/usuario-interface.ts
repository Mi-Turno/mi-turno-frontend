export interface UsuarioInterface {
  idUsuario?: number;
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  telefono: string;
  fechaNacimiento: string; // O puedes usar Date si prefieres
  rolUsuario:number|string//4-NEGOCIO |3-PROFESIONAL| 2-CLIENTE | 1-ADMIN
  estado?: boolean;

}
