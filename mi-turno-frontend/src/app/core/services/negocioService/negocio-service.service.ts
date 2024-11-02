import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NegocioServiceService {

  private urlBase:string = 'http://localhost:8080/negocios';

  private http = inject(HttpClient);

  public getIdNegocioByNombre(nombre:string): Observable<number>{
    return this.http.get<number>(`${this.urlBase}/${nombre}`);
  }
}