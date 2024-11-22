import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputComponent } from '../../../shared/components/input/input.component';
import { MatIconModule } from '@angular/material/icon';
import { ClienteInterface } from '../../../core/interfaces/cliente-interface';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { ClienteService } from '../../../core/services/clienteService/cliente.service';
import { ROLES } from '../../../shared/models/rolesUsuario.constants';
import { ICONOS } from '../../../shared/models/iconos.constants';
import { PLACEHOLDERS } from '../../../shared/models/placeholderInicioSesion.constants';
import { UsuarioService } from '../../../core/services/usuarioService/usuario.service';
import { UsuarioInterface } from '../../../core/interfaces/usuario-interface';
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
  imports: [NgClass,ReactiveFormsModule, InputComponent, MatIconModule,MatFormFieldModule, MatInputModule, FormsModule,MatDatepickerModule],
  templateUrl: './toggle.component.html',
  styleUrl: './toggle.component.css',
})
export class ToggleComponent {

  //variables
  iconos = ICONOS;
  roles = ROLES;
  placeholders = PLACEHOLDERS;
  exito:boolean = false;
  isLogin: boolean = true;//Para saber si esta en el login o en el register

  //servicios
  usuarioService = inject(UsuarioService);//Para poder obtener cualquier usuario del sistema sea CLIENTE, PROFESIONAL, NEGOCIO O ADMIN
  clienteService = inject(ClienteService);//Para poder hacer el login y el register de los clientes
  fb:FormBuilder = inject(FormBuilder)//Forms reactives
  router: Router = inject(Router);//Para poder redirigir a las distintas paginas

  //auth
  auth:AuthService = inject(AuthService);//Para poder loguear al usuario

  //-----------------------------------TOGGLE-----------------------------------

  mostrarLogIn() {
    this.isLogin = true;
    const container = document.getElementById('contenedor');
    if (container) {
      container.classList.remove('active');
    }
  }

  mostrarRegister() {
    this.isLogin = false;
    const container = document.getElementById('contenedor');
    if (container) {
      container.classList.add('active');
    }
  }

  //-----------------------------------REGISTER-----------------------------------
  formularioRegister:FormGroup = this.fb.nonNullable.group({
    nombre: new FormControl('', Validators.required),
    apellido: new FormControl('', Validators.required),
    emailRegister: new FormControl('', [Validators.required, Validators.email]),
    fechaNacimiento: new FormControl('',Validators.required),
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

  validarEmailYaExiste(control: AbstractControl){
    
  }

  capitalizarString(palabraFormatear: string): string {
    return palabraFormatear.charAt(0).toUpperCase() + palabraFormatear.slice(1).toLowerCase();// 0 es la primera letra de la palabra y el resto es el resto de la palabra
  }

  private postClienteToBackend(cliente:ClienteInterface):void{

      this.clienteService.postCliente(cliente).subscribe({
        next:(cliente:ClienteInterface) =>{
          this.exito = true;
          setTimeout(() => {

            this.exito = false; //reiniciamos el valor de exito
            this.mostrarLogIn();
          },3000);
        },
        error: (error:HttpErrorResponse) =>{

          if(error.error['email']){
            this.emailExiste=true;
            console.log(this.emailExiste);
          }
          if(error.error['telefono']){
            this.telefonoExiste=true;
            console.log(this.telefonoExiste);
          }

      }
      })

  }

  emailExiste:boolean = false;
  telefonoExiste:boolean = false;


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

        this.usuarioService.getUsuarioByEmailAndPassword(email, password).subscribe({
          next: (usuarioResponse: UsuarioInterface) => {
            //lo logueo
            this.auth.logIn(usuarioResponse.idUsuario!.toString(),usuarioResponse.rolUsuario);
            if ( usuarioResponse.rolUsuario == ROLES.cliente || usuarioResponse.rolUsuario == ROLES.profesional) {
              //lo mando al DASHBOARD DE CLIENTE
              this.router.navigateByUrl('/dashboard-cliente');
            } else if (usuarioResponse.rolUsuario === ROLES.negocio) {
              //lo mando al DASHBOARD DE LOCAL
              this.router.navigateByUrl(`/negocios/${usuarioResponse.nombre}`);//es el nombre del negocio
            } else if ( usuarioResponse.rolUsuario === ROLES.admin) {
              //lo mando al DASHBOARD DE ADMIN
              this.router.navigateByUrl(`/admin/${usuarioResponse.idUsuario}`);
            } else {
              console.error('ROL INEXISTENTE');
            }
          },
          error: (error: HttpErrorResponse) => {
            console.error(error);
          }

        })
      }

    }else{
      //marcamos todos como tocados
      this.formularioLogin.markAllAsTouched();
    }
  }
  //validaciones campos formularios


  tieneErrorLogin(control: string, error: string) {

    return (this.formularioLogin.get(control) as FormControl).hasError(error) && (this.formularioLogin.get(control) as FormControl).touched;

  }

  mostrarMensajeError(error: string) {

    switch (error) {
      case 'required':
        return 'Campo requerido';
      case 'email':
        return 'Email invalido';
      case 'emailExiste':
        return 'Email ya registrado';
      case 'celularExiste':
        return 'Celular ya registrado';
      case 'minlength':
        return 'Mínimo 8 caracteres';
      case 'maxlength':
        return 'Máximo 15 caracteres';
      case 'pattern':
        return 'Debe contener al menos una letra y un número';
      case 'passwordsDiferentes':
        return 'Las contraseñas no coinciden';
      default:
        return 'Error';
    }

  }

}
