import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { BotonComponent } from '../../../shared/components/boton/boton.component';
import { InputComponent } from '../../../shared/components/input/input.component';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-pop-up-crear-profesional',
  standalone: true,
  imports: [CommonModule, BotonComponent, InputComponent, MatIcon],
  templateUrl: './pop-up-crear-profesional.component.html',
  styleUrl: './pop-up-crear-profesional.component.css'
})
export class PopUpCrearProfesionalComponent {

}
