import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ProfesionalInterface } from '../../interfaces/profesional-interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfesionalesServiceService {
  urlBase:string = "http://localhost:8080/negocios";

  private http: HttpClient = inject(HttpClient);

  constructor() { }


  public getProfesionalesPorIdNegocio(idNegocio:number):Observable<ProfesionalInterface[]>{
    return this.http.get<ProfesionalInterface[]>(`${this.urlBase}/${idNegocio}/profesionales`);
  }

}
