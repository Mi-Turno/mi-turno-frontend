import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { DiasEnum } from '../../../shared/models/diasEnum';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HorarioXprofesionalService {
//http://localhost:8080/negocios/{idNegocio}/profesionales/{idProfesional}/horarios
  private urlBase: string = 'http://localhost:8080/negocios';
  private http: HttpClient= inject(HttpClient);


  public obtenerHorariosPorIdProfesionalYDia(idNegocio:number,idProfesional: number, dia: number): Observable<HorarioXprofesionalService[]> {
    return this.http.get<HorarioXprofesionalService[]>(`${this.urlBase}/${idNegocio}/profesionales/${idProfesional}/horarios/${dia}`);
  }

  public postHorariosPorProfesional(horario: HorarioXprofesionalService):Observable<HorarioXprofesionalService> {
    return this.http.post<HorarioXprofesionalService>(this.urlBase, horario)
  }



}
