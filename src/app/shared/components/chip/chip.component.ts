import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { ControlValueAccessor } from '@angular/forms';

@Component({
  selector: 'app-chip',
  standalone: true,
  imports: [CommonModule, MatIcon],
  templateUrl: './chip.component.html',
  styleUrl: './chip.component.css'
})
export class ChipComponent {

@Input()  claseIcono =  'claseIcono';
@Input() claseEnlace = 'claseEnlace';

@Input() icono = "";
@Input() texto = "";
@Input() referencia = "";

}
