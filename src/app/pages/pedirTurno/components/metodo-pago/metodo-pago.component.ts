import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MetodosDePagoServiceService } from '../../../../core/services/metodosDePago/metodos-de-pago-service.service';
import { CardComponent } from '../../../../shared/components/card/card.component';
import { MetodosDePago, obtenerIdDePagoPorNombre } from '../../../../shared/models/metodosDePago';
import { NegocioServiceService } from '../../../../core/services/negocioService/negocio-service.service';



@Component({
  selector: 'app-metodo-pago',
  standalone: true,
  imports: [CommonModule, CardComponent],
  templateUrl: './metodo-pago.component.html',
  styleUrl: './metodo-pago.component.css'
})
export class MetodoPagoComponent implements OnInit {
  metodosDePagoServicio: MetodosDePagoServiceService = inject(MetodosDePagoServiceService);
  negocioService: NegocioServiceService = inject(NegocioServiceService);
  textoBoton = "Seleccionar";
  textoTitulo = "Metodo de pago";
  referenciaChip:string = '';
  metodosDePago:string[] = [];
  @Input() idNegocio = 0;
  @Output() emitirInformacion = new EventEmitter<number>();

  enviarIdMetodoDePago(metodoDePagoId: number) {

    const metodoSeleccionado = this.metodosDePago[metodoDePagoId];
    const idRealMetodoPago = obtenerIdDePagoPorNombre(metodoSeleccionado);
    this.emitirInformacion.emit(idRealMetodoPago);
  }


  ngOnInit(){
    this.cargarMetodosDePago();

  }



  cargarMetodosDePago() {
    this.negocioService.getMetodosDePagoPorNegocioId(this.idNegocio).subscribe({
      next: (response) => {
        this.metodosDePago = response;
      }
    });
    /*this.metodosDePagoServicio.getMetodosDePago().subscribe({
      next: (response) => {

        this.metodosDePago = response;

      },
      error: (error) => {
        console.error('Error al obtener servicios:', error);
      }
    });*/

  }

  mostrarMetodoDePagoSinGuiones(metodoDePago:string):string{

    return metodoDePago.replaceAll('_',' ');

  }

  getRutaImagen(metodoDePago: string): string {
    switch (metodoDePago) {
      case MetodosDePago.efectivo:
        return 'efectivo.png';
      case MetodosDePago.mercadoPago:
        return 'mercado-pago.png';
      case MetodosDePago.credito:
        return 'tarjeta.png';
      case MetodosDePago.debito:
        return 'tarjeta.png';
      case MetodosDePago.transferencia:
        return 'transferencia.png';
      default:
        return 'img-default.png'; // Imagen por defecto
    }
  }
}
