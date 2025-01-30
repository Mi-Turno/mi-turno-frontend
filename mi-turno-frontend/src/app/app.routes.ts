import { Routes } from '@angular/router';
import { PedirTurnoComponent } from './pages/pedirTurno/pedir-turno/pedir-turno.component';
import { ProfesionalesMainComponent } from './pages/dashboardLocal/components/profesionales/profesionales-main/profesionales-main.component';
import { ServicioMainComponent } from './pages/dashboardLocal/components/servicios/servicio-main/servicio-main.component';
import { DashboardClienteComponent } from './pages/dashboardCliente/dashboard-cliente.component';
import { ROLES } from './shared/models/rolesUsuario.constants';
import { ToggleComponent } from './pages/inicioSesion/toggle/toggle.component';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { RegistrarNegocioComponent } from './pages/dashboardAdmin/components/registrar-negocio/registrar-negocio.component';
import { DashboardAdminPageComponent } from './pages/dashboardAdmin/dashboard-admin-page.component';
import { UsuariosComponent } from './pages/dashboardAdmin/components/usuarios/usuarios.component';
import { authGuardFn } from './core/guards/auth/guard/auth.guard-fn';
import { rolGuardFn } from './core/guards/auth/guard/rol.guard-fn';
import { DashboardLocalPageComponent } from './pages/dashboardLocal/dashboard-local-page.component';
import { TablaTurnosComponent } from './shared/components/tabla-turnos/tabla-turnos.component';
import { TablaTurnosDataSource } from './shared/components/tabla-turnos/tabla-turnos-datasource';
import { VerificacionMailComponent } from './pages/verificacion-mail/verificacion-mail.component';



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
  path:"verificacion-email",
  component: VerificacionMailComponent
},
{
  path:"dashboard-cliente",
  component:DashboardClienteComponent,
  canActivate: [authGuardFn,()=>rolGuardFn(ROLES.cliente)],
},
{

 path:"negocios/:nombreNegocio",
 component:DashboardLocalPageComponent,
 canActivate: [authGuardFn,()=>rolGuardFn(ROLES.negocio)],
 children : [
  { path: '', redirectTo: 'recepcion', pathMatch: 'full' },
  {path: 'recepcion', component:TablaTurnosComponent},
  {path: 'turnos', component:TablaTurnosComponent},
  {path: 'staff', component:ProfesionalesMainComponent},
  {path: 'servicios', component:ServicioMainComponent},
  {path: 'clientes', component:DashboardLocalPageComponent},
  {path: 'configuracion', component:DashboardLocalPageComponent},
  {path: 'salir', component:DashboardLocalPageComponent}
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

