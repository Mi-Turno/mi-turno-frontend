import { Component, inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BotonComponent } from '../../../../shared/components/boton/boton.component';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { PLACEHOLDERS } from '../../../../shared/models/placeholderInicioSesion.constants';
import { ICONOS } from '../../../../shared/models/iconos.constants';
import { Rubros } from '../../../../shared/models/rubrosEnum';
import { RouterLink } from '@angular/router';
import { NegocioInterface } from '../../../../core/interfaces/negocio-interface';
import { NegocioServiceService } from '../../../../core/services/negocioService/negocio-service.service';

@Component({
  selector: 'app-negocios-cliente',
  standalone: true,
  imports: [ReactiveFormsModule, BotonComponent, MatIconModule, MatFormFieldModule, MatInputModule, FormsModule, MatSelectModule, MatOptionModule, CommonModule, RouterLink],
  templateUrl: './negocios-cliente.component.html',
  styleUrl: './negocios-cliente.component.css'
})
export class NegociosClienteComponent implements OnInit {

  placeholders = PLACEHOLDERS;
  iconos = ICONOS;

  rubros: Rubros[] = Object.values(Rubros);
negocioService: NegocioServiceService = inject(NegocioServiceService);

listadoNegocios:NegocioInterface[] =[];


ngOnInit(): void {
  this.obtenerNegocios();
}

obtenerNegocios(){
  this.negocioService.getTodosLosNegocios().subscribe({
    next: (negocios: NegocioInterface[]) => {
      this.listadoNegocios = [...negocios];
      console.log(negocios);
       // Forzar detección de cambios
    },
    error: (error) => {
      console.error(error);
    }
  });
}



}
