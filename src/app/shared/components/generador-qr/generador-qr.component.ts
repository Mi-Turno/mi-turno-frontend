import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import * as QRCode from 'qrcode';
import { BotonComponent } from "../boton/boton.component";

@Component({
  selector: 'app-generador-qr',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './generador-qr.component.html',
  styleUrl: './generador-qr.component.css'
})
export class GeneradorQRComponent {
  @Input() url!: string;  // El nombre del negocio
  codigoQR: string = '';

  ngOnInit() {

    this.generateQR();

  }

  async generateQR() {
    try {
      this.codigoQR = await QRCode.toDataURL(this.url);  // Generamos el QR con la URL dinámica
    } catch (error) {
      console.error('Error al generar el QR:', error);
    }
  }
}
