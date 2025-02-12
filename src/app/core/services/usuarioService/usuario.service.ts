import {  HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UsuarioInterface } from '../../interfaces/usuario-interface';
import { VerificarUsuarioInterface } from '../../interfaces/verificar-usuario.interface';


@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private urlBase: string = 'http://localhost:8080/usuarios';
  private urlAuth: string = 'http://localhost:8080/auth';
  private http: HttpClient= inject(HttpClient);


  usuario:UsuarioInterface ={} as UsuarioInterface;


  public getUsuarios(token:string): Observable<UsuarioInterface[]>{
     /*const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          });*/
    return this.http.get<UsuarioInterface[]>(this.urlBase,);
  }

  public verificarEmail(verificarUsuarioRequest: VerificarUsuarioInterface):Observable<string>{
    return this.http.post<string>(`${this.urlAuth}/verificar`,verificarUsuarioRequest);
  }

  public reenviarCodigoDeVerificacion(emailAReenviar: string):Observable<object>{
    const nuevo: VerificarUsuarioInterface = {
      email: emailAReenviar,
      codigoVerificacion: ""
    }
    return this.http.post<object>(`${this.urlAuth}/reenviar`,nuevo);
  }

  public obtenerUsuarioPorId(id:number|undefined):Observable<UsuarioInterface>{
    return this.http.get<UsuarioInterface>(`${this.urlBase}/${id}`);
  }

  //-------------JWT-------->>>>>>

  public getToken(email:string,password:string): Observable<string>{
    return this.http.post<string>(`${this.urlAuth}/login`,{email,password},{ responseType: 'text' as 'json' });
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


  public modificarEstadoUsuario(id: number):Observable<void>{
    return this.http.patch<void>(`${this.urlBase}/${id}/estado`, {});
  }


  }


