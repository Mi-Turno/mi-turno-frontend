import { Component, inject } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { InputComponent } from "../../../../shared/components/input/input.component";
import { BotonComponent } from "../../../../shared/components/boton/boton.component";
import { MatIconModule } from "@angular/material/icon";
import { ICONOS } from "../../../../shared/models/iconos.constants";
import { ROLES } from "../../../../shared/models/rolesUsuario.constants";
import { PLACEHOLDERS } from "../../../../shared/models/placeholderInicioSesion.constants";
import { NegocioServiceService } from "../../../../core/services/negocioService/negocio-service.service";
import { CredencialInterface } from "../../../../core/interfaces/credencial.interface";
import { NegocioInterface } from "../../../../core/interfaces/negocio-interface";
import { HttpErrorResponse } from "@angular/common/http";

@Component
({
  selector: 'app-registrar-negocio',
  standalone: true,
  imports: [ReactiveFormsModule, InputComponent, BotonComponent, MatIconModule],
  templateUrl: './registrar-negocio.component.html',
  styleUrl: './registrar-negocio.component.css'
})
export class RegistrarNegocioComponent {
  claseAppInput: string = "claseAppInput";
  inputContainer: string = "inputContainer";
  iconos = ICONOS;

  roles = ROLES;


  placeholders = PLACEHOLDERS;
  //form reactivo

  formularioRegisterNegocio:FormGroup = new FormGroup({
    nombre: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    telefono: new FormControl('', Validators.required),
    rubro: new FormControl('', Validators.required),
    calle: new FormControl('', Validators.required),
    altura: new FormControl('', Validators.required),
    detalle: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    passwordRepetida: new FormControl('', Validators.required),
  });


  //metodo para crear un negocio
  negocioService:NegocioServiceService = inject(NegocioServiceService);
  obtenerNegocioForm() {

    const credencial:CredencialInterface = {
      email:this.formularioRegisterNegocio.get('email')?.value,
      password:this.formularioRegisterNegocio.get('password')?.value,
      telefono:this.formularioRegisterNegocio.get('telefono')?.value,
      estado:true,
    } ;

      return {
        nombre: this.formularioRegisterNegocio.get('nombre')?.value,
        apellido: this.formularioRegisterNegocio.get('nombre')?.value,//es igual ya que un negocio no tiene apellido
        fechaNacimiento: new Date().toISOString().slice(0, 10),//fecha de nacimiento por defecto que seria la fecha de hoy
        credencial: credencial,
        rubro: this.formularioRegisterNegocio.get('rubro')?.value,
        calle: this.formularioRegisterNegocio.get('calle')?.value,
        altura: this.formularioRegisterNegocio.get('altura')?.value,
        detalle: this.formularioRegisterNegocio.get('detalle')?.value,
        rolUsuario: ROLES.negocio
      }

  }

  // Metodo para registrar un negocio haciendo el click
  registrarNegocio() {

    if(this.formularioRegisterNegocio.valid){
      const negocio:NegocioInterface = this.obtenerNegocioForm();
      this.negocioService.postNegocio(negocio).subscribe({
        next:(response) =>{
          console.log(response);
          alert("Negocio registrado correctamente");
        },
        error:(error) =>{
          if(error instanceof HttpErrorResponse){
            console.log("Error al registrar negocio: "+error.message);
          }
        }
      })
    }else{
      console.log("Formulario inválido  ");
    }

  }

}
