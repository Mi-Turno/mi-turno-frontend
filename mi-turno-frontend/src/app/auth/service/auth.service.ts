import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  estoyLogueado:boolean = false;
  constructor(private route:Router){}
  logIn(){
    this.estoyLogueado = true;
  }
  logOut(){
    localStorage.clear();
    this.estoyLogueado = false;
    this.route.navigateByUrl('/');//lo mando a la landing page
  }
}
