import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ClienteInterface } from '../../interfaces/cliente-interface';

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
    public postCliente(cliente:ClienteInterface):Observable<ClienteInterface>{
        return this.http.post<ClienteInterface>(this.urlBase,cliente);
    }
    public putCliente(cliente:ClienteInterface):Observable<ClienteInterface>{
        return this.http.put<ClienteInterface>(this.urlBase,cliente);
    }
    public deleteCliente(idCliente:number):Observable<ClienteInterface>{
        return this.http.delete<ClienteInterface>(`${this.urlBase}/${idCliente}`);
    }
    public getClienteByEmailAndPassword(email:string,password:string):Observable<ClienteInterface>{
        return this.http.post<ClienteInterface>(`${this.urlBase}/login`,{email,password});
    }

}
