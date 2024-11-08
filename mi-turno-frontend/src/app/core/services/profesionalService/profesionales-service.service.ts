import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ProfesionalInterface } from '../../interfaces/profesional-interface';
import { Observable } from 'rxjs';
import { UsuarioInterface } from '../../interfaces/usuario-interface';

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
  public postProfesionalPorIdNegocio(idNegocio:number,profesional:UsuarioInterface):Observable<UsuarioInterface>{
    return this.http.post<UsuarioInterface>(`${this.urlBase}/${idNegocio}/profesionales`,profesional);
  }
  public getProfesionalPorIdNegocio(idNegocio:number,idProfesional:number):Observable<ProfesionalInterface>{
    return this.http.get<ProfesionalInterface>(`${this.urlBase}/${idNegocio}/profesionales/${idProfesional}`);
  }

}
