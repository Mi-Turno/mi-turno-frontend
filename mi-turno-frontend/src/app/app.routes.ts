import { Routes } from '@angular/router';
import { LandingPageComponent } from './pages/landing/landing-page/landing-page.component';
import { LoginComponent } from './pages/inicioSesion/login/login.component';
import { RegisterComponent } from './pages/inicioSesion/register/register.component';
import { PanelRecepcionComponent } from './pages/dashboardLocal/panel-recepcion/panel-recepcion.component';
import { ProfesionalesMainComponent } from './pages/dashboardLocal/profesionales-main/profesionales-main.component';
import { CardComponent } from './shared/components/card/card.component';
import { PedirTurnoComponent } from './pages/pedirTurno/pedir-turno/pedir-turno.component';
import { ConfirmacionComponent } from './pages/pedirTurno/confirmacion/confirmacion.component';
import { ServicioMainComponent } from './pages/dashboardLocal/servicio-main/servicio-main.component';
import { PopUpCrearServicioComponent } from './pages/dashboardLocal/pop-up-crear-servicio/pop-up-crear-servicio.component';
import { HorariosComponent } from './pages/dashboardLocal/horarios/horarios.component';

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
  path:"confirmacion",
  component:ConfirmacionComponent
},
{
  path:"negocios/:nombreNegocio/pedir-turno",
  component:PedirTurnoComponent,
},
{
  path:"prueba",
  component: HorariosComponent,
},
{
  path:"**",
  component:LandingPageComponent
}];
