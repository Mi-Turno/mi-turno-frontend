import { Component } from '@angular/core';
import { BeneficiosComponent } from './components/beneficios/beneficios.component';
import { CaracteristicasComponent } from './components/caracteristicas/caracteristicas.component';
import { PreciosComponent } from './components/precios/precios.component';
import { CtaComponent } from './components/cta/cta.component';
import { ContactoComponent } from './components/contacto/contacto.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeroComponent } from './components/hero/hero.component';
import { IntroduccionComponent } from './components/introduccion/introduccion.component';
import { NavBarLandingComponent } from './components/nav-bar-landing/nav-bar-landing.component';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [BeneficiosComponent,CaracteristicasComponent, PreciosComponent, CtaComponent, ContactoComponent, FooterComponent, HeroComponent, IntroduccionComponent, NavBarLandingComponent],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css'
})
export class LandingPageComponent {

}
