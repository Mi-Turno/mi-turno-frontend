import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { SideBarComponent } from '../side-bar/side-bar.component';
import { FormsModule } from '@angular/forms';

import { CardComponent } from '../../../shared/components/card/card.component';
import { RouterOutlet } from '@angular/router';
import { PopUpCrearProfesionalComponent } from '../profesionales/pop-up-crear-profesional/pop-up-crear-profesional.component';
import { ProfesionalesMainComponent } from '../profesionales/profesionales-main/profesionales-main.component';

@Component({
  selector: 'app-panel-recepcion',
  standalone: true,
  imports: [CommonModule,CardComponent, NavBarComponent, SideBarComponent,ProfesionalesMainComponent, FormsModule, RouterOutlet,PopUpCrearProfesionalComponent ],
  templateUrl: './panel-recepcion.component.html',
  styleUrl: './panel-recepcion.component.css'
})
export class PanelRecepcionComponent {

  estaSobrepuesto: boolean = false;

  cambiarSobreposicion() {
    this.estaSobrepuesto = !this.estaSobrepuesto;
    console.log(this.estaSobrepuesto);
  }
}
