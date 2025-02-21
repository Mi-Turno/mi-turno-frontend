import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http'; // Agrega `withInterceptors`
import { AuthInterceptor } from './core/guards/auth/auth.interceptor';
import { pendingRequestsInterceptor$ } from 'ng-http-loader';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { CustomMatPaginatorIntl } from './shared/utils/CustomPaginatorIntl';
// Asegúrate de cambiar la ruta

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(
      withInterceptors([AuthInterceptor, pendingRequestsInterceptor$]) // Aquí añades el interceptor
    ),
    // Aquí añades el proveedor de tu CustomMatPaginatorIntl
    { provide: MatPaginatorIntl, useClass: CustomMatPaginatorIntl }, 
  ]
};
