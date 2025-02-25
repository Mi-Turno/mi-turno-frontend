import { Component, inject } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { NavPedirTurnoComponent } from '../nav-cliente/nav-cliente';
import { DashboardClienteComponent } from "../../dashboard-cliente.component";

@Component({
  selector: 'app-principal-cliente',
  standalone: true,
  imports: [NavPedirTurnoComponent, RouterModule, DashboardClienteComponent],
  templateUrl: './principal-cliente.component.html',
  styleUrl: './principal-cliente.component.css'
})
export class PrincipalClienteComponent {


  //Variables

  historialLevantado:Boolean = false;

  //Injections

  router:Router = inject(Router);


  cerrarHistorial(event: Event) {
    this.historialLevantado = (event.target as HTMLInputElement).checked;
  }
  manejarBotonHistorial(event:Boolean){
      this.historialLevantado = event;
      if (!this.historialLevantado) {
        this.router.navigate(['/dashboard-cliente']);
      }
  }


  isRutaBasica()
  {
    let rta = false;
    if(this.router.url == "/dashboard-cliente") {
      rta = true;
    }
    return rta;
  }

}
