import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common'; // Required for ngIf, ngFor etc.

import { FormsModule } from '@angular/forms'; // For any form elements if needed later
import { KeycloakService } from '../services/keycloak.service';

@Component({
  selector: 'app-keycloak-auth',
  standalone: true, // Angular 17+ standalone component
  imports: [CommonModule, FormsModule],
  templateUrl: './keycloak-auth.component.html',
  styleUrls: ['./keycloak-auth.component.scss']
})
export class KeycloakAuthComponent implements OnInit, OnDestroy {
  keycloakInitialized = false;
  isAuthenticated = false;
  userProfile: any = null;
  userInfo: any = null;
  token: string | null = null;
  idToken: string | null = null;
  refreshToken: string | null = null;
  error: string | null = null;

  constructor(private keycloakService: KeycloakService) { }

  async ngOnInit(): Promise<void> {
    try {
      // Initialize Keycloak service
      await this.keycloakService.init();
      this.keycloakInitialized = true;
      this.isAuthenticated = this.keycloakService.isAuthenticated();

      if (this.isAuthenticated) {
        // Fetch tokens and user data if authenticated
        this.token = this.keycloakService.getToken();
        this.idToken = this.keycloakService.getIdToken();
        this.refreshToken = this.keycloakService.getRefreshToken();
        this.userProfile = await this.keycloakService.loadUserProfile();
        this.userInfo = await this.keycloakService.loadUserInfo();
      }
      this.error = null; // Clear any previous errors on successful init
    } catch (err: any) {
      this.error = err.message || 'Failed to initialize Keycloak.';
      this.keycloakInitialized = true; // Set to true even on error to stop loading indicator
    }
  }

  ngOnDestroy(): void {
    // Clean up any subscriptions or listeners if necessary
    // For Keycloak, typically no explicit cleanup needed here unless you added custom listeners
  }

  /**
   * Handles the login action.
   */
  async login(): Promise<void> {
    try {
      await this.keycloakService.login();
      this.isAuthenticated = true;
      this.token = this.keycloakService.getToken();
      this.idToken = this.keycloakService.getIdToken();
      this.refreshToken = this.keycloakService.getRefreshToken();
      this.userProfile = await this.keycloakService.loadUserProfile();
      this.userInfo = await this.keycloakService.loadUserInfo();
      this.error = null;
    } catch (err: any) {
      this.error = err.message || 'Login failed.';
      this.isAuthenticated = false;
    }
  }

  /**
   * Handles the logout action.
   */
  async logout(): Promise<void> {
    try {
      await this.keycloakService.logout();
      this.isAuthenticated = false;
      this.token = null;
      this.idToken = null;
      this.refreshToken = null;
      this.userProfile = null;
      this.userInfo = null;
      this.error = null;
    } catch (err: any) {
      this.error = err.message || 'Logout failed.';
    }
  }

  /**
   * Handles the registration action.
   */
  async register(): Promise<void> {
    try {
      await this.keycloakService.register();
      this.error = null;
    } catch (error: any) {
      this.error = error.message || "Registration Failed";
    }
  }

  /**
   * Redirects to Keycloak account management.
   */
  accountManagement(): void {
    try {
      this.keycloakService.accountManagement();
      this.error = null;
    } catch (error: any) {
      this.error = error.message || "Account Management Failed";
    }
  }

  /**
   * Checks if the user has specific roles.
   */
  checkRoles(): void {
    if (this.keycloakService.hasRealmRole('realm-user')) {
      alert('User has the realm role: realm-user');
    } else {
      alert('User does not have the realm role: realm-user');
    }

    if (this.keycloakService.hasResourceRole('resource-user', this.keycloakService['config'].clientId)) {
      alert(`User has the resource role: resource-user for client: ${this.keycloakService['config'].clientId}`);
    } else {
      alert(`User does not have the resource role: resource-user for client: ${this.keycloakService['config'].clientId}`);
    }
  }

  /**
   * Fetches and displays the user profile.
   */
  async getProfile(): Promise<void> {
    try {
      this.userProfile = await this.keycloakService.loadUserProfile();
      this.error = null;
    } catch (error: any) {
      this.error = error.message || "Failed to load user profile";
    }
  }

  /**
   * Refreshes the Keycloak token.
   */
  async getRefreshToken(): Promise<void> {
    try {
      const refreshed = await this.keycloakService.updateToken(5); // Minimum validity of 5 seconds
      if (refreshed) {
        this.token = this.keycloakService.getToken();
        this.refreshToken = this.keycloakService.getRefreshToken();
        alert('Token refreshed successfully!');
      } else {
        alert('Token refresh failed.');
      }
      this.error = null;
    } catch (error: any) {
      this.error = error.message || "Token refresh failed";
    }
  }

  /**
   * Clears all Keycloak tokens.
   */
  clearTokens(): void {
    this.keycloakService.clearToken();
    this.token = null;
    this.idToken = null;
    this.refreshToken = null;
    this.isAuthenticated = false;
    alert('Tokens cleared.');
  }

  /**
   * Checks if the current token is expired.
   */
  isTokenExpired(): void {
    const expired = this.keycloakService.isTokenExpired();
    alert(`Is Token Expired: ${expired}`);
  }

  /**
   * Fetches and displays user info.
   */
  async getUserInfo(): Promise<void> {
    try {
      this.userInfo = await this.keycloakService.loadUserInfo();
      this.error = null;
    } catch (error: any) {
      this.error = error.message || "Failed to load user info";
    }
  }

  /**
   * Displays the login URL.
   */
  createLoginUrl(): void {
    const url = this.keycloakService.createLoginUrl();
    alert(`Login URL: ${url}`);
  }

  /**
   * Displays the logout URL.
   */
  createLogoutUrl(): void {
    const url = this.keycloakService.createLogoutUrl();
    alert(`Logout URL: ${url}`);
  }

  /**
   * Displays the registration URL.
   */
  createRegisterUrl(): void {
    const url = this.keycloakService.createRegisterUrl();
    alert(`Register URL: ${url}`);
  }

  /**
   * Displays the account management URL.
   */
  createAccountUrl(): void {
    const url = this.keycloakService.createAccountUrl();
    alert(`Account URL: ${url}`);
  }

  /**
   * Logs the Keycloak instance to the console.
   */
  getKeycloakInstance(): void {
    const instance = this.keycloakService.getKeycloakInstance();
    if (instance) {
      alert('Keycloak instance available. Check console for details.');
      console.log('Keycloak Instance:', instance);
    } else {
      alert('Keycloak instance is null.');
    }
  }

  /**
   * Checks if Keycloak is ready.
   */
  async onReady(): Promise<void> {
    const ready = await this.keycloakService.onReady();
    alert(`Keycloak onReady: ${ready}`);
  }
}
