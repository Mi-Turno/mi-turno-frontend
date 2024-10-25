import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { CardComponent } from '../../../../shared/components/card/card.component';
import { ServicioServiceService } from '../../../../core/services/servicioService/servicio-service.service';
import { ServicioInterface } from '../../../../core/interfaces/servicio-interface';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-servicio-main',
  standalone: true,
  imports: [CommonModule,CardComponent],
  templateUrl: './servicio-main.component.html',
  styleUrl: './servicio-main.component.css'
})
export class ServicioMainComponent {
  nombre = "Corte";
  duracion = 90;
  textoBoton = "Modificar";
  rutaImg = "img-default.png";
  textoAlternativo = "Img del servicio";

  idCards: number[] = [];
  maxCards = 6;

  rutaBotonChip = ""

  servicioService:ServicioServiceService = inject(ServicioServiceService);
  crearUnServicio():ServicioInterface{
    return {
      nombre:this.nombre,
      precio:100,
      duracion:this.duracion
    }
  }
  agregarCard() {
    console.log(this.idCards);
    if(this.idCards.length < this.maxCards) {
      this.idCards.push(this.idCards.length + 1);

    }
    const servicioNuevo:ServicioInterface = this.crearUnServicio();
    console.log(servicioNuevo);
      this.servicioService.POSTcrearUnServicio(servicioNuevo).subscribe({
        next: (response) =>{
          console.log(response);
        },
        error: (error:HttpErrorResponse) =>{
          console.log(error);
        }
      })
  }

  eliminarCard(idCard: number) {
    this.idCards.splice(this.idCards.lastIndexOf(idCard), 1);
  }
}
