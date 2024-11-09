import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ServicioInterface } from '../../../../core/interfaces/servicio-interface';

@Component({
  selector: 'app-servicios-check',
  standalone: true,
  imports: [MatSlideToggleModule, CommonModule],
  templateUrl: './servicios-check.component.html',
  styleUrl: './servicios-check.component.css'
})
export class ServiciosCheckComponent implements OnInit {


  ngOnInit(): void {
   this.nombreServicio = this.servicioCompleto?.nombre;

  }
  // Función para alternar el estado del toggle
  cambiarEstadoToggle(event: any) {
    this.toggleActivo = event.checked; // Obtiene el estado del toggle desde el evento
    console.log(this.servicioCompleto);
    console.log(this.toggleActivo);
  }

  @Input() servicioCompleto: ServicioInterface | null = null;
  @Input() idProfesional: number | undefined;
  @Input() toggleActivo: boolean = false;

  nombreServicio = this.servicioCompleto?.nombre;

  modificarServicioProfesional() {
    if(this.toggleActivo){
            //!Aca hay que borrar el servicio del profesional,. supongo que hay que hacer un put para cambiar eso

    } else if(!this.toggleActivo) {
          //!Aca hay que hacer el famoso put que le paso el id del negocio, el id del profesional y el id del servicio

    }

  }

  servicios = [];

}
