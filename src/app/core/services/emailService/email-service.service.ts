import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { EmailInterface } from '../../interfaces/email-interface';
import { Observable } from 'rxjs';
import { EmailCancelacion } from '../../interfaces/email-cancelacion-desde-negocio';
import { EmailContactoInterface } from '../../interfaces/email-contacto-interface';


@Injectable({
  providedIn: 'root'
})
export class EmailService {

  private urlBase: string = 'http://localhost:8080/enviar-correo';
  private http: HttpClient = inject(HttpClient);
  email: EmailInterface = {
    mensaje: '',
    email: '',
    emailNegocio: '',
    servicio: '',
    precio: '',
    direccion: '',
    nombreProfesional: '',
    fecha: new Date(),
    horario: new Date(),
    ubicacion: '',
  };


  public postEnviarEmail(email: EmailInterface): Observable<EmailInterface> {
    return this.http.post<EmailInterface>(this.urlBase, email)
  }
  public postEnviarEmailContacto(emailContacto: EmailContactoInterface): Observable<EmailContactoInterface> {
    return this.http.post<EmailContactoInterface>(`${this.urlBase}/contacto`, emailContacto);
  }
  public postEnviarEmailDeCancelacionDesdeUnNegocio(emailCancelacionNegocio: EmailCancelacion): Observable<EmailCancelacion> {
    return this.http.post<EmailCancelacion>(`${this.urlBase}/cancelar-turno-desde-negocio`, emailCancelacionNegocio)
  }
  public enviarEmailCancelacionCliente(emailCancelacionNegocio: EmailCancelacion): Observable<EmailCancelacion> {
    return this.http.post<EmailCancelacion>(`${this.urlBase}/cancelar-turno-cliente`, emailCancelacionNegocio)
  }
}
