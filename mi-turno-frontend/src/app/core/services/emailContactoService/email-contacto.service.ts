import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { EmailContactoInterface } from '../../interfaces/email-contacto-interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmailContactoService {

  private urlBase: string = 'http://localhost:8080/enviar-correo/contacto'
  private http:HttpClient = inject(HttpClient);
  email: EmailContactoInterface= {
    nombre:'',
    negocio: '',
    email: '',
    mensaje: ''
  }

  public postEnviarEmail(email: EmailContactoInterface):Observable<EmailContactoInterface> {
    return this.http.post<EmailContactoInterface>(this.urlBase, email);
  }


  constructor() { }
}
