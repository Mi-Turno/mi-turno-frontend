import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TurnoInterface } from '../../interfaces/turno-interface';

@Injectable({
  providedIn: 'root'
})
export class TurnoService {
  private urlBase = "http://localhost:8080/negocios";//http://localhost:8080/negocios/{idNegocio}/turnos/{idTurno}

  http:HttpClient = inject(HttpClient);

  getMetodosDePago():Observable<string[]>{
    return this.http.get<string[]>(this.urlBase);
  }

  public postTurno(turnoNuevo:TurnoInterface):Observable<TurnoInterface>{
    return this.http.post<TurnoInterface>(`${this.urlBase}/${turnoNuevo.idNegocio}/turnos`, turnoNuevo);
  }


}
