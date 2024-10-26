import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { BotonComponent } from '../../../../shared/components/boton/boton.component';
import { InputComponent } from '../../../../shared/components/input/input.component';
import { MatIcon } from '@angular/material/icon';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ICONOS } from '../../../../shared/models/iconos.constants';
import { PLACEHOLDERS } from '../../../../shared/models/placeholderInicioSesion.constants';
import { UsuarioInterface } from '../../../../core/interfaces/usuario-interface';
import { ROLES } from '../../../../shared/models/rolesUsuario.constants';
import { UsuarioService } from '../../../../core/services/usuarioService/usuario.service';

@Component({
  selector: 'app-pop-up-crear-profesional',
  standalone: true,
  imports: [CommonModule, BotonComponent, InputComponent, MatIcon, ReactiveFormsModule],
  templateUrl: './pop-up-crear-profesional.component.html',
  styleUrl: './pop-up-crear-profesional.component.css'
})
export class PopUpCrearProfesionalComponent {

  roles = ROLES;
icono = ICONOS;
placeholder = PLACEHOLDERS;
tipoPopUp = 'profesionales'
usuarioService = inject(UsuarioService);

@Input() fotoProfesional = "img-default.png"


formularioRegister = new FormGroup ({
  nombre: new FormControl('', Validators.required),
  apellido: new FormControl('', Validators.required),
  email: new FormControl('', [Validators.required, Validators.email]),
  fechaNacimiento: new FormControl('',Validators.required),
  telefono: new FormControl('', Validators.required),
});



crearUnProfesional():UsuarioInterface {
  const nombreForm = this.formularioRegister.get('nombre')?.value ||'';//||'' esto significa que puede ser null
  const apellidoForm = this.formularioRegister.get('apellido')?.value||'';
  const emailForm = this.formularioRegister.get('email')?.value||'';
  const fechaNacimientoForm = this.formularioRegister.get('fechaNacimiento')?.value||'';
  const telefonoForm = this.formularioRegister.get('telefono')?.value||'';
  const password = "Programador";
  const rol = this.roles.profesional;
  return {
    nombre:nombreForm,
    apellido:apellidoForm,
    email:emailForm,
    fechaNacimiento:fechaNacimientoForm,
    telefono:telefonoForm,
    password:password,
    rol:rol
  };
}

private postUsuarioToBackend(usuario:UsuarioInterface):void{
  try {
    this.usuarioService.postUsuario(usuario).subscribe({
      next:(usuario:UsuarioInterface) =>{

        console.log(usuario);
      },
      error:(error)=>{
        console.error(error);
      }
    })
  } catch (error) {
    console.error(error);
  }
}

onSubmit() {
console.log(this.formularioRegister.value);

  if (this.formularioRegister.valid) {
    console.log('Usuario enviado con exito');
    console.log(this.formularioRegister.value);
    const usuario:UsuarioInterface = this.crearUnProfesional();
    console.log(usuario);
    this.postUsuarioToBackend(usuario);
  } else {
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





@Output() desactivarOverlay: EventEmitter<void> = new EventEmitter<void>();

cerrarPopUp() {
  this.desactivarOverlay.emit();
}

abrirServicios() {
  console.log("Abro servicios que ofrece");
}
abrirDiasYHorarios() {
  console.log("Abro días y horarios");
}

crearProfesional() {
  console.log("Cree un profesional");
}

eliminarProfesional() {
  console.log("Elimine el profesional");
}


}