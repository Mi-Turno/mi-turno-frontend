import { Component, createEnvironmentInjector, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { ICONOS } from '../../../../shared/models/iconos.constants';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { BotonComponent } from '../../../../shared/components/boton/boton.component';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { CalendarioHorarioProfesionalComponent } from "../../../pedirTurno/components/calendario-horario-profesional/calendario-horario-profesional.component";
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import { ActivatedRoute, Router } from '@angular/router';
import { NegocioServiceService } from '../../../../core/services/negocioService/negocio-service.service';
import { NegocioInterface } from '../../../../core/interfaces/negocio-interface';
import { ProfesionalInterface } from '../../../../core/interfaces/profesional-interface';
import { ServicioInterface } from '../../../../core/interfaces/servicio-interface';
import { MetodosDePago } from '../../../../shared/models/metodosDePago';
import { ProfesionalesServiceService } from '../../../../core/services/profesionalService/profesionales-service.service';
import { ServicioServiceService } from '../../../../core/services/servicioService/servicio-service.service';
import { TurnoInterface } from '../../../../core/interfaces/turno-interface';
import { UsuarioService } from '../../../../core/services/usuarioService/usuario.service';
import { UsuarioInterface } from '../../../../core/interfaces/usuario-interface';
import { ROLES } from '../../../../shared/models/rolesUsuario.constants';
import { CredencialInterface } from '../../../../core/interfaces/credencial.interface';
import { HorarioProfesional } from '../../../../core/interfaces/horarioProfesional.interface';
import { TurnoService } from '../../../../core/services/turnoService/turno.service';
import { HorarioXprofesionalService } from '../../../../core/services/horariosProfesionalService/horarioProfesional.service';
import { DiasEnum, DiasEnumOrdinal, obtenerDiaEnumPorNumero } from '../../../../shared/models/diasEnum';
import { estadoTurno } from '../../../../shared/models/estadoTurnoEnum';
import { forkJoin, of, switchMap } from 'rxjs';
import { ClienteService } from '../../../../core/services/clienteService/cliente.service';
import { ClienteInterface } from '../../../../core/interfaces/cliente-interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reservar-turno-local',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    BotonComponent
],
  templateUrl: './reservar-turno-local.component.html',
  styleUrl: './reservar-turno-local.component.css',
})
export class ReservarTurnoLocalComponent implements OnInit {
  //Constantes
  iconos = ICONOS;

//Variables
nombreNegocio: string | null = "";
negocio: NegocioInterface | null = null

//Variables para generar un turno
idNegocio: number = 0;
idServicio: number = 0;
idProfesional: number = 0;
idMetodoPago: number = 0;
idDiaSeleccionado: number = 0;
idHorario: number = 0;


//Arreglos con los datos que se obtienen
profesionales: ProfesionalInterface[] = []
servicios: ServicioInterface[] = [];
metodosDePago?: MetodosDePago[]  = [];
horariosProfesional: HorarioProfesional[] = [];
horariosProfesionalDisponibles: HorarioProfesional[]  = [];
turnosNegocio: TurnoInterface[] = [];
arregloTurnosDeHoy: TurnoInterface[] = [];
fechaInicio: Date = new Date();

fechaSeleccionadaTurno: String = "";

//Variables del cliente invitado
clienteInvitado: ClienteInterface  | undefined= undefined; 

//Variables para deshabilitar los inputs
datosClienteCompletos = true;
fechaSeleccionada = true;
servicioSeleccionado = true;
profesionalSeleccionado = true;
metodoPagoSeleccionado = true;
botonAgregarTurno = true;


  //Servicios
  route: ActivatedRoute = inject(ActivatedRoute);
  negocioService: NegocioServiceService = inject(NegocioServiceService);
  profesionalService: ProfesionalesServiceService = inject(ProfesionalesServiceService);
  servicioService: ServicioServiceService = inject(ServicioServiceService);
  usuarioService: UsuarioService = inject(UsuarioService);
  horarioService: HorarioXprofesionalService = inject(HorarioXprofesionalService);
  turnoService: TurnoService = inject (TurnoService);
  clienteService: ClienteService = inject(ClienteService);
  horarioProfesionalService: HorarioXprofesionalService = inject(HorarioXprofesionalService);

//Turno 
 turnoCreado: TurnoInterface = {
    idCliente: 0,
    idNegocio: 0,
    horarioProfesional: {
      idHorario: 0,
      idProfesional: 0,
      dia: obtenerDiaEnumPorNumero(0),
      horaInicio: new Date(),
    },
    metodosDePagoEnum: MetodosDePago.credito,
    idServicio: 0,
    fechaInicio: new Date(),
    estado: estadoTurno.RESERVADO
  }



//On init
ngOnInit(): void {
  this.route.parent?.paramMap.subscribe(params => {
    this.nombreNegocio = params.get('nombreNegocio');
  });


  this.ObtenerNegocioPorNombre();
  this.manejadorHabilitacionCampos();
}


// Fuciones para obtener todos los datos 

ObtenerNegocioPorNombre() {
  this.negocioService.getIdNegocioByNombre(this.nombreNegocio!).subscribe({
    next: (response: number) => {
      this.negocioService.getNegocioById(response).subscribe({
        next: (negocio: NegocioInterface) => {
          this.negocio = negocio; // Ahora el negocio tiene datos
          this.idNegocio = negocio.idUsuario!;
        },
        error: (error: Error) => {
          console.error('Error obteniendo el negocio:', error);
        }
      });
    },
    error: (error: Error) => {
      console.error('Error obteniendo ID del negocio:', error);
    }
  });
}

ObtenerServiciosNegocio(){
  this.servicioService.getServiciosPorIdNegocio(this.idNegocio).subscribe({
    next:(response) => {
        this.servicios = [...response];
    }, error: (err) => {
      console.error("Error al obtener los servicios del negocio" + err);
    }
  });
}

ObtenerProfesionalesConServicioDeNegocio() {
  this.servicioService.getListadoDeProfesionalesPorIdServicioYIdNegocio(this.idServicio, this.idNegocio,).subscribe({
    next:(response) => {
      this.profesionales = [...response];
    },error:(err) =>  {
      console.error("Error al obtener los profesionales del negocio" + err);
    }
  })
}


ObtenerHorariosProfesional(){
  this.horarioService.getHorariosPorIdProfesionalYDia(this.idNegocio, this.idProfesional, this.idDiaSeleccionado).subscribe({
    next:(response) => {
      this.horariosProfesional = [...response];
      this.ObtenerHorariosDisponibles();
    }, error: (err) => {
      console.error("Hubo un error" + err);
    }
  })
}

ObtenerMetodosPagoNegocio(){
  this.metodosDePago = this.negocio?.metodosDePago!
  .map(metodo => Object.values(MetodosDePago).find(enumValue => enumValue === metodo))
  .filter((metodo): metodo is MetodosDePago => metodo !== undefined);
}

obtenerHorariosDelDiaConTurnos() {

  //Limpio los arreglos necesarios
  this.horariosProfesionalDisponibles = [];
  this.horariosProfesional = [];
  this.turnosNegocio = [];
  this.arregloTurnosDeHoy = [];

  // Obtenemos los turnos primero
  this.profesionalService.getListadoTurnosPorIdNegocioYIdProfesional(this.idNegocio, this.idProfesional).subscribe({
    next: (turnos) => {
      this.turnosNegocio = turnos;
      this.ObtenerTurnosDeLaFechaProfesional();
    },
    error: (error) => console.error('Error al obtener turnos:', error)
  });
}

ObtenerTurnosDeLaFechaProfesional() {
  this.turnosNegocio!.forEach(turno => {
    if(turno.fechaInicio.toString() === this.fechaSeleccionadaTurno){
      if(turno.estado !== estadoTurno.RESERVADO && turno.estado !== estadoTurno.EN_CURSO)
      this.arregloTurnosDeHoy.push(turno);
    }
  }) 

  this.ObtenerHorariosProfesional();
}

ObtenerHorariosDisponibles(){

  this.horariosProfesionalDisponibles = [];
  //Hago un foreach para recorrer todos los turnos
  this.horariosProfesional.forEach(horario => {
    //Me fijo si hay un turno con el mismo horario
    const tieneTurno = this.arregloTurnosDeHoy.find(turno => turno.horarioProfesional.idHorario === horario.idHorario);
    
    let esHoy = false;
    esHoy = this.fechaSeleccionadaTurno === this.ObtenerFechaActual();

    //Si el horario no tiene turno y la hora es después que la actual 
    if(!tieneTurno ){
      if(!esHoy || horario.horaInicio >= this.ObtenerHoraActual()){
        this.horariosProfesionalDisponibles.push(horario);
      }
    }
  })
}

// Funciones para obtener datos de fechas y horas 

ObtenerIdDia(fecha: Date){
  return fecha.getDay();
}

ObtenerHoraActual(){
  const ahora = new Date();
  const formato = new Intl.DateTimeFormat('es-ES', {
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false
}).format(ahora);

return formato;
}

ObtenerFechaActual(){
  return  new Date().toISOString().split("T")[0];
}

ObtenerFechaMinimaCalendario(){
  const fecha = new Date();
  fecha.setDate(fecha.getDate() + 1);
  return  fecha.toISOString().split("T")[0];

}





//Funciones de Cliente invitado

postClienteInvitado(nombreCliente: string){

  this.clienteService.postClienteInvitado(nombreCliente, this.nombreNegocio!).subscribe({
    next:(response) => {
      this.clienteInvitado = response;
      this.confirmarTurno();
    }, error:(err) => {
      console.error("Error al crear al cliente invitado" + err);
    }
  })
}

crearClienteInvitado(nombre: string) {
  return this.clienteService.postClienteInvitado(nombre, this.nombreNegocio!);

}

confirmarTurno() {
  this.turnoService.postTurno(this.turnoCreado).subscribe({
    next: (respuesta) => {
    },
    error: (error) => {
      console.error(error, "Error al confirmar el turno");
    }
  });

}


reservarTurno(){
  const idHorario = this.turnoCreado.horarioProfesional.idHorario!;
  const idNegocio = this.turnoCreado.idNegocio;
  const idProfesional = this.turnoCreado.horarioProfesional.idProfesional;
  const estado = false;
  this.horarioProfesionalService.patchEstadoHorarioProfesional(idHorario, idNegocio, idProfesional, estado).subscribe({
    next: (respuesta) => {
        this.resetFormulario();
        //modal de negocio registrado correctamente
          Swal.fire({
            title: 'Turno registrado correctamente!',
            icon: 'success',
            confirmButtonText: 'Ok'
            });
    },
    error: (error) => {
      console.error(error);
    }
  });
}


  //Formulario
formularioTurno: FormGroup = new FormGroup({
  nombre: new FormControl('', Validators.required),
  servicio: new FormControl({value: '', disabled: this.datosClienteCompletos}, Validators.required),
  profesional: new FormControl({value: '', disabled: this.servicioSeleccionado}, Validators.required),
  metodoPago: new FormControl({value: '', disabled: this.profesionalSeleccionado}, Validators.required),
  fechaTurno : new FormControl({value: '', disabled: this.metodoPagoSeleccionado}, Validators.required),
  horaTurno: new FormControl({value: '', disabled: this.fechaSeleccionada}, Validators.required),
});


manejadorHabilitacionCampos() : void {
  const campos = ["nombre", "servicio", "profesional", "metodoPago", "fechaTurno", "horaTurno"];

  campos.forEach((campo, indice) => {
    if(indice < campos.length - 1){
      this.formularioTurno.get(campo)?.valueChanges.subscribe(valor => {
        const proximoCampo = campos[indice + 1];
        if(valor && valor.toString().trim() !== ' ') {
          this.formularioTurno.get(proximoCampo)?.enable();
          this.peticionesDatosFormulario(campo, valor);
        }else{
          this.formularioTurno.get(proximoCampo)?.disable();
        }
      })
    }
  })
}

peticionesDatosFormulario(campo: string, valor: any){
  switch(campo){
    case "nombre":
      this.ObtenerServiciosNegocio();
      break;
    case "servicio":
      this.idServicio = (valor as ServicioInterface).idServicio!;
      this.ObtenerProfesionalesConServicioDeNegocio();
      break;
    case "profesional":
      this.idProfesional = (valor as ProfesionalInterface).idUsuario!;
      this.ObtenerMetodosPagoNegocio();
      break;
    case "metodoPago":
      this.idMetodoPago = valor.idMetodoPago;
      break;
      case "fechaTurno":
        this.fechaSeleccionadaTurno = this.ParsearFechaSeleccionadaTurno(valor as Date);
      this.idDiaSeleccionado = this.ObtenerIdDia(valor as Date);
      this.obtenerHorariosDelDiaConTurnos();
      this.botonAgregarTurno = false;
      break;
      case "horaTurno":
      this.idHorario = valor.horario;
      break;
  }
}

ParsearFechaSeleccionadaTurno(fecha: Date){
   return  fecha.toISOString().split("T")[0];
}


crearTurno(): void { 

  const servicio = this.formularioTurno.get('servicio')?.value as ServicioInterface;
  const horarioProfesional = this.formularioTurno.get('horaTurno')?.value as HorarioProfesional;
  this.fechaInicio = this.formularioTurno.get('fechaTurno')?.value as Date;
  const metodoPago = this.formularioTurno.get('metodoPago')?.value as MetodosDePago;

  this.crearClienteInvitado( this.formularioTurno.get('nombre')?.value)
  .pipe(
    switchMap(cliente => {
      this.clienteInvitado = cliente; // Guardamos el cliente recién creado
      this.turnoCreado.idCliente = cliente.idUsuario!;
      this.turnoCreado.idNegocio = this.idNegocio;
      this.turnoCreado.horarioProfesional = horarioProfesional;
      this.turnoCreado.idServicio = servicio.idServicio!;
      this.turnoCreado.fechaInicio = this.fechaInicio;
      this.turnoCreado.metodosDePagoEnum = metodoPago;
      return this.turnoService.postTurno(this.turnoCreado);
    }),
    switchMap(turnoCreado => {
      return of(this.reservarTurno()); 
    })
  ).subscribe({
    next: () => console.log(""),
    error: (error: Error) => console.error("Error en la creación del turno:", error)
  });
}



resetFormulario(): void {
  this.formularioTurno.reset({
    nombre: '',
    servicio: { value: '', disabled: this.datosClienteCompletos },
    profesional: { value: '', disabled: this.servicioSeleccionado },
    metodoPago: { value: '', disabled: this.profesionalSeleccionado },
    fechaTurno: { value: '', disabled: this.metodoPagoSeleccionado },
    horaTurno: { value: '', disabled: this.fechaSeleccionada }
  });

  // Opcional: Marcar el formulario como "pristine" y "untouched" para que no aparezcan errores
  this.formularioTurno.markAsPristine();
  this.formularioTurno.markAsUntouched();
}


  //Manejo de errores

  //validaciones campos formularios
  tieneErrorTurnoNegocio(control: string, error: string) {
    return (
      (this.formularioTurno.get(control) as FormControl).hasError(error) &&
      (this.formularioTurno.get(control) as FormControl).touched
    );
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
        return 'Email o Contraseña incorrectos';
      default:
        return 'Error';
    }
  }
}
