import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { NavBarComponent } from "../../shared/components/nav-bar/nav-bar.component";
import { SideBarComponent } from "./components/side-bar/side-bar.component";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute, RouterOutlet } from "@angular/router";
import { AuthService } from "../../core/guards/auth/service/auth.service";

@Component({
  selector: 'app-dashboard-local-page',
  standalone: true,
  imports: [CommonModule, NavBarComponent, SideBarComponent, FormsModule, RouterOutlet],
  templateUrl: './dashboard-local-page.component.html',
  styleUrl: './dashboard-local-page.component.css'
})
export class DashboardLocalPageComponent {
  estaSobrepuesto: boolean = false;
texto = "Hacer reserva";
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

  redirigir(){
    alert("Hay que hacer la navegación a una pantalla que nos permita crear un turno como negocio");
  }
}
