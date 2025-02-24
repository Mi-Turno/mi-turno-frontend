import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from "@angular/router";
import { AuthService } from "../service/auth.service";


export const authGuardFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  } else {
    // Si la ruta es negocios/:nombreNegocio/pedir-turno, guardo la ruta para redirigir al usuario luego de loguearse
    if (state.url.includes('/negocios/') && state.url.includes('/pedir-turno')) {
      localStorage.setItem('redirectAfterLogin', state.url);
    }

    router.navigateByUrl('/login');
    return false;
  }
};
