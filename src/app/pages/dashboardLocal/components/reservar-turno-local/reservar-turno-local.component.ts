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
    MatNativeDateModule
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
profesionales: ProfesionalInterface[] | undefined = undefined;
servicios: ServicioInterface[] | undefined = undefined;
metodosDePago?: MetodosDePago[] | undefined = undefined;
horariosProfesional: HorarioProfesional[] | undefined = undefined;
turnosNegocio: TurnoInterface[] | undefined = undefined;



//Variables del cliente invitado
idClienteInvitado :number = 0 ;
mailClienteInvitado: string = "";

//Variables para deshabilitar los inputs
datosClienteCompletos = true;
fechaSeleccionada = true;
servicioSeleccionado = true;
profesionalSeleccionado = true;
metodoPagoSeleccionado = true;

  //Servicios
  fb: FormBuilder = inject(FormBuilder); //Forms reactives
  route: ActivatedRoute = inject(ActivatedRoute);
  negocioService: NegocioServiceService = inject(NegocioServiceService);
  profesionalService: ProfesionalesServiceService = inject(ProfesionalesServiceService);
  servicioService: ServicioServiceService = inject(ServicioServiceService);
  usuarioService: UsuarioService = inject(UsuarioService);
  horarioService: HorarioXprofesionalService = inject(HorarioXprofesionalService);
  turnoService: TurnoService = inject (TurnoService);


//On init

ngOnInit(): void {
  this.route.parent?.paramMap.subscribe(params => {
    this.nombreNegocio = params.get('nombreNegocio');
  });

  this.ObtenerNegocioPorNombre();
  this.manejadorHabilitacionCampos();
}


// Fuciones para obtener todos los datos relacionadaos al negocio

ObtenerNegocioPorNombre() {
  this.negocioService.getIdNegocioByNombre(this.nombreNegocio!).subscribe({
    next: (response: number) => {
      this.negocioService.getNegocioById(response).subscribe({
        next: (negocio: NegocioInterface) => {
          this.negocio = negocio; // Ahora el negocio tiene datos
          this.idNegocio = negocio.idUsuario!;

          this.actualizarValores(); // Llamamos a actualizar los valores aquí
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

ObtenerMetodosPagoNegocio(){
this.metodosDePago =  [MetodosDePago.debito, MetodosDePago.efectivo, MetodosDePago.mercadoPago, MetodosDePago.transferencia]
}

ObtenerHorarioProfesional(){
  this.horarioService.getHorariosPorIdProfesionalYDia(this.idNegocio, this.idProfesional, this.idDiaSeleccionado).subscribe({
    next:(response) => {
      this.horariosProfesional = [...response];
    }, error:(err)=> {
      console.error("Error al obtener los porfesionales del negocio" + err);
    }
  })
}


ObtenerTurnosNegocio(){
  this.turnoService.getTurnos(this.idNegocio).subscribe({
    next:(response) => {
      response.forEach(turno => {
          if(turno.estado !== estadoTurno.RESERVADO){
            this.turnosNegocio?.push(turno);
          }
      });
        console.log(this.turnosNegocio);

    }, error:(err) =>{
      console.error("Error"+ err );
    }
  })
}


//Aca hay que usar la fecha que se eligío y fijarse de que id le corresponde al día
ObtenerIdDia(fecha: Date){
  return fecha.getDay();
}

actualizarValores() {
  //Va  a hacer las peticiones para actualizar los select
 // this.ObtenerServiciosNegocio();
  //this.ObtenerProfesionalesConServicioDeNegocio();
  //this.ObtenerMetodosPagoNegocio();
}

  //Formulario
formularioTurno: FormGroup = new FormGroup({
  nombre: new FormControl('', Validators.required),
  email: new FormControl('', [Validators.required, Validators.email]),
  servicio: new FormControl({value: '', disabled: this.datosClienteCompletos}, Validators.required),
  profesional: new FormControl({value: '', disabled: this.servicioSeleccionado}, Validators.required),
  metodoPago: new FormControl({value: '', disabled: this.profesionalSeleccionado}, Validators.required),
  fechaTurno : new FormControl({value: '', disabled: this.metodoPagoSeleccionado}, Validators.required),
  horaTurno: new FormControl({value: '', disabled: this.fechaSeleccionada}, Validators.required)
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
console.log(valor);
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
      this.idDiaSeleccionado = this.ObtenerIdDia(valor as Date);
      this.ObtenerHorarioProfesional()
      this.ObtenerTurnosNegocio();
      break;
      case "horaTurno":
      this.idHorario = valor.horario;
      break;
  }

}





crearClienteInvitado(nombre: string, email:string | null){

  let credencialAux: CredencialInterface | null = null;

  if(!email || email.trim() === "" ){
    credencialAux = {email: this.generarMailInvitado(),
                                estado: true,
                                password: "Usar generador de contraseña" ,
                                telefono: null}
  } else{
    credencialAux= { email : email,
                                estado: true,
                                password: "Usar generador de contraseña",
                                telefono: null }
  }

  const usuarioAuxiliar: UsuarioInterface = {nombre: nombre, apellido: " -", fechaNacimiento:  new Date().toISOString().slice(0, 10), rolUsuario: ROLES.cliente, credencial: credencialAux}
  this.usuarioService.postUsuario(usuarioAuxiliar);

}

generarMailInvitado() {

  //Hacer petición para obtener el mail invitado con mayor numero que haya
  //Cuando lo obtengo, le sumo 1 al final para crear un mail único
  //Lo almaceno en la variable emailInvitado: string
  return " invitado365271@flf.com ";
}

ObtenerClienteInvitado(email: string){

  //Hacer petición para obtener el cliente que coincide con ese MAIL
  //Cuando lo traigo almaceno el id en la varaible de idClienteInvitado
  this.idClienteInvitado = 10;
}


crearTurno():TurnoInterface {

  this.crearClienteInvitado(this.formularioTurno.get('nombre')?.value, this.formularioTurno.get('email')?.value ||  '' );
  this.ObtenerClienteInvitado(this.mailClienteInvitado);

  return {
    idCliente: this.idClienteInvitado,
    idServicio:this.formularioTurno.get('servicio')?.value||'',
    idNegocio:this.idNegocio,
    fechaInicio:this.formularioTurno.get('fechaTurno')?.value||'',
    horarioProfesional:this.formularioTurno.get('horaTurno')?.value||'',
    metodosDePagoEnum:this.formularioTurno.get('metodoPago')?.value||'',
  };
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
