import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { NegocioInterface } from '../../interfaces/negocio-interface';

@Injectable({
  providedIn: 'root'
})
export class NegocioServiceService {

  private urlBase: string = 'http://localhost:8080/negocios';

  private http = inject(HttpClient);

  public getIdNegocioByNombre(nombre: string): Observable<number> {
    return this.http.get<number>(`${this.urlBase}/${nombre}`);
  }
  public getNumeroDeSoporte(idNegocio: number): Observable<number> {
    return this.http.get<number>(`${this.urlBase}/numero-soporte/${idNegocio}`);
  }
  public getNegocioById(id: number): Observable<NegocioInterface> {
    return this.http.get<NegocioInterface>(`${this.urlBase}/id/${id}`);
  }
  public postNegocio(negocio: NegocioInterface): Observable<NegocioInterface> {
    return this.http.post<NegocioInterface>(`${this.urlBase}/register`, negocio);
  }

  public getTodosLosNegocios(): Observable<NegocioInterface[]> {
    return this.http.get<NegocioInterface[]>(this.urlBase);
  }

  public putNegocio(id:number, negocio:NegocioInterface): Observable<NegocioInterface>{
    return this.http.put<NegocioInterface>(`${this.urlBase}/${id}`, negocio);
  }
}
