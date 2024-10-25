import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ServicioInterface } from '../../interfaces/servicio-interface';
import { Observable } from 'rxjs';
import { UsuarioInterface } from '../../interfaces/usuario-interface';

@Injectable({
  providedIn: 'root'
})
export class ServicioServiceService {
  private urlBase:string ='http://localhost:8080/servicios';
  private http:HttpClient = inject(HttpClient);
  servicio:ServicioInterface ={
    nombre:'',
    precio:0,
    duracion:0
  };

  public POSTcrearUnServicio(servicio:ServicioInterface): Observable<ServicioInterface>{
    return this.http.post<ServicioInterface>(this.urlBase,servicio);
  }

}