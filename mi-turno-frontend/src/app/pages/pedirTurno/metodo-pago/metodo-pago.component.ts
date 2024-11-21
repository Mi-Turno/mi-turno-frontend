import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { MetodosDePagoServiceService } from '../../../core/services/metodosDePago/metodos-de-pago-service.service';
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
  metodosDePagoServicio: MetodosDePagoServiceService = inject(MetodosDePagoServiceService);

  textoBoton = "Seleccionar";
  textoTitulo = "Metodo de pago";
  referenciaChip:string = '';
  metodosDePago:string[] = [];


  @Output() emitirInformacion = new EventEmitter<number>();
  enviarIdMetodoDePago(metodoDePagoId: number) {
    this.emitirInformacion.emit(metodoDePagoId);
  }


  ngOnInit(){
    this.cargarMetodosDePago();

  }



  cargarMetodosDePago() {
    this.metodosDePagoServicio.getMetodosDePago().subscribe({
      next: (response) => {

        this.metodosDePago = response;

      },
      error: (error) => {
        console.error('Error al obtener servicios:', error);
      }
    });

  }

  mostrarMetodoDePagoSinGuiones(metodoDePago:string):string{

    return metodoDePago.replaceAll('_',' ');

  }

  getRutaImagen(metodoDePago: string): string {
    switch (metodoDePago) {
      case 'EFECTIVO':
        return 'efectivo.png';
      case 'MERCADO_PAGO':
        return 'mercado-pago.png';
      case 'TARJETA_CREDITO':
        return 'tarjeta.png';
      case 'TARJETA_DEBITO':
        return 'tarjeta.png';
      case 'TRANSFERENCIA':
        return 'transferencia.png';
      default:
        return 'img-default.png'; // Imagen por defecto
    }
  }
}
