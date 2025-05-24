import { APP_INITIALIZER, importProvidersFrom } from '@angular/core';
import { bootstrapApplication, BrowserModule } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { KeycloakAngularModule } from 'keycloak-angular';
import { AppComponent } from './app.component';
import { routes } from './app.routes';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // ✅ Required for Material
import { AngularMaterialModule } from './angular-material/angular-material.module';
import { CommonModule } from '@angular/common';

export const appConfig = {
  providers: [
    provideHttpClient(),
    provideRouter(routes),

    importProvidersFrom(
      CommonModule, // ✅ Required for Angular
      BrowserAnimationsModule, // ✅ Required for Material animations
      AngularMaterialModule, // ✅ Required for Material components
      KeycloakAngularModule,
      
    ),
  ],
};

bootstrapApplication(AppComponent, appConfig);
