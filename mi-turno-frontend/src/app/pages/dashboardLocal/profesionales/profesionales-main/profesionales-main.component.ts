import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { CardComponent } from '../../../../shared/components/card/card.component';
import { PopUpCrearProfesionalComponent } from '../pop-up-crear-profesional/pop-up-crear-profesional.component';
import { UsuarioInterface } from '../../../../core/interfaces/usuario-interface';
import { UsuarioService } from '../../../../core/services/usuarioService/usuario.service';
import { ROLES } from '../../../../shared/models/rolesUsuario.constants';
import { PopUpHorariosProfesionalesComponent } from "../pop-up-horarios-profesionales/pop-up-horarios-profesionales.component";

@Component({
  selector: 'app-profesionales-main',
  standalone: true,
  imports: [CommonModule, CardComponent, PopUpCrearProfesionalComponent, PopUpHorariosProfesionalesComponent],
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

rutaBotonChip = "#"
estaSobrepuesto: boolean = false;
verHorarios: boolean = false;
textoTituloPop = "";
cardSeleccionada: UsuarioInterface | null = null;

//Hacemos que cambiar sobreposición reciba lo que quiere hacer y la card, en caso de que sea modificar
cambiarSobreposicion(titulo:string, card:UsuarioInterface | null) {
  this.estaSobrepuesto = !this.estaSobrepuesto;
  this.textoTituloPop = titulo;
  this.cardSeleccionada = card;
  console.log(this.cardSeleccionada);
}


//! aca hay logica de cambiar a el nuevo popUp
cambiar_SobreposicionHorarios(card: UsuarioInterface | null) {
  this.verHorarios = !this.verHorarios;
  this.cardSeleccionada =card;
  this.imprimirCardActual(this.cardSeleccionada);
}

usuarios: UsuarioService = inject(UsuarioService)

ngOnInit() {
  this.cargarUsuarios();
}
cargarUsuarios() {
  this.usuarios.getUsuarioByRolAndEstado(ROLES.profesional, true).subscribe({    next: (response) => {
      this.idCards = response.slice(0, this.maxCards);
    },
    error: (error) => {
      console.error('Error al obtener usuarios:', error);
    }
  });
}


imprimirCardActual(card: UsuarioInterface | null) {
  console.log(card);
}

cardActual: UsuarioInterface | null = null;

recibirCardActual(card: UsuarioInterface) {
  this.cardActual = card; // Almacena el valor recibido en cardActual
  console.log('Card recibido desde el hijo:', this.cardActual); // Comprobación
}


}


