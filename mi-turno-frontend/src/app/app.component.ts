import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeroComponent } from "./components/hero/hero.component";
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
@Component({
  imports: [CommonModule,RouterOutlet,NavBarComponent,HeroComponent],
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Mi Turno';



}
