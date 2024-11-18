import { Routes } from '@angular/router';
import { PanelRecepcionComponent } from './pages/dashboardLocal/panel-recepcion/panel-recepcion.component';
import { PedirTurnoComponent } from './pages/pedirTurno/pedir-turno/pedir-turno.component';
import { ProfesionalesMainComponent } from './pages/dashboardLocal/profesionales/profesionales-main/profesionales-main.component';
import { ServicioMainComponent } from './pages/dashboardLocal/servicio/servicio-main/servicio-main.component';
import { DashboardClienteComponent } from './pages/dashboardCliente/dashboard-cliente.component';
import { authGuardFn } from './auth/guard/auth.guard-fn';
import { rolGuardFn } from './auth/guard/rol.guard-fn';
import { ROLES } from './shared/models/rolesUsuario.constants';
import { TurnosComponent } from './pages/dashboardLocal/turnos/turnos.component';
import { ToggleComponent } from './pages/inicioSesion/toggle/toggle.component';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { RegistrarNegocioComponent } from './pages/dashboardAdmin/components/registrar-negocio/registrar-negocio.component';
import { DashboardAdminPageComponent } from './pages/dashboardAdmin/dashboard-admin-page.component';
import { UsuariosComponent } from './pages/dashboardAdmin/components/usuarios/usuarios.component';



export const routes: Routes = [{
  path:"landing-page",
  component:LandingPageComponent
},{
  path:"login",
  component:ToggleComponent
},
{
  path:"register",
  component:ToggleComponent
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
  {path: '', component:TurnosComponent},
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
  component:DashboardAdminPageComponent,
  canActivate: [authGuardFn,()=>rolGuardFn(ROLES.admin)],
  children : [
   {path: 'inicio', component:DashboardAdminPageComponent},
   {path: 'negocio',component: RegistrarNegocioComponent},
   {path: 'usuarios',component: UsuariosComponent},
   {path: 'configuracion', component:DashboardAdminPageComponent},
   {path: 'salir', component:DashboardAdminPageComponent}
  ]
},
{
  path:"**",
  redirectTo:"landing-page",
  pathMatch:"full"

}];

