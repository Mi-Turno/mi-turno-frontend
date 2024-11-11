import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FechaYHoraComponent } from '../../../shared/components/fecha-y-hora/fecha-y-hora.component';
import { ChipComponent } from "../../../shared/components/chip/chip.component";
import { ICONOS } from '../../../shared/models/iconos.constants';
import { ActivatedRoute, NavigationEnd, Route, Router } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [CommonModule, FechaYHoraComponent, ChipComponent],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent implements OnInit {

icono = ICONOS.eventNote  ;
texto = "Nuevo Turno";
referencia = '#';

currentUrl: string = '';

constructor(private router: Router) {}

ngOnInit() {
  this.currentUrl = this.router.url; // Obtiene la URL actual
  this.actualizarNavBar(this.currentUrl);
}


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

}
