import { Injectable } from '@angular/core';
import { Observable, from, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

// Define a simplified interface for the simulated Keycloak instance
// In a real Angular app, you would use the types from 'keycloak-js'
interface SimulatedKeycloakInstance {
  token: string | null;
  idToken: string | null;
  refreshToken: string | null;
  authenticated: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  register: () => Promise<void>;
  accountManagement: () => void;
  hasRealmRole: (role: string) => boolean;
  hasResourceRole: (role: string, resource: string) => boolean;
  loadUserProfile: () => Promise<any>;
  updateToken: (minValidity: number) => Promise<boolean>;
  clearToken: () => void;
  isTokenExpired: () => boolean;
  loadUserInfo: () => Promise<any>;
  createLoginUrl: () => string;
  createLogoutUrl: () => string;
  createRegisterUrl: () => string;
  createAccountUrl: () => string;
  getKeycloakInstance: () => any; // Should return the actual Keycloak instance if available
  onReady: () => Promise<boolean>;
}

@Injectable({
  providedIn: 'root' // Makes the service a singleton and available throughout the app
})
export class KeycloakService {
  private keycloak: SimulatedKeycloakInstance | null = null;

  // Keycloak configuration
  private config = {
    url: 'http://localhost:8080', // Replace with your Keycloak server URL
    realm: 'master',
    clientId: 'universal_auth_app'   // Replace with your Keycloak client ID
  };

  constructor() { }

  /**
   * Initializes the Keycloak client.
   * In a real Angular app, this would load the 'keycloak-js' library
   * and initialize the Keycloak instance.
   * @returns A Promise that resolves to true if initialization is successful, false otherwise.
   */
  init(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const simulatedLogin = true; // Change to false to test the failure case.

        if (simulatedLogin) {
          this.keycloak = {
            token: 'dummy-token-123',
            idToken: 'dummy-id-token-456',
            refreshToken: 'dummy-refresh-token-789',
            authenticated: true,
            login: () => Promise.resolve(),
            logout: () => Promise.resolve(),
            register: () => Promise.resolve(),
            accountManagement: () => { console.log('Simulated account management redirect'); },
            hasRealmRole: (role: string) => role === 'realm-user',
            hasResourceRole: (role: string, resource: string) => role === 'resource-user' && resource === 'my-angular-client',
            loadUserProfile: () => Promise.resolve({
              firstName: 'John',
              lastName: 'Doe',
              email: 'john.doe@example.com',
              username: 'johndoe'
            }),
            updateToken: (minValidity: number) => {
              return new Promise((res, rej) => {
                setTimeout(() => {
                  if (Math.random() < 0.8) { // Simulate 80% success rate
                    if (this.keycloak) {
                      this.keycloak.token = 'updated-token-' + Math.random().toString(36).substring(7);
                    }
                    res(true); // Token refreshed
                  } else {
                    rej(false); // Token refresh failed
                  }
                }, 500);
              });
            },
            clearToken: () => {
              if (this.keycloak) {
                this.keycloak.token = null;
                this.keycloak.idToken = null;
                this.keycloak.refreshToken = null;
                this.keycloak.authenticated = false;
              }
            },
            isTokenExpired: () => false,
            loadUserInfo: () => Promise.resolve({
              sub: 'user-id-123',
              name: 'John Doe',
              given_name: 'John',
              family_name: 'Doe',
              email: 'john.doe@example.com'
            }),
            createLoginUrl: () => 'http://example.com/login',
            createLogoutUrl: () => 'http://example.com/logout',
            createRegisterUrl: () => 'http://example.com/register',
            createAccountUrl: () => 'http://example.com/account',
            getKeycloakInstance: () => this.keycloak,
            onReady: () => Promise.resolve(true),
          };
          resolve(true);
        } else {
          this.keycloak = {
            token: null,
            idToken: null,
            refreshToken: null,
            authenticated: false,
            login: () => Promise.reject(new Error("Simulated Login Error")),
            logout: () => Promise.resolve(),
            register: () => Promise.resolve(),
            accountManagement: () => { },
            hasRealmRole: (role: string) => false,
            hasResourceRole: (role: string, resource: string) => false,
            loadUserProfile: () => Promise.resolve({}),
            updateToken: (minValidity: number) => Promise.reject(false),
            clearToken: () => { },
            isTokenExpired: () => true,
            loadUserInfo: () => Promise.resolve({}),
            createLoginUrl: () => 'http://example.com/login',
            createLogoutUrl: () => 'http://example.com/logout',
            createRegisterUrl: () => 'http://example.com/register',
            createAccountUrl: () => 'http://example.com/account',
            getKeycloakInstance: () => null,
            onReady: () => Promise.resolve(false),
          };
          reject(new Error('Failed to initialize Keycloak (Simulated)'));
        }
      }, 500);
    });
  }

  /**
   * Initiates the Keycloak login flow.
   * @returns A Promise that resolves when login is successful.
   */
  login(): Promise<void> {
    if (!this.keycloak) {
      return Promise.reject(new Error('Keycloak not initialized.'));
    }
    return this.keycloak.login();
  }

  /**
   * Initiates the Keycloak logout flow.
   * @returns A Promise that resolves when logout is successful.
   */
  logout(): Promise<void> {
    if (!this.keycloak) {
      return Promise.reject(new Error('Keycloak not initialized.'));
    }
    return this.keycloak.logout();
  }

  /**
   * Initiates the Keycloak registration flow.
   * @returns A Promise that resolves when registration is successful.
   */
  register(): Promise<void> {
    if (!this.keycloak) {
      return Promise.reject(new Error('Keycloak not initialized.'));
    }
    return this.keycloak.register();
  }

  /**
   * Checks if the user is authenticated.
   * @returns True if authenticated, false otherwise.
   */
  isAuthenticated(): boolean {
    return this.keycloak ? this.keycloak.authenticated : false;
  }

  /**
   * Gets the current access token.
   * @returns The access token string or null if not authenticated.
   */
  getToken(): string | null {
    return this.keycloak ? this.keycloak.token : null;
  }

  /**
   * Gets the current ID token.
   * @returns The ID token string or null.
   */
  getIdToken(): string | null {
    return this.keycloak ? this.keycloak.idToken : null;
  }

  /**
   * Gets the current refresh token.
   * @returns The refresh token string or null.
   */
  getRefreshToken(): string | null {
    return this.keycloak ? this.keycloak.refreshToken : null;
  }

  /**
   * Checks if the user has a specific realm role.
   * @param role The realm role to check.
   * @returns True if the user has the role, false otherwise.
   */
  hasRealmRole(role: string): boolean {
    return this.keycloak ? this.keycloak.hasRealmRole(role) : false;
  }

  /**
   * Checks if the user has a specific resource role for a given client.
   * @param role The resource role to check.
   * @param resource The client ID (resource).
   * @returns True if the user has the role for the resource, false otherwise.
   */
  hasResourceRole(role: string, resource: string): boolean {
    return this.keycloak ? this.keycloak.hasResourceRole(role, resource) : false;
  }

  /**
   * Loads the user's profile.
   * @returns A Promise that resolves with the user profile object.
   */
  loadUserProfile(): Promise<any> {
    if (!this.keycloak) {
      return Promise.reject(new Error('Keycloak not initialized.'));
    }
    return this.keycloak.loadUserProfile();
  }

  /**
   * Redirects to Keycloak account management page.
   */
  accountManagement(): void {
    if (!this.keycloak) {
      throw new Error('Keycloak not initialized.');
    }
    this.keycloak.accountManagement();
  }

  /**
   * Updates the Keycloak token if it's nearing expiration.
   * @param minValidity Minimum validity in seconds.
   * @returns A Promise that resolves to true if the token was refreshed, false otherwise.
   */
  updateToken(minValidity: number): Promise<boolean> {
    if (!this.keycloak) {
      return Promise.reject(new Error('Keycloak not initialized.'));
    }
    return this.keycloak.updateToken(minValidity);
  }

  /**
   * Clears all Keycloak tokens from the session.
   */
  clearToken(): void {
    if (!this.keycloak) {
      console.warn('Keycloak not initialized, cannot clear token.');
      return;
    }
    this.keycloak.clearToken();
  }

  /**
   * Checks if the current token is expired.
   * @returns True if the token is expired, false otherwise.
   */
  isTokenExpired(): boolean {
    return this.keycloak ? this.keycloak.isTokenExpired() : true;
  }

  /**
   * Loads the user's info from the userinfo endpoint.
   * @returns A Promise that resolves with the user info object.
   */
  loadUserInfo(): Promise<any> {
    if (!this.keycloak) {
      return Promise.reject(new Error('Keycloak not initialized.'));
    }
    return this.keycloak.loadUserInfo();
  }

  /**
   * Creates a login URL.
   * @returns The login URL string.
   */
  createLoginUrl(): string {
    return this.keycloak ? this.keycloak.createLoginUrl() : '';
  }

  /**
   * Creates a logout URL.
   * @returns The logout URL string.
   */
  createLogoutUrl(): string {
    return this.keycloak ? this.keycloak.createLogoutUrl() : '';
  }

  /**
   * Creates a registration URL.
   * @returns The registration URL string.
   */
  createRegisterUrl(): string {
    return this.keycloak ? this.keycloak.createRegisterUrl() : '';
  }

  /**
   * Creates an account management URL.
   * @returns The account management URL string.
   */
  createAccountUrl(): string {
    return this.keycloak ? this.keycloak.createAccountUrl() : '';
  }

  /**
   * Returns the underlying Keycloak instance.
   * Useful for advanced operations not covered by the service methods.
   * @returns The Keycloak instance or null.
   */
  getKeycloakInstance(): any {
    return this.keycloak ? this.keycloak.getKeycloakInstance() : null;
  }

  /**
   * Simulates the onReady event from Keycloak.
   * @returns A Promise that resolves when Keycloak is ready.
   */
  onReady(): Promise<boolean> {
    return this.keycloak ? this.keycloak.onReady() : Promise.resolve(false);
  }
}
