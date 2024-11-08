import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { DiasEnum } from '../../../shared/models/diasEnum';
import { Observable } from 'rxjs';
import { HorarioProfesional } from '../../interfaces/horarioProfesional.interface';

@Injectable({
  providedIn: 'root'
})
export class HorarioXprofesionalService {
//http://localhost:8080/negocios/{idNegocio}/profesionales/{idProfesional}/horarios
  private urlBase: string = 'http://localhost:8080/negocios';
  private http: HttpClient= inject(HttpClient);


  public obtenerHorariosPorIdProfesionalYDia(idNegocio:number,idProfesional: number, dia: number): Observable<HorarioProfesional[]> {
    return this.http.get<HorarioProfesional[]>(`${this.urlBase}/${idNegocio}/profesionales/${idProfesional}/horarios/dia?idDia=${dia}`);
  }

  public postHorariosPorProfesional(horario: HorarioProfesional):Observable<HorarioProfesional> {
    return this.http.post<HorarioProfesional>(this.urlBase, horario)
  }



}
