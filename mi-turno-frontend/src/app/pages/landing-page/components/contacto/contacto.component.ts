import { Component } from '@angular/core';
import { InputComponent } from "../../../../shared/components/input/input.component";
import { BotonComponent } from "../../../../shared/components/boton/boton.component";

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [InputComponent, BotonComponent],
  templateUrl: './contacto.component.html',
  styleUrl: './contacto.component.css'
})
export class ContactoComponent {

}
