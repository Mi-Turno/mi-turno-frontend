import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TurnoInterface } from '../../interfaces/turno-interface';
import { estadoTurno } from '../../../shared/models/estadoTurnoEnum';

@Injectable({
  providedIn: 'root'
})
export class TurnoService {
  private urlBase = "http://localhost:8080/negocios";//http://localhost:8080/negocios/{idNegocio}/turnos/{idTurno}

  http:HttpClient = inject(HttpClient);

  getMetodosDePago():Observable<string[]>{
    return this.http.get<string[]>(this.urlBase);
  }

  public postTurno(turnoNuevo: TurnoInterface): Observable<TurnoInterface> {
    const requestBody: any = {
      idServicio: turnoNuevo.idServicio,
      metodosDePagoEnum: turnoNuevo.metodosDePagoEnum,
      idCliente: turnoNuevo.idCliente,
      idProfesional: turnoNuevo.horarioProfesional.idProfesional,
      horarioProfesional: turnoNuevo.horarioProfesional,
      // Convertir la fecha a formato 'yyyy-MM-dd'
      fechaInicio: this.formatearFecha(turnoNuevo.fechaInicio)
    };



    return this.http.post<TurnoInterface>(
      `${this.urlBase}/${turnoNuevo.idNegocio}/turnos`,
      requestBody
    );
  }

  //metodo para formatear la fecha porque sino por la zona horario me agrega mas horas
  private formatearFecha(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  public getTurnos(idNegocio:number):Observable<TurnoInterface[]>{
    return this.http.get<TurnoInterface[]>(`${this.urlBase}/${idNegocio}/turnos`);///negocios/{idNegocio}/turnos
  }
  public getTurno(idNegocio: number, idTurno: number): Observable<TurnoInterface> {
    return this.http.get<TurnoInterface>(`${this.urlBase}/${idNegocio}/turnos/${idTurno}`);
  }

  public deleteTurno(idNegocio: number, idTurno: number): Observable<TurnoInterface> {
    return this.http.delete<TurnoInterface>(`${this.urlBase}/${idNegocio}/turnos/${idTurno}`)
  }

// public updateTurno(idNegocio: number,idTurno: number, estado: estadoTurno): Observable<TurnoInterface>{
//   return this.http.patch<TurnoInterface>(`${this.urlBase}/${idNegocio}/turnos/${idTurno}/${estado}`,null);
// }

public updateTurno(idNegocio: number, idTurno: number, estado: estadoTurno): Observable<TurnoInterface> {
  const url = `${this.urlBase}/${idNegocio}/turnos/${idTurno}/${estado}`;
  return this.http.patch<TurnoInterface>(url, null, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

}
