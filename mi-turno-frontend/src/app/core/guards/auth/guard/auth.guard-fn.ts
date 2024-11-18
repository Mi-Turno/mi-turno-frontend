import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "../service/auth.service";


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
