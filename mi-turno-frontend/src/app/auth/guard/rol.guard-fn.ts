import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "../service/auth.service";


export const rolGuardFn = (rolRequerido:string) => {

  const authService = inject(AuthService);
  const route = inject(Router);

  //si el usuario esta autenticado y tiene el rol que se le pasa por parametro
  if (authService.isAuthenticated()) {
    const rolUsuario = authService.getRolUsuario();
      if(rolUsuario === rolRequerido){
        return true;
      }else{
        route.navigateByUrl('/login');//todo mandar a acceso denegado
      return false;
      }
  } else {
    route.navigateByUrl('/login');
    return false;
  }
}
