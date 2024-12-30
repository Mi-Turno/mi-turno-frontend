import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { CommonModule } from '@angular/common';
import { SideBarAdminComponent } from './components/side-bar-admin/side-bar-admin.component';
import { AuthService } from '../../core/guards/auth/service/auth.service';
import { NavBarComponent } from "../../shared/components/nav-bar/nav-bar.component";

@Component({
  selector: 'app-dashboard-admin-page',
  standalone: true,
  imports: [CommonModule, SideBarAdminComponent, RouterModule, NavBarComponent],
  templateUrl: './dashboard-admin-page.component.html',
  styleUrl: './dashboard-admin-page.component.css'
})
export class DashboardAdminPageComponent implements OnInit {
  estaSobrepuesto: boolean = false;
  idAdmin:number = 0;

  auth:AuthService = inject(AuthService);
  ruta:ActivatedRoute = inject(ActivatedRoute);
texto = "Crear negocio"
  ngOnInit(): void {
    this.idAdmin = Number(localStorage.getItem('idUsuario'));
  }

  router = inject(Router);

  cerrarSesion(event:boolean){

    if(event){
      this.auth.logOut();
    }

  }

  cambiarSobreposicion() {
    this.estaSobrepuesto = !this.estaSobrepuesto;
  }


redirigir(){
  alert("Hay que hacer la navegación a la pantalla de negocios");
  //this.router.navigateByUrl('');
}

}

