import { Routes } from '@angular/router';
import { LandingPageComponent } from './pages/landing/landing-page/landing-page.component';
import { LoginComponent } from './pages/inicioSesion/login/login.component';
import { RegisterComponent } from './pages/inicioSesion/register/register.component';
import { PanelRecepcionComponent } from './pages/dashboard-negocio/panel-recepcion/panel-recepcion.component';
import { ProfesionalesMainComponent } from './pages/dashboard-negocio/profesionales/profesionales-main/profesionales-main.component';
import { CardComponent } from './shared/components/card/card.component';
import { PedirTurnoComponent } from './pages/pedirTurno/pedir-turno/pedir-turno.component';
import { ConfirmacionComponent } from './pages/pedirTurno/confirmacion/confirmacion.component';
import { ServicioMainComponent } from './pages/dashboard-negocio/servicios/servicio-main/servicio-main.component';
import { PopUpServiciosProfesionalComponent } from './pages/dashboard-negocio/profesionales/pop-up-servicios-profesional/pop-up-servicios-profesional.component';

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
 path:"local",
 component:PanelRecepcionComponent,
 children : [
  {path: 'recepcion', component: PanelRecepcionComponent},
  {path: 'turnos', component:PanelRecepcionComponent},
  {path: 'staff', component:ProfesionalesMainComponent},
  {path: 'servicios', component:ServicioMainComponent},
  {path: 'clientes', component:PanelRecepcionComponent},
  {path: 'configuracion', component:PanelRecepcionComponent},
  {path: 'salir', component:PanelRecepcionComponent}
 ]
},{
  path:"confirmacion",
  component:ConfirmacionComponent
},
{
  path:"**",
  component:LandingPageComponent
}];
