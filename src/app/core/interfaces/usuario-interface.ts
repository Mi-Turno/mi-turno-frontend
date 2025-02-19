import { CredencialInterface } from './credencial.interface';
export interface UsuarioInterface {
  idUsuario?: number;
  nombre: string;
  apellido: string;
  credencial: CredencialInterface;
  fechaNacimiento: string;
  rolUsuario:string//4-NEGOCIO |3-PROFESIONAL| 2-CLIENTE | 1-ADMIN
  fotoPerfil?:string | File;

}
