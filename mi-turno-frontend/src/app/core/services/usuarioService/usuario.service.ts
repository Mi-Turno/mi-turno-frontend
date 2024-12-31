import { HttpBackend, HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UsuarioInterface } from '../../interfaces/usuario-interface';
import { ROLES } from '../../../shared/models/rolesUsuario.constants';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private urlBase: string = 'http://localhost:8080/usuarios';
  private urlToken: string = 'http://localhost:8080/auth';
  private http: HttpClient= inject(HttpClient);


  usuario:UsuarioInterface ={} as UsuarioInterface;


  public getUsuarios(token:string): Observable<UsuarioInterface[]>{
     const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
          });
    return this.http.get<UsuarioInterface[]>(this.urlBase,{headers});
  }

  public obtenerUsuarioPorId(id:number|undefined):Observable<UsuarioInterface>{
    return this.http.get<UsuarioInterface>(`${this.urlBase}/${id}`);
  }

  /*public getUsuarioByEmailAndPassword(email:string,password:string): Observable<UsuarioInterface>{
    return this.http.post<UsuarioInterface>(`${this.urlBase}/login`,{email,password});
  }*/

    //-------------JWT-------->>>>>>

  public getToken(email:string,password:string): Observable<string>{
    return this.http.post<string>(`${this.urlToken}/login`,{email,password},{ responseType: 'text' as 'json' });
  }
  //--------------------------->>>>>>
  public postUsuario(usuario:UsuarioInterface):Observable<UsuarioInterface>{
    return this.http.post<UsuarioInterface>(`${this.urlBase}/register`,usuario)
  };

  public putUsuario(id: number, usuario:UsuarioInterface):Observable<UsuarioInterface>{
    return this.http.put<UsuarioInterface>(`${this.urlBase}/${id}`, usuario)
  }

  public deleteUsuario(id:number): Observable<Boolean> {
    return this.http.delete<Boolean>(`${this.urlBase}/${id}`);
  }


  }


