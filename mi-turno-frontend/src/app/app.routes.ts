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
import { rolGuardFn } from './auth/guard/rol.guard-fn';
import { ROLES } from './shared/models/rolesUsuario.constants';
import { PanelComponent } from './pages/dashboardAdmin/panel/panel.component';
import { RegistrarNegocioComponent } from './pages/dashboardAdmin/registrar-negocio/registrar-negocio.component';
import { TurnosComponent } from './pages/dashboardLocal/turnos/turnos.component';


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
  canActivate: [authGuardFn,()=>rolGuardFn(ROLES.cliente)],
},
{

 path:"negocios/:nombreNegocio",
 component:PanelRecepcionComponent,
 canActivate: [authGuardFn,()=>rolGuardFn(ROLES.negocio)],
 children : [
  {path: 'recepcion', component:TurnosComponent},
  {path: 'turnos', component:TurnosComponent},
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
  canActivate: [authGuardFn,()=>rolGuardFn(ROLES.cliente)],
},
{
  path:"admin/:idAdmin",
  component:PanelComponent,
  canActivate: [authGuardFn,()=>rolGuardFn(ROLES.admin)],
  children : [
   {path: 'inicio', component:RegistrarNegocioComponent},
   {path: 'negocios', component:PanelComponent},
   {path: 'usuarios', component:PanelComponent},
   {path: 'configuracion', component:PanelComponent},
   {path: 'salir', component:PanelComponent}
  ]
},
{
  path:"**",
  redirectTo:"landing-page",
  pathMatch:"full"

}];
