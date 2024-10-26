import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { CardComponent } from '../../../shared/components/card/card.component';
import { PopUpCrearProfesionalComponent } from '../pop-up-crear-profesional/pop-up-crear-profesional.component';
import { UsuarioService } from '../../../core/services/usuarioService/usuario.service';
import { UsuarioInterface } from '../../../core/interfaces/usuario-interface';
import { ROLES } from '../../../shared/models/rolesUsuario.constants';

@Component({
  selector: 'app-profesionales-main',
  standalone: true,
  imports: [CommonModule, CardComponent, PopUpCrearProfesionalComponent],
  templateUrl: './profesionales-main.component.html',
  styleUrl: './profesionales-main.component.css'
})
export class ProfesionalesMainComponent  implements OnInit{



nombre = "Juan"
especialidad = "Barbero"
textoBoton = "Modificar"
rutaImg = "img-default.png"
textoAlternativo = "Img del barbero"

idCards: UsuarioInterface[] = [];
maxCards = 6;

rutaBotonChip = ""

estaSobrepuesto: boolean = false;


abrirPopUp() {
  this.estaSobrepuesto = true;
}

cambiarSobreposicion() {
  this.estaSobrepuesto = !this.estaSobrepuesto;
  console.log(this.estaSobrepuesto);
}

usuarios: UsuarioService = inject(UsuarioService)

ngOnInit() {
  this.cargarUsuarios();
}
cargarUsuarios() {
  this.usuarios.getUsuarioByRol(ROLES.profesional).subscribe({
    next: (response) => {
      this.idCards = response.slice(0, this.maxCards);
    },
    error: (error) => {
      console.error('Error al obtener usuarios:', error);
    }
  });
}

}


