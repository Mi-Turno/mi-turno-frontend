import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FechaYHoraComponent } from "../fecha-y-hora/fecha-y-hora.component";
import { ChipComponent } from "../chip/chip.component";
import { ICONOS } from "../../models/iconos.constants";
import { Router } from "@angular/router";
import { BotonComponent } from "../boton/boton.component";


@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [CommonModule, FechaYHoraComponent, BotonComponent],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent implements OnInit {

icono = ICONOS.eventNote  ;
texto = "Nuevo Turno";
referencia = '#';
fondo = "blue";
currentUrl: string = '';

clase = "botonNavBar";


constructor(private router: Router) {}

ngOnInit() {
  this.currentUrl = this.router.url; // Obtiene la URL actual
  this.actualizarNavBar(this.currentUrl);
}

  @Input()
  textoBoton:string="Click aqui"


actualizarNavBar( ruta: string) {

  if(ruta == "/local/staff") {
    this.icono =ICONOS.lupa;
    this.texto = "Filtros";
    this.referencia = '#';
  }

  if(ruta == "/local/servicios") {
    this.icono =ICONOS.lupa;
    this.texto = "Filtros";
    this.referencia = '#';
  }



}


@Output() evento: EventEmitter<void> = new EventEmitter<void>();

emitirAccion(){
  this.evento.emit();
}

}
