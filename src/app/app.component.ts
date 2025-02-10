import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { NgHttpLoaderModule, Spinkit } from 'ng-http-loader';


@Component({
  imports: [CommonModule, RouterOutlet,ReactiveFormsModule, NgHttpLoaderModule],
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Mi Turno';
  public spinkit = Spinkit;
}
