import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { NavBarComponent } from "../../shared/components/nav-bar/nav-bar.component";
import { SideBarComponent } from "../../shared/components/side-bar/side-bar.component";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute, Router, RouterOutlet } from "@angular/router";
import { AuthService } from "../../core/guards/auth/service/auth.service";
import { ICONOS } from "../../shared/models/iconos.constants";

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
  router:Router = inject(Router);
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
    this.router.navigate([`/negocios`, this.nombreNegocio, `reservas`]);
    }
iconos = ICONOS;



  botones =[

    {texto: 'Recepción', icono: this.iconos.home , ruta: 'recepcion'},
    {texto: 'Turnos', icono: this.iconos.eventNote, ruta: 'turnos'},
    {texto: 'Reservar', icono: this.iconos.calendario, ruta: 'reservas'},
    {texto: 'Staff', icono: this.iconos.badge, ruta: 'staff'},
    {texto: 'Servicios', icono: this.iconos.star, ruta: 'servicios'},
    {texto: 'Clientes', icono: this.iconos.people,  ruta: 'clientes'},
    {texto: 'Configuración', icono: this.iconos.settings, ruta: 'configuracion'},

  ]
}
