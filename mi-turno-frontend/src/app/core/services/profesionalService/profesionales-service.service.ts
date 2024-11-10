import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ProfesionalInterface } from '../../interfaces/profesional-interface';
import { Observable } from 'rxjs';
import { UsuarioInterface } from '../../interfaces/usuario-interface';
import { TurnoInterface } from '../../interfaces/turno-interface';

@Injectable({
  providedIn: 'root'
})
export class ProfesionalesServiceService {
  urlBase:string = "http://localhost:8080/negocios";//http://localhost:8080/negocios/{idNegocio}/profesionales/{idProfesional}

  private http: HttpClient = inject(HttpClient);

  constructor() { }


  public getProfesionalesPorIdNegocio(idNegocio:number):Observable<UsuarioInterface[]>{
    return this.http.get<UsuarioInterface[]>(`${this.urlBase}/${idNegocio}/profesionales`);
  }
  public getProfesionalPorIdNegocio(idNegocio:number,idProfesional:number):Observable<ProfesionalInterface>{
    return this.http.get<ProfesionalInterface>(`${this.urlBase}/${idNegocio}/profesionales/${idProfesional}`);
  }

  public getListadoTurnosPorIdNegocioYIdProfesional(idNegocio:number,idProfesional:number):Observable<TurnoInterface[]>{
    return this.http.get<TurnoInterface[]>(`${this.urlBase}/${idNegocio}/profesionales/${idProfesional}/turnos`);
  }

  public GETserviciosPorIdNegocioYEstado(idNegocio:number, estado:string):Observable<ProfesionalInterface[]>{
    return this.http.get<ProfesionalInterface[]>(`${this.urlBase}/${idNegocio}/profesionales/estado/${estado}`);
}

  public postProfesionalPorIdNegocio(idNegocio:number,profesional:UsuarioInterface):Observable<UsuarioInterface>{
    return this.http.post<UsuarioInterface>(`${this.urlBase}/${idNegocio}/profesionales`,profesional);
  }
  public putUsuarioPorIdNegocio(idNegocio: number, idProfesional: number, profesional:UsuarioInterface):Observable<UsuarioInterface>{
    return this.http.put<UsuarioInterface>(`${this.urlBase}/${idNegocio}/profesionales/${idProfesional}`, profesional)
  }

  public putServicioEnProfecionalEnNegocio(idNegocio: number, idProfesional: number, idServicio: number, profesional: ProfesionalInterface): Observable<ProfesionalInterface>{
    return this.http.put<ProfesionalInterface>(`${this.urlBase}/${idNegocio}/profesionales/${idProfesional}/servicios/${idServicio}`, profesional);
  }

  public deleteServicioDeProfesionalDeNegocio(idNegocio: number, idProfesional: number, idServicio: number, profesional: ProfesionalInterface): Observable<ProfesionalInterface>{
    return this.http.put<ProfesionalInterface>(`${this.urlBase}/${idNegocio}/profesionales/${idProfesional}/servicios/${idServicio}`, profesional);
  }

  public deleteUsuario(idNegocio:number, idProfesional: number): Observable<Boolean> {
    return this.http.delete<Boolean>(`${this.urlBase}/${idNegocio}/profesionales/${idProfesional}`);
  }



}
