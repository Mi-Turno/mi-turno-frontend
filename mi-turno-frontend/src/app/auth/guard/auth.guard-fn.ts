import { inject } from "@angular/core";
import { AuthService } from "../service/auth.service"
import { UsuarioInterface } from '../../core/interfaces/usuario-interface';

export const authGuardFn = () => {

  const authService = inject(AuthService);

  if (authService.estoyLogueado||(localStorage.getItem('idUsuario')&&localStorage.getItem('rolUsuario'))) {
    
    return true;
  } else {

    return false;
  }

}
