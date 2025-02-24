import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import * as QRCode from 'qrcode';
import { BotonComponent } from "../boton/boton.component";

@Component({
  selector: 'app-generador-qr',
  standalone: true,
  imports: [CommonModule, BotonComponent],
  templateUrl: './generador-qr.component.html',
  styleUrl: './generador-qr.component.css'
})
export class GeneradorQRComponent {
  @Input() url!: string;  // El nombre del negocio
  codigoQR: string = '';

  ngOnInit() {

    this.generateQR();

  }
  // Descargar el QR generado
  descargarQR() {
    const a = document.createElement('a'); // Creamos un elemento <a> para poder descargar el QR
    a.href = this.codigoQR;
    a.download = 'qr-codigo.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
  async generateQR() {
    try {
      this.codigoQR = await QRCode.toDataURL(this.url);  // Generamos el QR con la URL dinámica
    } catch (error) {
      console.error('Error al generar el QR:', error);
    }
  }
}
