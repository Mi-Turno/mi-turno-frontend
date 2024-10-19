import { Component, ElementRef, EventEmitter, ViewChild } from '@angular/core';
import { InputComponent } from "../../../shared/components/input/input.component";
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [InputComponent,MatIconModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  typeEmail:string = "email";
  typePassword:string = "password";

}
