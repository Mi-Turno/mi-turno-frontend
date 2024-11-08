import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { CardComponent } from '../../../../shared/components/card/card.component';
import { PopUpCrearProfesionalComponent } from '../pop-up-crear-profesional/pop-up-crear-profesional.component';
import { UsuarioInterface } from '../../../../core/interfaces/usuario-interface';
import { UsuarioService } from '../../../../core/services/usuarioService/usuario.service';
import { ROLES } from '../../../../shared/models/rolesUsuario.constants';
import { PopUpHorariosProfesionalesComponent } from "../pop-up-horarios-profesionales/pop-up-horarios-profesionales.component";
import { ProfesionalesServiceService } from '../../../../core/services/profesionalService/profesionales-service.service';
import { NegocioServiceService } from '../../../../core/services/negocioService/negocio-service.service';
import { ActivatedRoute } from '@angular/router';

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

profesionales: ProfesionalesServiceService = inject(ProfesionalesServiceService)

constructor(private ruta: ActivatedRoute) { }
ngOnInit() {
  this.cargarUsuarios();

}
servicioNegocio:NegocioServiceService = inject(NegocioServiceService);
idNegocio:number = 0;
cargarUsuarios() {

  this.ruta.parent?.params.subscribe(params => {
    const nombreNegocio = params['nombreNegocio'];
    console.log(nombreNegocio);

      this.servicioNegocio.getIdNegocioByNombre("Juan").subscribe(
        {
          next: (idNegocio) => {
            this.idNegocio = idNegocio;

            //obtengo el arreglo de profesionales del negocio y lo guardo en la variable profesionales
            this.profesionales.getProfesionalesPorIdNegocio(this.idNegocio).subscribe({//todo cambiar el 1 por el idNegocio y hacer metodo personalizado por estado
              next: (profesionales) => {
                this.idCards = [...profesionales];
              },error: (error) => {
                console.log(error);
              }
            });


          },
          error: (error) => {
            this.idNegocio = -1;
            console.error('Error al obtener el ID del negocio', error);
          }
        }
      );



});




  /*this.profesionales.getProfesionalesPorIdNegocio(1).subscribe({
        next: (response) => {
      this.idCards = response.slice(0, this.maxCards);
     // console.log(this.idCards[0].rolEntidad);
    },
    error: (error) => {
      console.error('Error al obtener usuarios:', error);
    }
  });*/
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


