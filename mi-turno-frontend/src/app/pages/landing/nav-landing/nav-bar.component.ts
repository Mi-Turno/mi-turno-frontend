import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})

export class NavBarComponent {
urlBase:string = "landing-page/"
urlIcono:string = "icono.png";
heroHref:string =`#hero`
sobreNosotrosHref:string = `#sobreNosotros`
preciosHref:string = `#precio`
loginHref:string = "login"

}
