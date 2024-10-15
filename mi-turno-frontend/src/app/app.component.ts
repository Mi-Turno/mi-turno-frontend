import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeroComponent } from "./components/landing-page/hero/hero.component";
import { NavBarComponent } from './components/landing-page/nav-bar/nav-bar.component';
import { SobreNosotrosComponent } from './components/landing-page/sobre-nosotros/sobre-nosotros.component';
@Component({
  imports: [CommonModule,RouterOutlet,NavBarComponent,HeroComponent,SobreNosotrosComponent],
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Mi Turno';



}
