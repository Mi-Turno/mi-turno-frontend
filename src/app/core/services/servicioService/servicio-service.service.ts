import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ServicioInterface } from '../../interfaces/servicio-interface';
import { Observable } from 'rxjs';
import { UsuarioInterface } from '../../interfaces/usuario-interface';
import { ProfesionalInterface } from '../../interfaces/profesional-interface';

@Injectable({
  providedIn: 'root'
})
export class ServicioServiceService {
  private urlBase:string ='http://localhost:8080/negocios';//http://localhost:8080/negocios/{idNegocio}/servicio/{idServicio}
  private http:HttpClient = inject(HttpClient);
  servicio:ServicioInterface ={
    nombre:'',
    duracion:0,
    precio:0
  };
  //me retorna todos los servicios//todo luego habria que filtrar por local etc...
  public getServiciosPorIdNegocio(idNegocio:number):Observable<ServicioInterface[]>{
      return this.http.get<ServicioInterface[]>(`${this.urlBase}/${idNegocio}/servicios`);
  }
  public getServicioPorIdNegocio(idNegocio:number,idServicio:number):Observable<ServicioInterface>{
    return this.http.get<ServicioInterface>(`${this.urlBase}/${idNegocio}/servicios/${idServicio}`);
  }

  public getListadoDeProfesionalesPorIdServicioYIdNegocio(idServicio:number,idNegocio:number):Observable<ProfesionalInterface[]>{
    return this.http.get<ProfesionalInterface[]>(`${this.urlBase}/${idNegocio}/servicios/${idServicio}/profesionales`);
  }

  public getServiciosPorIdNegocioYEstado(idNegocio:number, estado:string):Observable<ServicioInterface[]>{
    return this.http.get<ServicioInterface[]>(`${this.urlBase}/${idNegocio}/servicios/estado/${estado}`);
}


  public postCrearUnServicio(servicio:ServicioInterface,idNegocio:number): Observable<ServicioInterface>{
    return this.http.post<ServicioInterface>(`${this.urlBase}/${idNegocio}/servicios`,servicio);
  }

  public deleteServicio(idServicio:number, idNegocio:number): Observable<Boolean> {
    return this.http.delete<Boolean>(`${this.urlBase}/${idNegocio}/servicios/${idServicio}`);
  }


  public putServicio(idServicio: number, idNegocio: number, servicio: ServicioInterface): Observable<ServicioInterface> {

    return this.http.put<ServicioInterface>(`${this.urlBase}/${idNegocio}/servicios/${idServicio}`, servicio);
  }
}
