import {APP_INITIALIZER, ApplicationConfig, isDevMode, provideZoneChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';
import routeConfig from './app.routes';
import {provideServiceWorker} from '@angular/service-worker';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {HTTP_INTERCEPTORS, provideHttpClient, withFetch, withInterceptorsFromDi} from '@angular/common/http';
import {KeycloakBearerInterceptor, KeycloakService} from 'keycloak-angular';
import {environment} from '../environments/environment';
import {provideAnimations} from '@angular/platform-browser/animations';

function initializeKeycloak(keycloak: KeycloakService) {
  return async () => {
    if (!environment.enableKeycloak) return false;

    return keycloak.init({
      config: {
        realm: `${environment.auth.realm}`,
        url: `${environment.auth.url}`,
        clientId: `${environment.auth.clientId}`
      },
      initOptions: {
        onLoad: 'check-sso',
        silentCheckSsoRedirectUri: window.location.origin + '/assets/silent-check-sso.html'
      },
    });
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({eventCoalescing: true}),
    provideRouter(routeConfig),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000'
    }),
    provideAnimationsAsync(),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService]
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: KeycloakBearerInterceptor,
      multi: true
    },
    KeycloakService,
    provideHttpClient(withFetch(), withInterceptorsFromDi()),
    provideAnimations()
  ]
};
