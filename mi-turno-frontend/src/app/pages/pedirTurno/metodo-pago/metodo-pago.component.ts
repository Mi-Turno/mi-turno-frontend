import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
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
  //rutaImg = "img-default.png";
  //textoAlternativo = "Img del metodo de pago";
  textoTitulo = "Metodo de pago";
  referenciaChip:string = '';
  idCards: MetodosDePagoInterface[] = [];


  @Output() metodoDePagoSeleccionado = new EventEmitter<number>();
  onMetodoDePagoSeleccionado(metodoDePagoId: number) {
    this.metodoDePagoSeleccionado.emit(metodoDePagoId);
  }

  ngOnInit(){
    this.cargarMetodosDePago();
    console.log("hola");
  }
  cargarMetodosDePago() {
    this.metodosDePago.getMetodosDePago().subscribe({
      next: (response:string[]) => {

        this.idCards = response.map((metodo): MetodosDePagoInterface => ({
          metodoDePago: metodo.replace("_"," "),
        }));


      },
      error: (error) => {
        console.error('Error al obtener servicios:', error);
      }
    });

  }
  getRutaImagen(metodoDePago: string): string {
    switch (metodoDePago) {
      case 'EFECTIVO':
        return 'efectivo.png';
      case 'MERCADO PAGO':
        return 'mercado-pago.png';
      case 'TARJETA CREDITO':
        return 'tarjeta.png';
      case 'TARJETA DEBITO':
        return 'tarjeta.png';
      case 'TRANSFERENCIA':
        return 'transferencia.png';
      default:
        return 'img-default.png'; // Imagen por defecto
    }
  }
}
