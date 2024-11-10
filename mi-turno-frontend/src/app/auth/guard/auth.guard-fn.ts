import { inject } from "@angular/core";
import { AuthService } from "../service/auth.service"
import { Router } from "@angular/router";


export const authGuardFn = () => {

  const authService = inject(AuthService);
  const route = inject(Router);
  if (authService.estoyLogueado||(localStorage.getItem('idUsuario')&&localStorage.getItem('rolUsuario'))) {
    
    return true;
  } else {
    route.navigateByUrl('/login');
    return false;
  }

}
