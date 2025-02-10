import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {jwtDecode} from 'jwt-decode';
import { AuthInterceptor } from '../auth.interceptor';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  estoyLogueado: boolean = false;

  constructor(private route: Router) {
    this.estoyLogueado = !!localStorage.getItem('token'); // Si existe el token, estoy logueado

  }

  logIn(token: string): void {
    localStorage.setItem('token', token);
    this.estoyLogueado = true;
  }

  logOut(): void {
    localStorage.clear();
    this.estoyLogueado = false;
    this.route.navigateByUrl('/'); // Lo mando a la landing page
  }

  isAuthenticated(): boolean {
    return this.estoyLogueado || !!localStorage.getItem('token');
  }
  getToken(): string | null {
    return localStorage.getItem('token');
  }
  getRolUsuario(): string | null {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        const roles = decodedToken.roles; // Accedo al campo roles
        if (roles && roles.length > 0) {
          return roles[0].authority || null; // Devuelvo el primer rol encontrado
        }
        return null;
      } catch (error) {
        console.error('Error al decodificar el token:', error);
        return null;
      }
    }
    return null;
  }

  getEmailUsuario(): string | null {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        return decodedToken.sub || null; // El email esta bajo el campo 'sub'
      } catch (error) {
        console.error('Error al decodificar el token:', error);
        return null;
      }
    }
    return null;
  }
  getNombreUsuario(): string | null {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        return decodedToken.name || null;
      } catch (error) {
        console.error('Error al decodificar el token:', error);
        return null;
      }
    }
    return null;
  }
  getIdUsuario(): number | null {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        return decodedToken.id || null;
      } catch (error) {
        console.error('Error al decodificar el token:', error);
        return null;
      }
    }
    return null;
  }
}
