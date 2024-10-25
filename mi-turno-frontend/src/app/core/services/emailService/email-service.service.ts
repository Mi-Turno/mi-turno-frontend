import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { EmailInterface } from '../../interfaces/email-interface';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class EmailService {

  private urlBase:string ='http://localhost:8080/enviar-correo';
  private http:HttpClient = inject(HttpClient);
  email:EmailInterface ={
    mensaje:'',
    email:'',
    emailNegocio:'',
    servicio:'',
    precio:'',
    direccion:''
  };
  public postEnviarEmail(email:EmailInterface): Observable<EmailInterface>{
    return this.http.post<EmailInterface>(this.urlBase,email)
  }
}
