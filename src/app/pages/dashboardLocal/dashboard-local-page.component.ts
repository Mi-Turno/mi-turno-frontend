import { CommonModule } from "@angular/common";
import { Component, inject, OnInit } from "@angular/core";
import { NavBarComponent } from "../../shared/components/nav-bar/nav-bar.component";
import { SideBarComponent } from "../../shared/components/side-bar/side-bar.component";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute, Router, RouterOutlet } from "@angular/router";
import { AuthService } from "../../core/guards/auth/service/auth.service";
import { ICONOS } from "../../shared/models/iconos.constants";
import { ArchivosServiceService } from "../../core/services/archivosService/archivos-service.service";
import { NegocioServiceService } from "../../core/services/negocioService/negocio-service.service";
import { NegocioInterface } from "../../core/interfaces/negocio-interface";

@Component({
  selector: 'app-dashboard-local-page',
  standalone: true,
  imports: [CommonModule, NavBarComponent, SideBarComponent, FormsModule, RouterOutlet],
  templateUrl: './dashboard-local-page.component.html',
  styleUrl: './dashboard-local-page.component.css'
})
export class DashboardLocalPageComponent implements OnInit{

  //Injections
  auth:AuthService = inject(AuthService);
  router:Router = inject(Router);
  archivosService:ArchivosServiceService = inject(ArchivosServiceService);
  negocioService:NegocioServiceService = inject(NegocioServiceService);

  //Variables
  iconos = ICONOS;
  estaSobrepuesto: boolean = false;
  texto = "Hacer reserva";
  fotoNegocioActual:string = "icono-removebg.png";
  negocioActual: NegocioInterface | null = null;
  nombreNegocio: string = "";
  botones =[
    {texto: 'Recepción', icono: this.iconos.home , ruta: 'recepcion'},
    {texto: 'Turnos', icono: this.iconos.eventNote, ruta: 'turnos'},
    {texto: 'Reservar', icono: this.iconos.calendario, ruta: 'reservas'},
    {texto: 'Staff', icono: this.iconos.badge, ruta: 'staff'},
    {texto: 'Servicios', icono: this.iconos.star, ruta: 'servicios'},
    {texto: 'Clientes', icono: this.iconos.people,  ruta: 'clientes'},
    {texto: 'Configuración', icono: this.iconos.settings, ruta: 'configuracion'},
  ]
  idNegocio:number = 0;
  //ngOninit y constructor
  constructor(private ruta:ActivatedRoute){}

  ngOnInit(): void {
    this.nombreNegocio = this.ruta.snapshot.params['nombreNegocio'];
    this.idNegocio = this.auth.getIdUsuario()!;
    this.getNegocioActual();
  }

  //funciones servicios

  getNegocioActual(){
    this.negocioService.getNegocioById(this.idNegocio).subscribe({
      next: (negocio) => {
        if(negocio.idUsuario && negocio.fotoPerfil != null){
          this.archivosService.getArchivoUsuario(negocio.idUsuario).subscribe({
            next: (response) => {
              let reader = new FileReader();
              reader.readAsDataURL(response);
              reader.onload = () => {
                this.fotoNegocioActual = reader.result as string;
              }
            },
            error: (err) => {
              this.fotoNegocioActual = "icono-removebg.png";
            },
          })
        }
      }
    })
  }


  //funciones

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

}
