import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';

import { CommonModule } from '@angular/common';
import { SideBarAdminComponent } from './components/side-bar-admin/side-bar-admin.component';
import { NavbarAdminComponent } from './components/navbar-admin/navbar-admin.component';
import { AuthService } from '../../core/guards/auth/service/auth.service';

@Component({
  selector: 'app-dashboard-admin-page',
  standalone: true,
  imports: [CommonModule, SideBarAdminComponent, RouterModule, NavbarAdminComponent],
  templateUrl: './dashboard-admin-page.component.html',
  styleUrl: './dashboard-admin-page.component.css'
})
export class DashboardAdminPageComponent implements OnInit {
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

