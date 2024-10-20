import { Component } from '@angular/core';

@Component({
  selector: 'app-carousel',
  standalone: true,
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css']
})
export class CarouselComponent {
  private IMAGENES: string[] = [
    'background1.jpeg',
    'background2.jpeg',
    'heroMiTurno.jpeg'
  ];
  private TIEMPO_INTERVALO_MILESIMAS_SEG: number = 1000;
  private posicionActual: number = 0;
  public intervalo: any;

  // Control de botones
  public botonAvanzarDisabled: boolean = false;
  public botonRetrocederDisabled: boolean = false;
  public botonPlayDisabled: boolean = false;
  public botonStopDisabled: boolean = true;

  constructor() {
    // Iniciar la primera imagen
      setTimeout(() => {//esto es para que espere que se cargue una imagen, si no se pone en blanco y no inicia
        this.renderizarImagen();
      }, 0);

  }
  /** Función que cambia la foto a la siguiente posición*/
  pasarFoto(): void {
    this.posicionActual = (this.posicionActual >= this.IMAGENES.length - 1) ? 0 : this.posicionActual + 1;
    this.renderizarImagen();
  }

  /* Función que cambia la foto a la anterior posición*/
  retrocederFoto(): void {
    this.posicionActual = (this.posicionActual <= 0) ? this.IMAGENES.length - 1 : this.posicionActual - 1;
    this.renderizarImagen();
  }

  /* Función que actualiza la imagen de fondo dependiendo de posicionActual*/
  renderizarImagen(): void {
    const imagenElemento = document.querySelector('#imagen') as HTMLElement;
    if (imagenElemento) {
      imagenElemento.style.backgroundImage = `url(${this.IMAGENES[this.posicionActual]})`;
    }


  }

  /** Activa el autoplay de la imagen*/
  playIntervalo(): void {
    this.intervalo = setInterval(() => this.pasarFoto(), this.TIEMPO_INTERVALO_MILESIMAS_SEG);
    // Desactivo los botones de control
    this.botonAvanzarDisabled = true;
    this.botonRetrocederDisabled = true;
    this.botonPlayDisabled = true;
    this.botonStopDisabled = false;
  }

  /**Para el autoplay de la imagen*/
  stopIntervalo(): void {
    clearInterval(this.intervalo);
    // Activo los botones de control
    this.botonAvanzarDisabled = false;
    this.botonRetrocederDisabled = false;
    this.botonPlayDisabled = false;
    this.botonStopDisabled = true;
  }


}
