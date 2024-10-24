import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { SideBarComponent } from '../side-bar/side-bar.component';
import { FormsModule } from '@angular/forms';
import { TurnoMainComponent } from '../turno-main/turno-main.component';

@Component({
  selector: 'app-panel-recepcion',
  standalone: true,
  imports: [CommonModule, NavBarComponent, SideBarComponent, TurnoMainComponent,FormsModule,],
  templateUrl: './panel-recepcion.component.html',
  styleUrl: './panel-recepcion.component.css'
})
export class PanelRecepcionComponent {


}
