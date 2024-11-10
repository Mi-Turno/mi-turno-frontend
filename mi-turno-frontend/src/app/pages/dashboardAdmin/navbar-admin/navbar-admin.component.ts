import { Component, OnInit } from '@angular/core';
import { ICONOS } from '../../../shared/models/iconos.constants';
import { Router } from '@angular/router';
import { ChipComponent } from "../../../shared/components/chip/chip.component";
import { FechaYHoraComponent } from "../../../shared/components/fecha-y-hora/fecha-y-hora.component";

@Component({
  selector: 'app-navbar-admin',
  standalone: true,
  imports: [ChipComponent, FechaYHoraComponent],
  templateUrl: './navbar-admin.component.html',
  styleUrl: './navbar-admin.component.css'
})
export class NavbarAdminComponent implements OnInit {

  icono = ICONOS.eventNote;
  texto = "Crear negocio";
  referencia = '';

  currentUrl: string = '';

  constructor(private router: Router) { }

  ngOnInit() {
    this.currentUrl = this.router.url; // Obtiene la URL actual
    this.actualizarNavBar(this.currentUrl);
  }


  actualizarNavBar(ruta: string) {

    if (ruta == "/local/staff") {
      this.icono = ICONOS.lupa;
      this.texto = "Filtros";
      this.referencia = '#';
    }

    if (ruta == "/local/servicios") {
      this.icono = ICONOS.lupa;
      this.texto = "Filtros";
      this.referencia = '#';
    }

  }
}
