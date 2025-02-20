import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ClienteInterface } from '../../interfaces/cliente-interface';
import { TurnoInterface } from '../../interfaces/turno-interface';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
    private urlBase:string = 'http://localhost:8080/clientes';
    private http:HttpClient = inject(HttpClient);

    public getClientes():Observable<ClienteInterface[]>{
        return this.http.get<ClienteInterface[]>(this.urlBase);
    }
    public getClienteById(idCliente:number):Observable<ClienteInterface>{

        return this.http.get<ClienteInterface>(`${this.urlBase}/${idCliente}`);
    }

    public getEmailClienteById(idCliente: number): Observable<{ email: string }> {
      return this.http.get<{ email: string }>(`${this.urlBase}/email/${idCliente}`);
  }

    public postCliente(cliente:ClienteInterface):Observable<ClienteInterface>{
        return this.http.post<ClienteInterface>(`${this.urlBase}/register`,cliente);
    }
    public putCliente(cliente:ClienteInterface):Observable<ClienteInterface>{
        return this.http.put<ClienteInterface>(this.urlBase,cliente);
    }
    public patchCliente(clienteParcial: Partial<ClienteInterface>,id:number): Observable<ClienteInterface> {
      return this.http.patch<ClienteInterface>(`${this.urlBase}/${id}`, clienteParcial);
    }
    public deleteCliente(idCliente:number):Observable<ClienteInterface>{
        return this.http.delete<ClienteInterface>(`${this.urlBase}/${idCliente}`);
    }

    public getListadoDeTurnosPorIdCliente(idCliente:number):Observable<TurnoInterface[]>{
      return this.http.get<TurnoInterface[]>(`${this.urlBase}/${idCliente}/turnos`);
    }

    // Clientes Invitados

    public postClienteInvitado(nombreCliente: string, nombreNegocio: string): Observable<ClienteInterface> {
      const params = new HttpParams()
      .set('nombreCliente', nombreCliente)
      .set('nombreNegocio', nombreNegocio);
      return this.http.post<ClienteInterface>(`${this.urlBase}/${nombreCliente}/invitado/${nombreNegocio}`, params)
    }


    public getLastClienteInvitado(nombreNegocio: string): Observable<ClienteInterface> {
      const params = new HttpParams()
      .set('nombreNegocio', nombreNegocio)
      return this.http.get<ClienteInterface>(`${this.urlBase}/ultimo-invitado`, { params })
    }

}
