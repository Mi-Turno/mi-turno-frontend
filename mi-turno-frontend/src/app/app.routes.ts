import { Routes } from '@angular/router';
import { LandingPageComponent } from './pages/landing/landing-page/landing-page.component';
import { LoginComponent } from './pages/inicioSesion/login/login.component';
import { RegisterComponent } from './pages/inicioSesion/register/register.component';
import { PanelRecepcionComponent } from './pages/dashboardLocal/panel-recepcion/panel-recepcion.component';
import { PedirTurnoComponent } from './pages/pedirTurno/pedir-turno/pedir-turno.component';
import { ProfesionalesMainComponent } from './pages/dashboardLocal/profesionales/profesionales-main/profesionales-main.component';
import { ServicioMainComponent } from './pages/dashboardLocal/servicio/servicio-main/servicio-main.component';
import { DashboardClienteComponent } from './pages/dashboardCliente/dashboard-cliente/dashboard-cliente.component';
import { authGuardFn } from './auth/guard/auth.guard-fn';


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
  path:"dashboard-cliente",
  component:DashboardClienteComponent,
  canActivate: [authGuardFn]
},

{

 path:"negocios/:nombreNegocio",
 component:PanelRecepcionComponent,
 canActivate: [authGuardFn],
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
  canActivate: [authGuardFn],
},
{
  path:"**",
  redirectTo:"landing-page",
  pathMatch:"full"

}];
