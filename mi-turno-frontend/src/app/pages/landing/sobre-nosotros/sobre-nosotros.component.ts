import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';


@Component({
  selector: 'app-sobre-nosotros',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sobre-nosotros.component.html',
  styleUrl: './sobre-nosotros.component.css'
})
export class SobreNosotrosComponent {

  titulosDescripcion = {
    descripcionPrincipal: "Somos un equipo de tres estudiantes de la Universidad Tecnológica Nacional (UTN) en Mar del Plata, desarrollando un gestor de turnos para optimizar la gestión de reservas y asignación de profesionales en negocios.",
    vision: "Ser líderes en la innovación de sistemas de gestión de turnos, mejorando la experiencia de empresas y usuarios.",
    mision: "Desarrollar un gestor de turnos que simplifique y optimice la gestión de reservas y asignación de profesionales para negocios."
  }


valores = [
  { titulo: 'Innovación', descripcion: 'Mejora continua de nuestros servicios.' },
  { titulo: 'Eficiencia', descripcion: 'Optimización de procesos para ahorrar tiempo y recursos.' },
  { titulo: 'Accesibilidad', descripcion: 'Herramienta intuitiva y fácil de usar.' },
  { titulo: 'Compromiso', descripcion: 'Brindar un servicio que beneficie a todos los usuarios.' }
];

idSobreNosotros:string = "sobreNosotros"
}
