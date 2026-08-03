import { EnvironmentProviders, importProvidersFrom } from '@angular/core';
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryDataService } from './in-memory-data.service';

/**
 * angular-in-memory-web-api todavía se distribuye como NgModule
 * (InMemoryWebApiModule.forRoot). Este helper lo adapta al estilo
 * standalone de Angular 20 vía importProvidersFrom(), para no tener
 * que introducir un único NgModule en un proyecto que es standalone
 * en todo lo demás.
 */
export function provideInMemoryWebApi(): EnvironmentProviders {
  return importProvidersFrom(
    InMemoryWebApiModule.forRoot(InMemoryDataService, {
      delay: 300, // latencia simulada, para que loading-bar tenga sentido de mostrarse
      passThruUnknownUrl: true,
      apiBase: 'api/', // debe coincidir con la URL base usada en SuperHeroService ('api/heroes')
    }),
  );
}