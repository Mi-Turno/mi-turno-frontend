import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ServicioInterface } from '../../interfaces/servicio-interface';
import { Observable } from 'rxjs';
import { UsuarioInterface } from '../../interfaces/usuario-interface';

@Injectable({
  providedIn: 'root'
})
export class ServicioServiceService {
  private urlBase:string ='http://localhost:8080/servicios';
  private http:HttpClient = inject(HttpClient);
  servicio:ServicioInterface ={
    nombre:'',
    duracion:0
  };
  //me retorna todos los servicios//todo luego habria que filtrar por local etc...
  public GETservicios():Observable<ServicioInterface[]>{
      return this.http.get<ServicioInterface[]>(this.urlBase);
  }



  public POSTcrearUnServicio(servicio:ServicioInterface): Observable<ServicioInterface>{
    return this.http.post<ServicioInterface>(this.urlBase,servicio);
  }

  public DELETEservicio(id:number): Observable<Boolean> {
    return this.http.delete<Boolean>(`${this.urlBase}/${id}`);
  }


  public GETserviciosPorCriterio(nombre?: string, estado?: boolean): Observable<ServicioInterface[]> {
    let params = new HttpParams();
    if(nombre) {
      params = params.set('nombre', nombre);
    }
    if(estado != undefined) {
      params = params.set('estado', estado)
    }
    return this.http.get<ServicioInterface[]>(this.urlBase, { params });
  }

  public PUTservicio(id: number, servicio: ServicioInterface): Observable<ServicioInterface> {

    return this.http.put<ServicioInterface>(`${this.urlBase}/${id}`, servicio);
  }
}
