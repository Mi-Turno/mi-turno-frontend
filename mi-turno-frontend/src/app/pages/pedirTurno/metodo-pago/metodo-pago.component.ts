import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { MetodosDePagoServiceService } from '../../../core/services/metodosDePago/metodos-de-pago-service.service';
import { MetodosDePagoInterface } from '../../../core/interfaces/metodos-de-pagos-interface';
import { CommonModule } from '@angular/common';
import { CardComponent } from "../../../shared/components/card/card.component";
import { MetodosDePago } from '../../../shared/models/metodosDePago';

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

  //rutaImg = "img-default.png";
  //textoAlternativo = "Img del metodo de pago";
  // idCards: MetodosDePagoInterface[] = [];
//todo pasar a app metodo de pago
// onMetodoPagoRecibido(metodoId: number) {
//   this.metodoDePagoSeleccionado = metodoId;
//   console.log('Método de pago seleccionado:', metodoId);
//   this.idMetodoPagoToString();
// }


// idMetodoPagoToString(){
//   this.metodosDePagoServicio.getMetodosDePago().subscribe({
//     next:(response)=> {

//       obtengo todos los metodos de pago
//      const  metodosDePago =  response.map((metodo): MetodosDePagoInterface => ({
//         metodoDePago: metodo,
//       }));


//       if ( this.metodoDePagoSeleccionado !== null && this.metodoDePagoSeleccionado >= 0 && this.metodoDePagoSeleccionado < metodosDePago.length) {
//         const nombreMetodoDePago = metodosDePago[this.metodoDePagoSeleccionado].metodoDePago;
//         console.log('Nombre del método de pago seleccionado:', nombreMetodoDePago);
//         this.metodoDePagoString = nombreMetodoDePago;
//       } else {
//         console.error('ID de método de pago no válido.');
//       }


//     },error:(error) =>{

//     }
//   })
// }


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
