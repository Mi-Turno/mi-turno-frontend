import { Routes } from '@angular/router';
import { LandingPageComponent } from './pages/landing/landing-page/landing-page.component';
import { LoginComponent } from './pages/inicioSesion/login/login.component';

export const routes: Routes = [{
  path:"landing-page",
  component:LandingPageComponent
},{
  path:"login",
  component:LoginComponent
},{
  path:"**",
  component:LandingPageComponent
}];
