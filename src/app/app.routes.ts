import { Routes } from '@angular/router';

import { AuthGuard } from './auth.guard';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { KeycloakAuthComponent } from './keycloak-auth/keycloak-auth.component';

export const routes: Routes = [
  {
    path: '',
    component: LoginComponent, // Public route, no guard
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    // canActivate: [AuthGuard], // Protected route with AuthGuard
    // data: { roles: ['user', 'admin'] }, // Example roles required
  },
  {
    path: 'admin',
    component: KeycloakAuthComponent,
    // canActivate: [AuthGuard], // Admin only route
    data: { roles: ['admin'] },
  },
  {
    path: '**',
    redirectTo: '',
  },
];
