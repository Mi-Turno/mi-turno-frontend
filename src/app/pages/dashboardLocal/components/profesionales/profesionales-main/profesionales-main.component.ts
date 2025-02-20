import { CommonModule } from "@angular/common"
import { Component, inject, OnInit } from "@angular/core"
import { CardComponent } from "../../../../../shared/components/card/card.component"
import { PopUpCrearProfesionalComponent } from "../pop-up-crear-profesional/pop-up-crear-profesional.component"
import { PopUpHorariosProfesionalesComponent } from "../pop-up-horarios-profesionales/pop-up-horarios-profesionales.component"
import { PopUpServiciosProfesionalesComponent } from "../pop-up-servicios-profesionales/pop-up-servicios-profesionales.component"
import { UsuarioInterface } from "../../../../../core/interfaces/usuario-interface"
import { ProfesionalesServiceService } from "../../../../../core/services/profesionalService/profesionales-service.service"
import { ActivatedRoute } from "@angular/router"
import { NegocioServiceService } from "../../../../../core/services/negocioService/negocio-service.service"
import { AuthService } from "../../../../../core/guards/auth/service/auth.service"
import { ArchivosServiceService } from "../../../../../core/services/archivosService/archivos-service.service"

@Component({
  selector: 'app-profesionales-main',
  standalone: true,
  imports: [CommonModule, CardComponent, PopUpCrearProfesionalComponent, PopUpHorariosProfesionalesComponent, PopUpServiciosProfesionalesComponent],
  templateUrl: './profesionales-main.component.html',
  styleUrl: './profesionales-main.component.css'
})
export class ProfesionalesMainComponent implements OnInit {

  //servicios
  profesionales: ProfesionalesServiceService = inject(ProfesionalesServiceService)
  servicioNegocio: NegocioServiceService = inject(NegocioServiceService);
  archivosService : ArchivosServiceService = inject(ArchivosServiceService);
  authService: AuthService = inject(AuthService);

  nombre = "Juan"
  especialidad = "Profesional"
  textoBoton = "Modificar"
  rutaImg = "img-default.png"
  textoAlternativo = "Img del barbero"

  idCards: UsuarioInterface[] = [];
  maxCards = 6;

  rutaBotonChip = "#"
  estaSobrepuesto: boolean = false;
  verHorarios: boolean = false;
  verServicios: boolean = false;
  textoTituloPop = "";
  cardSeleccionada: UsuarioInterface | null = null;



  //Hacemos que cambiar sobreposición reciba lo que quiere hacer y la card, en caso de que sea modificar
  cambiarSobreposicion(titulo: string, card: UsuarioInterface | null) {
    this.estaSobrepuesto = !this.estaSobrepuesto;
    this.textoTituloPop = titulo;
    this.cardSeleccionada = card;
  }

  cambiar_SobreposicionHorarios(card: UsuarioInterface | null) {
    this.verHorarios = !this.verHorarios;
    this.cardSeleccionada = card;
  }

  cambiar_SobreposicionServicios(card: UsuarioInterface | null) {
    this.verServicios = !this.verServicios;
    this.cardSeleccionada = card;
  }


  constructor(private ruta: ActivatedRoute) { }
  idNegocio: number = 0;

  ngOnInit() {
    this.idNegocio = this.authService.getIdUsuario()!;
    this.cargarUsuarios();

  }
  cargarUsuarios() {

    this.ruta.parent?.params.subscribe(params => {
      // const nombreNegocio = params['nombreNegocio'];
      //obtengo el arreglo de profesionales del negocio y lo guardo en la variable profesionales
      this.profesionales.GETProfesionalesPorIdNegocioYEstado(this.idNegocio, "true").subscribe({
        next: (profesionales) => {

          //obtenemos las fotos de perfil de los profesionales
          profesionales.map(profesional =>{
            console.log(profesional);

            if(profesional.fotoPerfil){

              this.archivosService.getArchivoUsuario(profesional.idUsuario!).subscribe({
               next: (response) => {
                 const reader = new FileReader();

                 reader.readAsDataURL(response);

                 reader.onload = () => {
                   return profesional.fotoPerfil = reader.result as string;
                 };

               },
               error: (error) => {

                 return profesional.fotoPerfil = "img-default.png"

                 //console.error('Error al obtener la imagen:', error);
               }
             });
            }


          });


          this.idCards = [...profesionales];
        }, error: (error) => {

        }
      });
    });

  }

  cardActual: UsuarioInterface | null = null;

  recibirCardActual(card: UsuarioInterface) {
    this.cardActual = card; // Almacena el valor recibido en cardActual
    this.cargarUsuarios();
  }


}


