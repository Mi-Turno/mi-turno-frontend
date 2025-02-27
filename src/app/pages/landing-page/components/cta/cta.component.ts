import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-cta',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './cta.component.html',
  styleUrl: './cta.component.css'
})
export class CtaComponent {

}