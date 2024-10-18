import { Component } from '@angular/core';
import { NavBarComponent } from '../nav-landing/nav-bar.component';
import { HeroComponent } from '../hero/hero.component';
import { SobreNosotrosComponent } from '../sobre-nosotros/sobre-nosotros.component';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [ NavBarComponent, HeroComponent, SobreNosotrosComponent],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css'
})
export class LandingPageComponent {

}
