import { Component, inject } from '@angular/core';
import { InputComponent } from "../../../../shared/components/input/input.component";
import { BotonComponent } from "../../../../shared/components/boton/boton.component";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EmailContactoInterface } from '../../../../core/interfaces/email-contacto-interface';
import { EmailService } from '../../../../core/services/emailService/email-service.service';
import Swal from 'sweetalert2';

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

emailService: EmailService= inject(EmailService)
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
  this.emailService.postEnviarEmailContacto(email).subscribe({
    next: (response) => {
      this.bloquearContacto();
    }})
}


bloquearContacto() {
  this.mailEnviado = true;
  this.formularioContacto.get('nombre')?.disable();
  this.formularioContacto.get('negocio')?.disable();
  this.formularioContacto.get('email')?.disable();
  this.formularioContacto.get('mensaje')?.disable();
  Swal.fire({
    icon: 'success',
    title: '¡Mail enviado de forma correcta!',
    showConfirmButton: false,
    timer: 1500
  })
  //alert("Mail envíado de forma correcta");
}

}


