import { inject, Injectable } from '@angular/core';
import { HttpBackend, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MetodosDePagoInterface } from '../../interfaces/metodos-de-pagos-interface';

@Injectable({
  providedIn: 'root'
})
export class MetodosDePagoServiceService {
  private urlBase = "http://localhost:8080/metodos-de-pago";

  http:HttpClient = inject(HttpClient);

  getMetodosDePago():Observable<MetodosDePagoInterface[]>{
    return this.http.get<MetodosDePagoInterface[]>(this.urlBase);
  }


}
