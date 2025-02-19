import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { Observable } from "rxjs";
import { AuthService } from "./service/auth.service";


export const AuthInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
  const authService = inject(AuthService);
  const token = authService.getToken(); // Obtengo el token desde el AuthService

  const urlIgnoradas = ['/login', '/register', '/auth/verificar', '/auth/reenviar']; // URLs que no requieren token
  const esMultipart = req.body instanceof FormData; // Verifica si el cuerpo de la petición es FormData

  const ignorar = urlIgnoradas.some(url => req.url.includes(url));

  let clonedRequest = req;

  if (!ignorar && token) {
    const headers: { [header: string]: string } = {
      Authorization: `Bearer ${token}`
    };

    // Solo agregamos Content-Type si NO es multipart/form-data
    if (!esMultipart) {
      headers['Content-Type'] = 'application/json';
    }

    clonedRequest = req.clone({ setHeaders: headers });
  }

  return next(clonedRequest);
};

