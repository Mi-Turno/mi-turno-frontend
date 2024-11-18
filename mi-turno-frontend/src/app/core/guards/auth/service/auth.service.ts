import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  estoyLogueado:boolean = false;
  constructor(private route:Router){}
  logIn(idUsuario:string,rolUsuario:string){
    localStorage.setItem('idUsuario',idUsuario);
    localStorage.setItem('rolUsuario',rolUsuario);
    this.estoyLogueado = true;
  }
  logOut(){
    localStorage.clear();
    this.estoyLogueado = false;
    this.route.navigateByUrl('/');//lo mando a la landing page
  }
  isAuthenticated(): boolean {
    return this.estoyLogueado || !!localStorage.getItem('idUsuario');
  }

  getRolUsuario(): string | null {
    return localStorage.getItem('rolUsuario');
  }
}
