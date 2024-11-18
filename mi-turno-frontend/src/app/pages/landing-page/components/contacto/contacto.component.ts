import { Component, inject } from '@angular/core';
import { InputComponent } from "../../../../shared/components/input/input.component";
import { BotonComponent } from "../../../../shared/components/boton/boton.component";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EmailContactoInterface } from '../../../../core/interfaces/email-contacto-interface';
import { EmailContactoService } from '../../../../core/services/emailContactoService/email-contacto.service';
import { HttpErrorResponse } from '@angular/common/http';
import { codigoErrorHttp } from '../../../../shared/models/httpError.constants';

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [InputComponent, BotonComponent, ReactiveFormsModule],
  templateUrl: './contacto.component.html',
  styleUrl: './contacto.component.css'
})
export class ContactoComponent {


mailEnviado = false;

formularioContacto = new FormGroup ({
  nombre: new FormControl('', Validators.required),
  negocio: new FormControl('', Validators.required),
  email: new FormControl('', [Validators.required, Validators.email]),
  mensaje: new FormControl('', [Validators.required, Validators.minLength(10)])
})

emailService: EmailContactoService= inject(EmailContactoService)
crearEmail(): EmailContactoInterface {
return{
  nombre: this.formularioContacto.get('nombre')?.value || '',
  negocio: this.formularioContacto.get('negocio')?.value || '',
  email:this.formularioContacto.get('email')?.value || '',
  mensaje: this.formularioContacto.get('mensaje')?.value || '',
}
}


enviarMail() {
  const email: EmailContactoInterface = this.crearEmail();
  this.emailService.postEnviarEmail(email).subscribe({
    next: (response) => {
      this.bloquearContacto();
    }, error: (error: HttpErrorResponse) => {
      if (error.status === codigoErrorHttp.NO_ENCONTRADO) {
        alert('Error 404: Email no encontrado');

      } else if (error.status === codigoErrorHttp.ERROR_SERVIDOR) {
        alert('Error 500: Error del servidor');

      } else if (error.status === codigoErrorHttp.ERROR_CONTACTAR_SERVIDOR) {
        alert('Error de conexión: No se pudo contactar con el servidor (ERR_CONNECTION_REFUSED)');
      } else if (error.status === codigoErrorHttp.ERROR_REPETIDO) {
        alert('Error 409: el Email ya existe en el sistema');
      } else {
        alert('Error al enviar el Email');
      }
}})
}


bloquearContacto() {
  this.mailEnviado = true;
  alert("Mail envíado de forma correcta");
}

}


