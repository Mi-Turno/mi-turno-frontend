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
    idRol:0
  };

  public getUsuarios(): Observable<UsuarioInterface[]>{
    return this.http.get<UsuarioInterface[]>(this.urlBase);
  }

  public obtenerUsuarioPorId(id:number|undefined):Observable<UsuarioInterface>{
    return this.http.get<UsuarioInterface>(`${this.urlBase}/${id}`);
  }

  public obtenerUsuariosByEmailAndPassword(email:string,password:string): Observable<UsuarioInterface>{

    return this.http.post<UsuarioInterface>(`${this.urlBase}/login`,{email,password});
  }

  public getUsuarioByRol(rol: string): Observable<UsuarioInterface[]>{
    const params = new HttpParams()
    .set('rol', rol);
    return this.http.get<UsuarioInterface[]>(`${this.urlBase}/rol/${rol}?rolUsuarioEnum=${rol}`,{params, responseType:"json"});
  }

  public getUsuarioByRolAndEstado(rol: string, estado: boolean): Observable<UsuarioInterface[]>{
    const params = new HttpParams()
    .set('rol', rol)
    .set('estado', estado)
    return this.http.get<UsuarioInterface[]>(`${this.urlBase}/rol/${rol}/estado/${estado}`,{params, responseType:"json"});
  }

  public postUsuario(usuario:UsuarioInterface):Observable<UsuarioInterface>{
    return this.http.post<UsuarioInterface>(this.urlBase,usuario)
    };

    public putUsuario(id: number, usuario:UsuarioInterface):Observable<UsuarioInterface>{
      return this.http.put<UsuarioInterface>(`${this.urlBase}/${id}`, usuario)
    }

    public deleteUsuario(id:number): Observable<Boolean> {
      return this.http.delete<Boolean>(`${this.urlBase}/${id}`);
    }


  }


