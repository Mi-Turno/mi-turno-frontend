export interface UsuarioInterface {
  idUsuario?: number;
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  telefono: string;
  fechaNacimiento: string; // O puedes usar Date si prefieres
  rolEntidad: {
      id_rol?: number;
      rol: string;
  };
  estado?: boolean;
}
