import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { SideBarComponent } from '../side-bar/side-bar.component';
import { FormsModule } from '@angular/forms';

import { CardComponent } from '../../../shared/components/card/card.component';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { PopUpCrearProfesionalComponent } from '../profesionales/pop-up-crear-profesional/pop-up-crear-profesional.component';
import { ProfesionalesMainComponent } from '../profesionales/profesionales-main/profesionales-main.component';
import { AuthService } from '../../../auth/service/auth.service';

@Component({
  selector: 'app-panel-recepcion',
  standalone: true,
  imports: [CommonModule, NavBarComponent, SideBarComponent, FormsModule, RouterOutlet],
  templateUrl: './panel-recepcion.component.html',
  styleUrl: './panel-recepcion.component.css'
})
export class PanelRecepcionComponent implements OnInit {

  estaSobrepuesto: boolean = false;

  constructor(private ruta:ActivatedRoute){}
  nombreNegocio:string = "";
  ngOnInit(): void {
    this.nombreNegocio = this.ruta.snapshot.params['nombreNegocio'];
  }
  auth:AuthService = inject(AuthService);
  cerrarSesion(event:boolean){
    if(event){
      this.auth.logOut();
     }
  }
  cambiarSobreposicion() {
    this.estaSobrepuesto = !this.estaSobrepuesto;
    console.log(this.estaSobrepuesto);
  }
}
