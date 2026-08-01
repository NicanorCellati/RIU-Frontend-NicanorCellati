import { Routes } from '@angular/router';

/**
 * Rutas de la aplicación, con lazy loading por feature: el bundle inicial
 * no incluye el código de heroes hasta que el usuario navega ahí.
 */
export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'heroes' },
  {
    path: 'heroes',
    loadComponent: () =>
      import('./features/heroes/hero-list/hero-list.component').then((m) => m.HeroListComponent),
  },
  { path: '**', redirectTo: 'heroes' },
];
