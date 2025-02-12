import { ChangeDetectionStrategy,  Component, inject, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ClienteInterface } from '../../../core/interfaces/cliente-interface';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { ClienteService } from '../../../core/services/clienteService/cliente.service';
import { ROLES } from '../../../shared/models/rolesUsuario.constants';
import { ICONOS } from '../../../shared/models/iconos.constants';
import { PLACEHOLDERS } from '../../../shared/models/placeholderInicioSesion.constants';
import { UsuarioService } from '../../../core/services/usuarioService/usuario.service';
import { CredencialInterface } from '../../../core/interfaces/credencial.interface';
import { AuthService } from '../../../core/guards/auth/service/auth.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { NgClass } from '@angular/common';


@Component({
  selector: 'app-toggle',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass,ReactiveFormsModule, MatIconModule,MatFormFieldModule, MatInputModule, FormsModule,MatDatepickerModule],
  templateUrl: './toggle.component.html',
  styleUrl: './toggle.component.css',
})
export class ToggleComponent {

  //variables
  iconos = ICONOS;
  roles = ROLES;
  placeholders = PLACEHOLDERS;
  exito = signal(false);
  isLogin = signal(true);//Para saber si esta en el login o en el register

  //servicios
  usuarioService = inject(UsuarioService);//Para poder obtener cualquier usuario del sistema sea CLIENTE, PROFESIONAL, NEGOCIO O ADMIN
  clienteService = inject(ClienteService);//Para poder hacer el login y el register de los clientes
  fb:FormBuilder = inject(FormBuilder)//Forms reactives
  router: Router = inject(Router);//Para poder redirigir a las distintas paginas
  //auth
  auth:AuthService = inject(AuthService);//Para poder loguear al usuario

  //-----------------------------------TOGGLE-----------------------------------

  mostrarLogIn() {
    this.isLogin.set(true)
  }

  mostrarRegister() {
    this.isLogin.set(false)
  }

  //-----------------------------------REGISTER-----------------------------------
  formularioRegister:FormGroup = this.fb.nonNullable.group({
    nombre: new FormControl('', Validators.required),
    apellido: new FormControl('', Validators.required),
    emailRegister: new FormControl('', [Validators.required, Validators.email]),
    fechaNacimiento: new FormControl('',[Validators.required]),
    telefono: new FormControl('', Validators.required),
    passwordRegister: new FormControl('', Validators.required),
    passwordRepetida: new FormControl('', Validators.required),
  });

  //metodo para crear un cliente
   obtenerFormRegister():ClienteInterface {
    const credencial:CredencialInterface = {
      email:this.formularioRegister.get('emailRegister')?.value,
      password:this.formularioRegister.get('passwordRegister')?.value,
      telefono:this.formularioRegister.get('telefono')?.value,
      estado:true,
    } ;
    return {
      nombre:this.capitalizarString(this.formularioRegister.get('nombre')?.value),
      apellido:this.capitalizarString(this.formularioRegister.get('apellido')?.value),
      fechaNacimiento:this.formularioRegister.get('fechaNacimiento')?.value,
      credencial:credencial,
      rolUsuario: 'CLIENTE',

    };

  }

  //validaciones campos formularios
  emailExiste:boolean = false;
  telefonoExiste:boolean = false;

  //limpiar los campos del formulario
  limpiarCampos() {
    this.formularioRegister.reset();
  }

  capitalizarString(palabraFormatear: string): string {
    return palabraFormatear.charAt(0).toUpperCase() + palabraFormatear.slice(1).toLowerCase();// 0 es la primera letra de la palabra y el resto es el resto de la palabra
  }

  mensajeRegister:string= "Bienvenido de vuelta!";
  subMensajeRegister:string = "Ingresa con tus datos personales";

  private postClienteToBackend(cliente:ClienteInterface):void{


    this.clienteService.postCliente(cliente).subscribe({
      next:() =>{

        this.mensajeRegister = "Usuario Registrado con exito!";
        this.subMensajeRegister = "Redirigiendo a la pagina de verificación...";
        this.exito.set(true); // Cambia el estado a éxito para mostrar el mensaje de éxito


        localStorage.setItem('username',cliente.credencial.email);//Guardo el email en el local storage para poder verificarlo

        setTimeout(()=>{

          this.router.navigateByUrl('/verificacion-email'); //redirigir a la pagina de verificación de email

          this.exito.set(false);
          this.mensajeRegister= "Bienvenido de vuelta!";
          this.subMensajeRegister = "Ingresa con tus datos personales";

          this.limpiarCampos() //limpia los campos del formulario

         },2000)




      },
      error: (error:HttpErrorResponse) =>{
        const mensaje = error.error['mensaje'];
        

        if (mensaje.includes("email")) {
          // Agrega el error personalizado al FormControl
          this.formularioRegister.get('emailRegister')?.setErrors({ emailExiste: true });
        }
        else if (mensaje.includes("telefono")) {
          this.formularioRegister.get('telefono')?.setErrors({ telefonoExiste: true });
        }
    }
    })

  }



  // Método para enviar los valores del formulario al backend
  onRegister() {
    if (this.formularioRegister.valid) {

      const cliente:ClienteInterface = this.obtenerFormRegister();

      this.postClienteToBackend(cliente);

    }else{
      //marcamos todos como tocados para que se muestren los errores
      this.formularioRegister.markAllAsTouched();
    }

  }


  tieneErrorRegister(control: string, error: string) {
    return this.formularioRegister.controls[control].hasError(error) && this.formularioRegister.controls[control].touched;
  }

  //metodos para ocultar las contraseñas

  ocultarContrasenia = signal(true);
  ocultarContraseniaEvent(event: MouseEvent) {
    this.ocultarContrasenia.set(!this.ocultarContrasenia());
    event.stopPropagation();
  }

  ocultarContraseniaRepetida = signal(true);
  ocultarContraseniaRepetidaEvent(event: MouseEvent) {
    this.ocultarContraseniaRepetida.set(!this.ocultarContraseniaRepetida());
    event.stopPropagation();
  }

  //-----------------------------------LOGIN-----------------------------------

  formularioLogin = new FormGroup({
    emailLogin: new FormControl('', [Validators.required, Validators.email]),
    passwordLogin: new FormControl('', Validators.required)
  });
  //obtengo los datos del formulario reactivo
  private obtenerDatosFormLogin(){

    return {
      email: this.formularioLogin.get('emailLogin')?.value,
      password: this.formularioLogin.get('passwordLogin')?.value
    };
  }

  ocultarContraseniaLogin = signal(true);
  ocultarContraseniaLoginEvent(event: MouseEvent) {
    this.ocultarContraseniaLogin.set(!this.ocultarContraseniaLogin());
    event.stopPropagation();
  }

  onLogin() {
    if (this.formularioLogin.valid) {

      const {email, password} = this.obtenerDatosFormLogin();

      if(email && password) {
        //obtengo el token
        this.usuarioService.getToken(email, password).subscribe({
          next: (token: string) => {
            //lo logueo
            this.auth.logIn(token);

            //obtengo el rol del usuario
            const rolUsuario = this.auth.getRolUsuario();
            const nombreUsuario = this.auth.getNombreUsuario();

            //todo agregar el nombre del usuario
            switch(rolUsuario){
              case ROLES.cliente:
                this.router.navigateByUrl('/dashboard-cliente');
                break;
              case ROLES.profesional:
                this.router.navigateByUrl('/dashboard-cliente');
                break;
              case ROLES.admin:
                this.router.navigateByUrl(`/admin/${nombreUsuario}`);//es el nombre del admin
                break;
              case ROLES.negocio:
                this.router.navigateByUrl(`/negocios/${nombreUsuario}`);//es el nombre del negocio
                break;
              default:
                console.error('ROL INEXISTENTE');
                break;
            }
          },
          error: (error: HttpErrorResponse) => {

            const mensaje = error.error;
            // Agrega el error personalizado al FormControl
            this.formularioLogin.get('passwordLogin')?.setErrors({ emailOContraseniaIncorrectos: true });
          }

        })
      }

    }else{
      //marcamos todos como tocados para mostrar los errores
      this.formularioLogin.markAllAsTouched();
    }
  }


  //validaciones campos formularios
  tieneErrorLogin(control: string, error: string) {
    return (this.formularioLogin.get(control) as FormControl).hasError(error) && (this.formularioLogin.get(control) as FormControl).touched;
  }



  //se puede modularizar en un servicio
  mostrarMensajeError(error: string) {

    switch (error) {
      case 'fechaInvalida':
        return 'Fecha de nacimiento inválida';
      case 'required':
        return 'Campo requerido';
      case 'email':
        return 'Email invalido';
      case 'emailExiste':
        return 'Email ya registrado';
      case 'telefonoExiste':
        return 'Nro Telefono ya registrado';
      case 'minlength':
        return 'Mínimo 8 caracteres';
      case 'maxlength':
        return 'Máximo 15 caracteres';
      case 'pattern':
        return 'Debe contener al menos una letra y un número';
      case 'passwordsDiferentes':
        return 'Las contraseñas no coinciden';
      case 'emailOContraseniaIncorrectos':
        return 'Email o Contraseña incorrectos'
      default:
        return 'Error';
    }

  }

}
