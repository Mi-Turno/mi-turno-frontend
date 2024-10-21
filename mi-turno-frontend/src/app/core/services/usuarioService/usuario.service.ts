import { HttpBackend, HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UsuarioInterface } from '../../interfaces/usuario-interface';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private urlBase: string = 'http://localhost:3000/usuarios';

  private http: HttpClient= inject(HttpClient);
  constructor() { }

  public getUsuarios(): Observable<UsuarioInterface[]>{
    return this.http.get<UsuarioInterface[]>(this.urlBase);
  }
}
