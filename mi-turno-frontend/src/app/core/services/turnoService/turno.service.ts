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

    /*
  "idServicio": 1,
  "idMetodoDePago": 2,
  "idCliente": 2,
  "idNegocio": 1,
  "idProfesional": 4,
  "idHorarioProfesional": 1,
  "fechaInicio": "2024-11-10"
   */



    const requestBody: any = {
      idServicio: turnoNuevo.idServicio,
      metodosDePagoEnum: turnoNuevo.metodoPago,
      idCliente: turnoNuevo.idCliente,
      idNegocio: turnoNuevo.idNegocio,
      idProfesional: turnoNuevo.horarioProfesional.idProfesional,
      idHorarioProfesional: turnoNuevo.horarioProfesional.idHorario,
      fechaInicio: turnoNuevo.fechaInicio
    }
    console.log("EStoy en el service!!!!!!!!",requestBody);
    console.log(requestBody);
    return this.http.post<TurnoInterface>(`${this.urlBase}/${turnoNuevo.idNegocio}/turnos`, requestBody);
  }


}
