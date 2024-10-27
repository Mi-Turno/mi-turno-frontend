import { HttpBackend, HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UsuarioInterface } from '../../interfaces/usuario-interface';
import { ROLES } from '../../../shared/models/rolesUsuario.constants';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private urlBase: string = 'http://localhost:8080/usuarios';
  private http: HttpClient= inject(HttpClient);

  usuario:UsuarioInterface ={
    nombre:'',
    apellido:'',
    email:'',
    telefono:'',
    fechaNacimiento:'',
    password:'',
    rol:'',
  };
  public getUsuarios(): Observable<UsuarioInterface[]>{
    return this.http.get<UsuarioInterface[]>(this.urlBase);
  }
  public getUsuariosByEmailAndPassword(email:string,password:string): Observable<UsuarioInterface>{
    const params = new HttpParams()
    .set('email',email)
    .set('password',password);
    return this.http.get<UsuarioInterface>(this.urlBase,{params,responseType:"json"});
  }

  public getUsuarioByRol(rol: string): Observable<UsuarioInterface[]>{
    const params = new HttpParams()
    .set('rol', rol);
    return this.http.get<UsuarioInterface[]>(`${this.urlBase}/rol/${rol}?rolUsuarioEnum=${rol}`,{params, responseType:"json"});
  }


  public postUsuario(usuario:UsuarioInterface):Observable<UsuarioInterface>{
    return this.http.post<UsuarioInterface>(this.urlBase,usuario)
    };



  }


