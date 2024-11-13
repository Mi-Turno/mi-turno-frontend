import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ICONOS } from '../../../shared/models/iconos.constants';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})

export class NavBarComponent {

  iconos = ICONOS;


urlBase:string = "landing-page/"
urlIcono:string = "icono.png";
heroHref:string =`#hero`
sobreNosotrosHref:string = `#sobreNosotros`
preciosHref:string = `#precio`
loginHref:string = "login"

}
