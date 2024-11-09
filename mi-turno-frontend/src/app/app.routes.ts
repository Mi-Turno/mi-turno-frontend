import { Routes } from '@angular/router';
import { LandingPageComponent } from './pages/landing/landing-page/landing-page.component';
import { LoginComponent } from './pages/inicioSesion/login/login.component';
import { RegisterComponent } from './pages/inicioSesion/register/register.component';
import { PanelRecepcionComponent } from './pages/dashboardLocal/panel-recepcion/panel-recepcion.component';
import { PedirTurnoComponent } from './pages/pedirTurno/pedir-turno/pedir-turno.component';
import { ConfirmacionComponent } from './pages/pedirTurno/confirmacion/confirmacion.component';
import { HorariosComponent } from './pages/dashboardLocal/horarios/horarios.component';
import { ProfesionalesMainComponent } from './pages/dashboardLocal/profesionales/profesionales-main/profesionales-main.component';
import { ServicioMainComponent } from './pages/dashboardLocal/servicio/servicio-main/servicio-main.component';
import { PopUpConfirmacionComponent } from './pages/pedirTurno/pop-up-confirmacion/pop-up-confirmacion.component';
import { SeleccionUsuarioComponent } from './pages/pedirTurno/seleccion-usuario/seleccion-usuario.component';
import { PopUpHorariosProfesionalesComponent } from './pages/dashboardLocal/profesionales/pop-up-horarios-profesionales/pop-up-horarios-profesionales.component';
import { PopUpServiciosProfesionalesComponent } from './pages/dashboardLocal/profesionales/pop-up-servicios-profesionales/pop-up-servicios-profesionales.component';

export const routes: Routes = [{
  path:"landing-page",
  component:LandingPageComponent
},{
  path:"login",
  component:LoginComponent
},
{
  path:"register",
  component:RegisterComponent
},
{

 path:"negocios/:nombreNegocio",
 component:PanelRecepcionComponent,
 children : [
  {path: 'recepcion', component:PanelRecepcionComponent},
  {path: 'turnos', component:PanelRecepcionComponent},
  {path: 'staff', component:ProfesionalesMainComponent},
  {path: 'servicios', component:ServicioMainComponent},
  {path: 'clientes', component:PanelRecepcionComponent},
  {path: 'configuracion', component:PanelRecepcionComponent},
  {path: 'salir', component:PanelRecepcionComponent}
 ]
},
{
  path:"negocios/:nombreNegocio/pedir-turno",
  component:PedirTurnoComponent,
},
{
  path:"prueba",
  component: PopUpServiciosProfesionalesComponent,
},
{
  path:"**",
  component:LandingPageComponent
}];
