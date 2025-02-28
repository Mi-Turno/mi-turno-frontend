import { Component, EventEmitter, inject, Input, OnInit, Output, signal } from '@angular/core';
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
import { InputArchivoComponent } from "../../../../shared/components/input-archivo/input-archivo.component";
import { catchError, Observable, of, switchMap, throwError } from 'rxjs';
import { ArchivosServiceService } from '../../../../core/services/archivosService/archivos-service.service';
import { codigoErrorHttp } from '../../../../shared/models/httpError.constants';
import { HttpErrorResponse } from '@angular/common/http';

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
    InputArchivoComponent
],
  templateUrl: './modificar-cliente.component.html',
  styleUrl: './modificar-cliente.component.css',
})
export class ModificarClienteComponent implements OnInit {

  //servicios
  fb: FormBuilder = inject(FormBuilder); //Forms reactives
  auth: AuthService = inject(AuthService); //Para poder loguear al usuario
  clienteService: ClienteService = inject(ClienteService); //Para poder modificar al cliente
  archivosService: ArchivosServiceService = inject(ArchivosServiceService);

  //variables
  iconos = ICONOS;
  roles = ROLES;
  placeholders = PLACEHOLDERS;
  idCliente = 0;

  //Input output
  @Input() cliente: ClienteInterface = {} as ClienteInterface;
  @Input() fotoCliente?: File | string = "img-default.png";
  @Output() emitirCerrarModal = new EventEmitter<void>();

  //init
  ngOnInit(): void {

    this.establecerDatosCliente(this.cliente);

   this.setFotoCliente();

    this.setIdCliente();
    // this.obtenerCliente();
  }

  setFotoCliente(){

    if(this.cliente.fotoPerfil){
      this.fotoCliente = this.cliente.fotoPerfil;
    }else{
      this.fotoCliente = "img-default.png";
    }
  }

  setIdCliente() {
    let auxId = this.cliente.idUsuario
    if (auxId) {
      this.idCliente = auxId;
    }

  }



  // obtenerCliente() {
  //   this.clienteService.getClienteById(this.idCliente).subscribe({
  //     next: (clienteResponse: ClienteInterface) => {

  //       this.cliente = clienteResponse;


  //     },
  //     error: (error: any) => {
  //       throw new Error('Error al obtener el cliente');
  //     },
  //   });
  // }


  cerrarPopUp() {
    this.emitirCerrarModal.emit();
  }

  //-----------------------------------MODIFICAR-----------------------------------

  manejarEventoCheckBoxCorreos(event: MatCheckboxChange) {
    if (event.checked) {
      // Lógica cuando está marcado
      console.log('El usuario quiere recibir correos.');
    } else {
      // Lógica cuando está desmarcado
      console.log('El usuario NO quiere recibir correos.');
    }
  }

  //--------------------Servicio cliente--------------------
  botonConfirmarActualizar() {
    if (this.formularioUpdate.valid) {
      let clienteObservable: Observable<ClienteInterface> = this.actualizarClienteBackend();

      clienteObservable.pipe(
            switchMap((response: ClienteInterface) => {
              Swal.fire({
                title: 'Datos actualizados con exito!',
                icon: 'success',
                confirmButtonText: 'Ok',
              });

              if (response.idUsuario) {
                return this.verificarFotoPerfil(response.idUsuario); // Retorna un Observable para encadenarlo
              }
              return of(null); // Si no hay idUsuario, se retorna un Observable vacío
            })
          ).subscribe({
            next: () => {


              this.cerrarPopUp();

              setTimeout(() => {
                window.location.reload()

              }, 1000)
            },
            error: (error) => {
             console.error("Error en el proceso de guardar al cliente:", error);
            }
          });


    }else{
      this.formularioUpdate.markAllAsTouched();
    }
  }


  actualizarClienteBackend(): Observable<ClienteInterface>{
    const clienteModificado = this.obtenerFormUpdate()
    return this.clienteService.patchCliente(clienteModificado, this.idCliente)
    .pipe(catchError((error) => this.manejarErrores(error)));
  }


  //--------------------Actualizar cliente--------------------

    formularioUpdate: FormGroup = this.fb.nonNullable.group({
      nombre: new FormControl(''),
      apellido: new FormControl(''),
      fechaNacimiento: new FormControl(''),
      fotoPerfil: new FormControl()
    });

  obtenerFormUpdate(): ClienteInterface {

    // const credencial: CredencialInterface = {
    //   email: this.formularioUpdate.get('emailRegister')?.value,
    //   password: this.formularioUpdate.get('passwordRegister')?.value,
    //   telefono: this.formularioUpdate.get('telefono')?.value,
    //   estado: true
    // };

    return {
      nombre: this.capitalizarString(
        this.formularioUpdate.get('nombre')?.value
      ),
      apellido: this.capitalizarString(
        this.formularioUpdate.get('apellido')?.value
      ),
      fechaNacimiento: this.formularioUpdate.get('fechaNacimiento')?.value,
      credencial: this.cliente.credencial,
      rolUsuario: 'CLIENTE',
    };
  }

  establecerDatosCliente(cliente: ClienteInterface) {
    this.formularioUpdate.patchValue({
      nombre: cliente.nombre,
      apellido: cliente.apellido,
      fechaNacimiento: cliente.fechaNacimiento,
    });
  }

  //--------------------Validaciones campos formularios--------------------
  emailExiste: boolean = false;
  telefonoExiste: boolean = false;

  capitalizarString(palabraFormatear: string): string {
    return (
      palabraFormatear.charAt(0).toUpperCase() +
      palabraFormatear.slice(1).toLowerCase()
    ); // Capitalizamos la primera letra y el resto la pasamos a minúsculas
  }


  //--------------------Archivos--------------------
  archivoSeleccionado:File | null = null;
  quiereEliminarArchivo:boolean = false

  verificarFotoPerfil(idUsuario: number | null): Observable<Boolean | null>{
    //verifico si existe el id
    if(idUsuario){
      //verifico si se selecciono un archivo
      if(this.archivoSeleccionado){
        return this.postArchivoToBackend(idUsuario, this.archivoSeleccionado);
      }
      else if(this.quiereEliminarArchivo && this.fotoCliente){
        return this.eliminarArchivoBackend(idUsuario);
      }
    }
    return of(null)
  }


  postArchivoToBackend(idProfesional:number, archivoNuevo:File): Observable<Boolean>{

    return this.archivosService.postArchivoUsuario(idProfesional,archivoNuevo,)
    .pipe(catchError((error) => this.manejarErrores(error)));
  }



  seleccionarArchivo(archivoNuevo:File): void{

    if(archivoNuevo.size > 0  && archivoNuevo != null){

      this.archivoSeleccionado = archivoNuevo;
      this.quiereEliminarArchivo = false;
      this.formularioUpdate.patchValue({
        fotoPerfil:this.archivoSeleccionado
      })

      this.fotoCliente = URL.createObjectURL(this.archivoSeleccionado);

    }

  }

  private eliminarArchivoBackend(idProfesional:number):Observable<Boolean>{
    return this.archivosService.eliminarArchivoUsuario(idProfesional)
    .pipe(catchError((error) => this.manejarErrores(error)));
  }


  eliminarArchivo(event:Event):void{

    this.fotoCliente = "img-default.png";
    this.quiereEliminarArchivo = true;
    this.archivoSeleccionado = null;
    this.formularioUpdate.patchValue({
      fotoPerfil:null
    })
  }

  //--------------------Manejo de errores--------------------

  tieneErrorRegister(control: string, error: string) {
    return (
      this.formularioUpdate.controls[control].hasError(error) &&
      this.formularioUpdate.controls[control].touched
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

  private manejarErrores(error: HttpErrorResponse) {
    console.log(error.status);
    switch (error.status) {
      case codigoErrorHttp.ERROR_SERVIDOR:
        alert('Error 500: Error del servidor');
        break;
      case 0:
        alert('Error de conexión: No se pudo contactar con el servidor (ERR_CONNECTION_REFUSED)');
      break;
      case codigoErrorHttp.ERROR_REPETIDO:
        const mensaje = error.error['mensaje'];
        if (mensaje.includes("email")) {
          this.formularioUpdate.get('email')?.setErrors({ emailExiste: true });
        } else if (mensaje.includes("telefono")) {
          this.formularioUpdate.get('telefono')?.setErrors({ telefonoExiste: true });
        }
      break;
      case codigoErrorHttp.NO_ENCONTRADO:
        console.log("Not found");
      break;
      default:
        alert('Error inesperado. Intente más tarde.');
      break;

    }

    return throwError(() => error);

  }

}
