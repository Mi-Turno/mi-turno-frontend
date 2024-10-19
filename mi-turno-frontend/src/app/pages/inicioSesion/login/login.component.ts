import { Component, ElementRef, EventEmitter, ViewChild } from '@angular/core';
import { InputComponent } from "../../../shared/components/input/input.component";


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [InputComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  typeEmail:string = "email";
  typePassword:string = "password";

}
