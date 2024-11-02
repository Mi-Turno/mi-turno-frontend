import { Component, inject, OnInit } from '@angular/core';
import { MetodosDePagoServiceService } from '../../../core/services/metodosDePago/metodos-de-pago-service.service';
import { MetodosDePagoInterface } from '../../../core/interfaces/metodos-de-pagos-interface';
import { CommonModule } from '@angular/common';
import { CardComponent } from "../../../shared/components/card/card.component";

@Component({
  selector: 'app-metodo-pago',
  standalone: true,
  imports: [CommonModule, CardComponent],
  templateUrl: './metodo-pago.component.html',
  styleUrl: './metodo-pago.component.css'
})
export class MetodoPagoComponent implements OnInit {
  metodosDePago: MetodosDePagoServiceService = inject(MetodosDePagoServiceService);

  textoBoton = "Seleccionar";
  rutaImg = "img-default.png";
  textoAlternativo = "Img del metodo de pago";
  textoTitulo = "Metodo de pago";
  idCards: MetodosDePagoInterface[] = [];
  maxCards = 6;
  cardSeleccionada: MetodosDePagoInterface | null = null;

  ngOnInit(){
    this.cargarMetodosDePago();
    console.log("hola");
  }
  cargarMetodosDePago() {
    this.metodosDePago.getMetodosDePago().subscribe({
      next: (response) => {
        console.log(response);
        this.idCards = [...response];

      },
      error: (error) => {
        console.error('Error al obtener servicios:', error);
      }
    });

  }
}
