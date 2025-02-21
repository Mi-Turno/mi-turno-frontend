import { Component, inject, OnInit, signal } from '@angular/core';
import { ClienteInterface } from '../../../../core/interfaces/cliente-interface';
import { CredencialInterface } from '../../../../core/interfaces/credencial.interface';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../../../core/guards/auth/service/auth.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { ICONOS } from '../../../../shared/models/iconos.constants';
import { ROLES } from '../../../../shared/models/rolesUsuario.constants';
import { PLACEHOLDERS } from '../../../../shared/models/placeholderInicioSesion.constants';
import {
  MatPseudoCheckbox,
  provideNativeDateAdapter,
} from '@angular/material/core';
import { ClienteService } from '../../../../core/services/clienteService/cliente.service';
import { BotonComponent } from '../../../../shared/components/boton/boton.component';
import {
  MatCheckboxChange,
  MatCheckboxModule,
} from '@angular/material/checkbox';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modificar-cliente',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    ReactiveFormsModule,
    MatIconModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatDatepickerModule,
    BotonComponent,
  ],
  templateUrl: './modificar-cliente.component.html',
  styleUrl: './modificar-cliente.component.css',
})
export class ModificarClienteComponent implements OnInit {
  //servicios
  fb: FormBuilder = inject(FormBuilder); //Forms reactives
  auth: AuthService = inject(AuthService); //Para poder loguear al usuario
  clienteService: ClienteService = inject(ClienteService); //Para poder modificar al cliente
  //variables
  iconos = ICONOS;
  roles = ROLES;
  placeholders = PLACEHOLDERS;
  idCliente = 0;
  cliente: ClienteInterface = {} as ClienteInterface;

  //-----------------------------------MODIFICAR-----------------------------------
  formularioRegister: FormGroup = this.fb.nonNullable.group({
    nombre: new FormControl(''),
    apellido: new FormControl(''),
    fechaNacimiento: new FormControl(''),
  });

  obtenerFormRegister(): ClienteInterface {
    const credencial: CredencialInterface = {
      email: this.formularioRegister.get('emailRegister')?.value,
      password: this.formularioRegister.get('passwordRegister')?.value,
      telefono: this.formularioRegister.get('telefono')?.value,
      estado: true,
    };
    return {
      nombre: this.capitalizarString(
        this.formularioRegister.get('nombre')?.value
      ),
      apellido: this.capitalizarString(
        this.formularioRegister.get('apellido')?.value
      ),
      fechaNacimiento: this.formularioRegister.get('fechaNacimiento')?.value,
      credencial: credencial,
      rolUsuario: 'CLIENTE',
    };
  }

  filtrarDatos(cliente: Partial<ClienteInterface>): Partial<ClienteInterface> {
    return {
      ...(cliente.credencial?.email && {
        // Utilizamos spreed operator junto al && para que luego sobreescribimos el email que se encuentra en credencial y no chillen las interfaces por falta de recursos
        credencial: {
          ...cliente.credencial,
          email: cliente.credencial.email,
        },
      }),
      ...(cliente.nombre && {
        nombre: cliente.nombre,
        apellido: cliente.apellido,
        fechaNacimiento: cliente.fechaNacimiento,
      }),
    };
  }

  manejarEventoCheckBoxCorreos(event: MatCheckboxChange) {
    if (event.checked) {
      // Lógica cuando está marcado
      console.log('El usuario quiere recibir correos.');
    } else {
      // Lógica cuando está desmarcado
      console.log('El usuario NO quiere recibir correos.');
    }
  }

  modificarCliente() {
    if (this.formularioRegister.valid) {
      const clienteModificado = this.filtrarDatos(this.obtenerFormRegister());
      this.clienteService
        .patchCliente(clienteModificado, this.auth.getIdUsuario()!)
        .subscribe({
          next: (clienteResponse: ClienteInterface) => {
            Swal.fire({
              title: 'Datos actualizados con exito!',
              icon: 'success',
              confirmButtonText: 'Ok',
            });
          },
          error: (error: any) => {
            throw new Error('Error al modificar el cliente');
          },
        });
    }
  }
  obtenerCliente() {
    this.clienteService.getClienteById(this.auth.getIdUsuario()!).subscribe({
      next: (clienteResponse: ClienteInterface) => {
        this.establecerDatosCliente(clienteResponse);
      },
      error: (error: any) => {
        throw new Error('Error al obtener el cliente');
      },
    });
  }

  ngOnInit(): void {
    this.obtenerCliente();
  }

  establecerDatosCliente(cliente: ClienteInterface) {
    this.formularioRegister.patchValue({
      nombre: this.auth.getNombreUsuario(),
      apellido: cliente.apellido,
      fechaNacimiento: cliente.fechaNacimiento,
    });
  }

  //validaciones campos formularios
  emailExiste: boolean = false;
  telefonoExiste: boolean = false;

  capitalizarString(palabraFormatear: string): string {
    return (
      palabraFormatear.charAt(0).toUpperCase() +
      palabraFormatear.slice(1).toLowerCase()
    ); // 0 es la primera letra de la palabra y el resto es el resto de la palabra
  }
  tieneErrorRegister(control: string, error: string) {
    return (
      this.formularioRegister.controls[control].hasError(error) &&
      this.formularioRegister.controls[control].touched
    );
  }

  mostrarMensajeError(error: string) {
    switch (error) {
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
      default:
        return 'Error';
    }
  }
}
