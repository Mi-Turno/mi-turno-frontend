import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { DiasEnum } from '../../../shared/models/diasEnum';
import { Observable } from 'rxjs';
import { HorarioProfesional } from '../../interfaces/horarioProfesional.interface';

@Injectable({
  providedIn: 'root'
})
export class HorarioXprofesionalService {
  //negocios/{idNegocio}/profesionales/{idProfesional}/horarios/dia ?idDia=1
//http://localhost:8080/negocios/{idNegocio}/profesionales/{idProfesional}/horarios
  private urlBase: string = 'http://localhost:8080/negocios';
  private http: HttpClient= inject(HttpClient);

///negocios/{idNegocio}/profesionales/{idProfesional}/horarios/dia

  public obtenerHorariosPorIdProfesionalYDia(idNegocio:number,idProfesional: number, idDia: number): Observable<HorarioProfesional[]> {
    return this.http.get<HorarioProfesional[]>(`${this.urlBase}/${idNegocio}/profesionales/${idProfesional}/horarios/dia/${idDia}`);
  }

  public postHorariosPorProfesional(idNegocio: number, idProfesional: number, horario: HorarioProfesional):Observable<HorarioProfesional> {
    return this.http.post<HorarioProfesional>(`${this.urlBase}/${idNegocio}/profesionales/${idProfesional}/horarios`, horario)
  }

  public getHorarioProfesionalPorId(idNegocio:number,idProfesional: number,idHorario: number): Observable<HorarioProfesional> {
    return this.http.get<HorarioProfesional>(`${this.urlBase}/${idNegocio}/profesionales/${idProfesional}/horarios/${idHorario}`);
  }


  public deleteHorarioDeProfesional(idNegocio: number, idProfesional : number, idHorario: number) {
    return this.http.delete<HorarioProfesional>(`${this.urlBase}/${idNegocio}/profesionales/${idProfesional}/horarios/${idHorario}`)
  }


}
