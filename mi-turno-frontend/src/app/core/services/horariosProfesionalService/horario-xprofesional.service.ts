import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { DiasEnum } from '../../../shared/models/diasEnum';
import { Observable } from 'rxjs';
import { HorarioXProfesionalInterface } from '../../interfaces/horarios-x-profesionale-interface';

@Injectable({
  providedIn: 'root'
})
export class HorarioXprofesionalService {

  private urlBase: string = 'http://localhost:8080/horarios-profesionales';
  private http: HttpClient= inject(HttpClient);


  obtenerHorariosPorProfesionalYDia(idProfesional: number, dia: DiasEnum): Observable<HorarioXProfesionalInterface[]> {
    const params = new HttpParams()
      .set('idProfesional', idProfesional.toString())
      .set('dia', dia);
    return this.http.get<HorarioXProfesionalInterface[]>(`${this.urlBase}/profesional/dia`, { params });
  }

}
