import {ApplicationConfig, isDevMode, provideZoneChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';
import routeConfig from "./app.routes";
import {provideServiceWorker} from '@angular/service-worker';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routeConfig), provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000'
    })
  ]
};
