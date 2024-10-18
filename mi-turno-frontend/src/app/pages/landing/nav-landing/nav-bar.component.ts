import { Component } from '@angular/core';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})

export class NavBarComponent {
urlBase:string = "landing-page/"
url:string = "icono.png";
heroHref:string =`${this.urlBase}#hero`
sobreNosotrosHref:string = `${this.urlBase}#sobreNosotros`
preciosHref:string = `${this.urlBase}#precio`


}
