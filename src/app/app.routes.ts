import { Routes } from '@angular/router';
import { ProfesionalesMainComponent } from './pages/dashboardLocal/components/profesionales/profesionales-main/profesionales-main.component';
import { ServicioMainComponent } from './pages/dashboardLocal/components/servicios/servicio-main/servicio-main.component';
import { DashboardClienteComponent } from './pages/dashboardCliente/dashboard-cliente.component';
import { ROLES } from './shared/models/rolesUsuario.constants';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { RegistrarNegocioComponent } from './pages/dashboardAdmin/components/registrar-negocio/registrar-negocio.component';
import { DashboardAdminPageComponent } from './pages/dashboardAdmin/dashboard-admin-page.component';
import { authGuardFn } from './core/guards/auth/guard/auth.guard-fn';
import { rolGuardFn } from './core/guards/auth/guard/rol.guard-fn';
import { DashboardLocalPageComponent } from './pages/dashboardLocal/dashboard-local-page.component';
import { TablaTurnosComponent } from './shared/components/tabla-turnos/tabla-turnos.component';
import { VerificacionMailComponent } from './pages/verificacion-mail/verificacion-mail.component';
import { TablaClientesComponent } from './shared/components/tabla-clientes/tabla-clientes.component';
import { PedirTurnoComponent } from './pages/pedirTurno/pedir-turno.component';
import { ConfiguracionLocalComponent } from './pages/dashboardLocal/components/configuracion-local/configuracion-local.component';
import { ReservarTurnoLocalComponent } from './pages/dashboardLocal/components/reservar-turno-local/reservar-turno-local.component';
import { NegociosClienteComponent } from './pages/dashboardCliente/components/negocios-cliente/negocios-cliente.component';
import { InicioDeSesionComponent } from './pages/inicioDeSesion/inicio-de-sesion.component';
import { CambiarPasswordMailComponent } from './pages/inicioDeSesion/components/cambiar-password-mail/cambiar-password-mail.component';
import { CambiarPasswordPasswordComponent } from './pages/inicioDeSesion/components/cambiar-password-password/cambiar-password-password.component';
import { ToggleComponent } from './pages/inicioDeSesion/components/toggle/toggle.component';




export const routes: Routes = [{
  path:"landing-page",
  component:LandingPageComponent
},{
  path:"login",
  component:InicioDeSesionComponent,
  children : [
    {path: '', component:ToggleComponent},
    {path: 'olvide-password', component:CambiarPasswordMailComponent},
    {path: 'nueva-password', component:CambiarPasswordPasswordComponent}
  ]
},
{
  path:"register",
  component:InicioDeSesionComponent
},
{
  path:"verificacion-email",
  component: VerificacionMailComponent
},
{
  path:"dashboard-cliente",
  component:DashboardClienteComponent,
  canActivate: [authGuardFn,()=>rolGuardFn(ROLES.cliente)],
  children : [
    {path: 'negocios', component:NegociosClienteComponent },
    {path: 'cliente', component: DashboardClienteComponent}
  ]

},
{

 path:"negocios/:nombreNegocio",
 component:DashboardLocalPageComponent,
 canActivate: [authGuardFn,()=>rolGuardFn(ROLES.negocio)],
 children : [
  { path: '', redirectTo: 'recepcion', pathMatch: 'full' },
  {path: 'recepcion', component:TablaTurnosComponent},
  {path: 'turnos', component:TablaTurnosComponent},
  {path: 'reservas', component:ReservarTurnoLocalComponent},
  {path: 'staff', component:ProfesionalesMainComponent},
  {path: 'servicios', component:ServicioMainComponent},
  {path: 'clientes', component:TablaClientesComponent},
  {path: 'configuracion', component:ConfiguracionLocalComponent},
  {path: 'salir', component:DashboardLocalPageComponent}
 ]
},
{
  path:"negocios/:nombreNegocio/pedir-turno",
  component:PedirTurnoComponent,
  canActivate: [authGuardFn,()=>rolGuardFn(ROLES.cliente)]
  ,
},
{
  path:"admin/:idAdmin",
  component:DashboardAdminPageComponent,
  canActivate: [authGuardFn,()=>rolGuardFn(ROLES.admin)],
  children : [
    { path: '', redirectTo: 'negocio', pathMatch: 'full' },
   {path: 'inicio', component:DashboardAdminPageComponent},
   {path: 'negocio',component: RegistrarNegocioComponent},
   {path: 'usuarios',component: TablaClientesComponent},
   {path: 'configuracion', component:DashboardAdminPageComponent},
   {path: 'salir', component:DashboardAdminPageComponent}
  ]
},
{
  path:"**",
  redirectTo:"landing-page",
  pathMatch:"full"

}];

