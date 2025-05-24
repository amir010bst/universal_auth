import { KeycloakOptions } from 'keycloak-angular';

export const keycloakConfig: KeycloakOptions = {
  config: {
   url: 'http://localhost:8080/',
    realm: 'master',
    clientId: 'universal_auth_app'
  },
  initOptions: {
    onLoad: 'login-required',
    checkLoginIframe: true,
    enableLogging: true,
  },
  enableBearerInterceptor: true,
  bearerPrefix: 'Bearer',
  bearerExcludedUrls: ['/assets'],
};
