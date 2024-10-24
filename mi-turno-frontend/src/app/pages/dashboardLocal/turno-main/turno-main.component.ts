import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CardComponent } from '../../../shared/components/card/card.component';

@Component({
  selector: 'app-turno-main',
  standalone: true,
  imports: [CommonModule, CardComponent],
  templateUrl: './turno-main.component.html',
  styleUrl: './turno-main.component.css'
})
export class TurnoMainComponent {

}
