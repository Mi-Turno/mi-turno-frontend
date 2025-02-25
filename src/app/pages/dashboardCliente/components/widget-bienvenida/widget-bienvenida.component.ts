import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FechaYHoraComponent } from '../../../../shared/components/fecha-y-hora/fecha-y-hora.component';
import { Router } from '@angular/router';



@Component({
  selector: 'app-widget-bienvenida',
  standalone: true,
  imports: [FechaYHoraComponent],
  templateUrl: './widget-bienvenida.component.html',
  styleUrl: './widget-bienvenida.component.css'
})
export class WidgetBienvenidaComponent {
  @Input() nombreCliente: string = "Nombre";
  @Input() apellidoCliente: string = "Apellido";


  @Output() clickBoton = new EventEmitter<void>();

router:Router = inject(Router);
  navegarANegocio(){
    this.router.navigate(['/dashboard-cliente/negocios']); // Ruta absoluta
  }
}
