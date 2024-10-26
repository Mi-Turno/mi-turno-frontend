import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { BotonComponent } from '../../../shared/components/boton/boton.component';
import { InputComponent } from '../../../shared/components/input/input.component';
import { MatIcon } from '@angular/material/icon';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ICONOS } from '../../../shared/models/iconos.constants';
import { PLACEHOLDERS } from '../../../shared/models/placeholderInicioSesion.constants';
import { CardComponent } from '../../../shared/components/card/card.component';
import { ServicioInterface } from '../../../core/interfaces/servicio-interface';
import { ServicioServiceService } from '../../../core/services/servicioService/servicio-service.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pop-up-crear-servicio',
  standalone: true,
  imports: [CommonModule, BotonComponent, InputComponent, MatIcon, ReactiveFormsModule,CardComponent],
  templateUrl: './pop-up-crear-servicio.component.html',
  styleUrl: './pop-up-crear-servicio.component.css'
})
export class PopUpCrearServicioComponent {
  icono = ICONOS;
  placeholder = PLACEHOLDERS;
  tipoPopUp = 'servicios'

  @Input() fotoServicio = "img-default.png"//poner imagen de un servicio
  servicioService:ServicioServiceService = inject(ServicioServiceService);
  @Input() estadoPopUp:boolean = true;


  @Output() desactivarOverlay: EventEmitter<void> = new EventEmitter<void>();
  cerrarPopUp() {
    this.estadoPopUp=false;
    this.desactivarOverlay.emit();
  }

  formularioServicio = new FormGroup ({
    nombre: new FormControl('', Validators.required),
    precio: new FormControl('', Validators.required),
    duracion: new FormControl('',Validators.required),

  });

  crearUnServicio():ServicioInterface{
    const nombre: string = this.formularioServicio.get('nombre')?.value || '';
    const precio = parseFloat(this.formularioServicio.get('precio')?.value || '0');
    const duracion = parseFloat(this.formularioServicio.get('duracion')?.value || '0');
    return {
      nombre,
      precio,
      duracion,
    };
  }
  constructor(private router: Router) {}
  postServicioToBackend() {

    if(this.formularioServicio.valid){
      const servicioNuevo:ServicioInterface = this.crearUnServicio();
        this.servicioService.POSTcrearUnServicio(servicioNuevo).subscribe({
          next: (response) =>{
            this.cerrarPopUp();
            console.log(response);
          },
          error: (error:HttpErrorResponse) =>{
            console.log(error);
          }
        })
    }else{
      let campoError: string = '';
      Object.keys(this.formularioServicio.controls).forEach(campo => {
        const control = this.formularioServicio.get(campo);
        if (control?.invalid) {
          campoError += (`${campo} es inválido, `);
        }
      });
      alert(campoError);
    }
  }
  eliminarServicio() {
    console.log("Elimine el servicio");
  }
}
