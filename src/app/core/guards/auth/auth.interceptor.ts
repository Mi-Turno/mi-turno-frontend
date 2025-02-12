import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { Observable } from "rxjs";
import { AuthService } from "./service/auth.service";


export const AuthInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
  const authService = inject(AuthService);
  const token = authService.getToken(); // Obtengo el token desde el AuthService

  const urlIgnoradas = ['/login', '/register', '/auth/verificar', '/auth/reenviar']; // URLs que no requieren token

  const ignorar = urlIgnoradas.some(url => req.url.includes(url));

  if (!ignorar && token) {
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return next(clonedRequest);
  }

  // Si se ignora, enviar la solicitud sin modificar
  return next(req);
};
