import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { SideBarAdminComponent } from "../side-bar-admin/side-bar-admin.component";
import { NavbarAdminComponent } from "../navbar-admin/navbar-admin.component";
import { AuthService } from '../../../auth/service/auth.service';

@Component({
  selector: 'app-panel',
  standalone: true,
  imports: [CommonModule, SideBarAdminComponent, RouterModule, NavbarAdminComponent],
  templateUrl: './panel.component.html',
  styleUrl: './panel.component.css'
})
export class PanelComponent implements OnInit {

  estaSobrepuesto: boolean = false;
  constructor(private ruta:ActivatedRoute){}
  idAdmin:number = 0;
  ngOnInit(): void {
    this.idAdmin = parseFloat(localStorage.getItem('idUsuario')!);
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
