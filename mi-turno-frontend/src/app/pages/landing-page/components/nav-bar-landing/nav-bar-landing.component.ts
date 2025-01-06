import { Component } from '@angular/core';
import { ICONOS } from '../../../../shared/models/iconos.constants';
import { MatIcon } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-bar-landing',
  standalone: true,
  imports: [MatIcon,],
  templateUrl: './nav-bar-landing.component.html',
  styleUrls: ['./nav-bar-landing.component.css']
})
export class NavBarLandingComponent {
  iconos = ICONOS;

  urlBase: string = "landing-page/";
  urlIcono: string = "icono.png";
  heroHref: string = `#hero`;
  sobreNosotrosHref: string = `#introduccion`;
  beneficioHref: string = `#beneficios`;
  preciosHref: string = `#precios`;
  contactoHref: string = `#contacto`;
  loginHref: string = "login";

  constructor(private router: Router) {}

  navegar(sectionId: string): void {
    const rutaActual = this.router.url.split('#')[0]; //ruta actual
    const ruta = this.obtenerRutaDesdeLaSeccion(sectionId);

    if (rutaActual !== ruta) {
      this.router.navigate([ruta]).then(() => {
        this.deslizar(sectionId);
      });
    } else {
      this.deslizar(sectionId);
    }
  }

  private deslizar(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });//deslizar hacia el elemento
    }
  }

  private obtenerRutaDesdeLaSeccion(sectionId: string): string {
    const rutas: { [key: string]: string } = {
      hero: 'landing-page', //ruta por defecto
      introduccion: 'landing-page',
      beneficios: 'landing-page',
      precios: 'landing-page',
      contacto: 'landing-page',
    };
    return rutas[sectionId] || 'landing-page';
  }
}
