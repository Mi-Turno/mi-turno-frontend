import { Component } from '@angular/core';
import { ICONOS } from '../../../../shared/models/iconos.constants';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-nav-bar-landing',
  standalone: true,
  imports: [MatIcon],
  templateUrl: './nav-bar-landing.component.html',
  styleUrl: './nav-bar-landing.component.css'
})
export class NavBarLandingComponent {
  iconos = ICONOS;


urlBase:string = "landing-page/"
urlIcono:string = "icono.png";
heroHref:string =`#hero`
sobreNosotrosHref:string = `#sobreNosotros`
preciosHref:string = `#precio`
loginHref:string = "login"
}
