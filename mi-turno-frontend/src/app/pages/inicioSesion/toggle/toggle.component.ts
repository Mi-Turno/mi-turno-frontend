import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputComponent } from '../../../shared/components/input/input.component';
import { MatIconModule } from '@angular/material/icon';
import { ClienteInterface } from '../../../core/interfaces/cliente-interface';
import { HttpErrorResponse } from '@angular/common/http';
import { codigoErrorHttp } from '../../../shared/models/httpError.constants';
import { Router } from '@angular/router';
import { ClienteService } from '../../../core/services/clienteService/cliente.service';
import { ROLES } from '../../../shared/models/rolesUsuario.constants';
import { ICONOS } from '../../../shared/models/iconos.constants';
import { PLACEHOLDERS } from '../../../shared/models/placeholderInicioSesion.constants';
import { AuthService } from '../../../auth/service/auth.service';
import { UsuarioInterface } from '../../../core/interfaces/usuario-interface';
import { UsuarioService } from '../../../core/services/usuarioService/usuario.service';

@Component({
  selector: 'app-toggle',
  standalone: true,
  imports: [ReactiveFormsModule, InputComponent, MatIconModule],
  templateUrl: './toggle.component.html',
  styleUrl: './toggle.component.css'
})
export class ToggleComponent {
  loginHref: string = "login";
  claseAppInput: string = "claseAppInput";
  inputContainer: string = "inputContainer";
  iconos = ICONOS;
  clienteService = inject(ClienteService);
  roles = ROLES;
  fb:FormBuilder = inject(FormBuilder)

  placeholders = PLACEHOLDERS;
  //form reactivo
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


  //metodo para crear un usuario
   crearClienteDesdeFormulario():ClienteInterface {
    const nombreForm = this.formularioRegister.get('nombre')?.value ||'';//||'' esto significa que puede ser null
    const apellidoForm = this.formularioRegister.get('apellido')?.value||'';
    const emailForm = this.formularioRegister.get('emailRegister')?.value||'';
    const fechaNacimientoForm = this.formularioRegister.get('fechaNacimiento')?.value||'';
    const telefonoForm = this.formularioRegister.get('telefono')?.value||'';
    const passwordForm = this.formularioRegister.get('passwordRegister')?.value||'';

    return {
      nombre:nombreForm,
      apellido:apellidoForm,
      email:emailForm,
      fechaNacimiento:fechaNacimientoForm,
      telefono:telefonoForm,
      password:passwordForm,
      idRolUsuario: 2,
      estado:true
    };

  }
  //metodo POST
  router: Router = inject(Router);
  exito:boolean = false;

  private postClienteToBackend(cliente:ClienteInterface):void{
    try {
      this.clienteService.postCliente(cliente).subscribe({
        next:(cliente:ClienteInterface) =>{
          this.exito = true;

          /*setTimeout(() => {
            this.router.navigateByUrl('/login');
          }, 2000);*/



        },
        error: (error:HttpErrorResponse) =>{
          if (error.status === codigoErrorHttp.NO_ENCONTRADO) {
            alert('Error 404: Usuario no encontrado');

          } else if (error.status === codigoErrorHttp.ERROR_SERVIDOR) {
            alert('Error 500: Error del servidor');//Error 500

          } else if (error.status === codigoErrorHttp.ERROR_CONTACTAR_SERVIDOR) {
            alert('Error de conexión: No se pudo contactar con el servidor (ERR_CONNECTION_REFUSED)');
          } else if(error.status === codigoErrorHttp.ERROR_REPETIDO){
            alert('Error 409: el usuario ya existe en el sistema');
          } else {
            alert('Error inesperado. Intente otra vez mas tarde.');
          }
      }
      })
    } catch (error) {
      console.error(error);
    }
  }

  // Método para enviar los valores del formulario al backend
  onRegister() {
    if (this.formularioRegister.valid) {

      console.log('Usuario enviado con exito');

      const cliente:ClienteInterface = this.crearClienteDesdeFormulario();

      this.postClienteToBackend(cliente);


    }
    else {
      let campoError: string = '';
      Object.keys(this.formularioRegister.controls).forEach(campo => {
        const control = this.formularioRegister.get(campo);
        if (control?.invalid) {
          campoError += (`${campo} es inválido, `);
        }
      });
      alert(campoError);
    }
  }

  //-----------------------------------LOGIN-----------------------------------
  registerHref: string = "register";

  usuarioService = inject(UsuarioService);
  //form reactivo
  formularioLogin = new FormGroup({
    emailLogin: new FormControl('', [Validators.required, Validators.email]),
    passwordLogin: new FormControl('', Validators.required)
  });
  //obtengo los datos del formulario reactivo
  private obtenerDatosForm() {
    const emailForm = this.formularioLogin.get('emailLogin')?.value || '';
    const passwordForm = this.formularioLogin.get('passwordLogin')?.value || '';

    return {
      email: emailForm,
      password: passwordForm
    };
  }
  verificarErrorHttp(error: HttpErrorResponse) {
    if (error.status === codigoErrorHttp.NO_ENCONTRADO) {
      alert('Error 404: Usuario no encontrado');

    } else if (error.status === codigoErrorHttp.ERROR_SERVIDOR) {
      alert('Campos invalidos. ¡Si aun no tiene una cuenta creesela aqui abajo!');

    } else if (error.status === codigoErrorHttp.ERROR_CONTACTAR_SERVIDOR) {
      alert('Error de conexión: No se pudo contactar con el servidor (ERR_CONNECTION_REFUSED)');
    } else if (error.status === codigoErrorHttp.ERROR_REPETIDO) {
      alert('Error 409: Usuario ya existe en el sistema');
    } else {
      alert('Error inesperado. Intente otra vez mas tarde.');
    }
  }


  //permito o deniego el acceso a la pagina
  auth:AuthService = inject(AuthService);

  onLogin() {
    if (this.formularioLogin.valid) {

      const objetoDelForm = this.obtenerDatosForm();
      /**PASO 1: CON ESTO VALIDO EL EMAIL Y LA CONTRASEÑA(ES UN POST YA QUE NO PUEDO ENVIAR CONTRASEÑAS POR EL URI) */
      this.usuarioService.getUsuarioByEmailAndPassword(objetoDelForm.email, objetoDelForm.password).subscribe({
        next: (usuarioResponse: UsuarioInterface) => {

          this.auth.logIn(usuarioResponse.idUsuario!.toString(),usuarioResponse.idRolUsuario!.toString());
          if (usuarioResponse.idRolUsuario == 2 || usuarioResponse.idRolUsuario == ROLES.cliente || usuarioResponse.idRolUsuario == 3|| usuarioResponse.idRolUsuario == ROLES.profesional) {
            this.router.navigateByUrl('/dashboard-cliente');
            //lo mando al DASHBOARD DE CLIENTE
          } else if (usuarioResponse.idRolUsuario === 4||usuarioResponse.idRolUsuario === ROLES.negocio) {
            //lo mando al DASHBOARD DE LOCAL
            this.router.navigateByUrl(`/negocios/${usuarioResponse.nombre}`);//es el nombre del negocio
          } else if (usuarioResponse.idRolUsuario === 1 || usuarioResponse.idRolUsuario === ROLES.admin) {
            //lo mando al DASHBOARD DE ADMIN
            this.router.navigateByUrl(`/admin/${usuarioResponse.idUsuario}`);
          } else {
            console.log('ROL INEXISTENTE');
          }
        },
        error: (error: HttpErrorResponse) => {
          this.verificarErrorHttp(error);
        }

      })
    } else {
      let campoError: string = '';
      Object.keys(this.formularioLogin.controls).forEach(campo => {
        const control = this.formularioLogin.get(campo);
        if (control?.invalid) {
          campoError += (`${campo} es inválido, `);
        }
      });
      alert(campoError);
    }
  }


  //-----------------------------------TOGGLE-----------------------------------
  isLogin: boolean = true;


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

}
