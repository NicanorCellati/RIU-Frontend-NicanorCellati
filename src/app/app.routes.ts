import { Routes } from '@angular/router';

/**
 * Rutas de la aplicación, con lazy loading por feature.
 */
export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'heroes' },
  {
    path: 'heroes',
    loadComponent: () =>
      import('./features/heroes/hero-list/hero-list.component').then((m) => m.HeroListComponent),
  },
  {
    path: 'heroes/nuevo',
    loadComponent: () =>
      import('./features/heroes/hero-form/hero-form.component').then((m) => m.HeroFormComponent),
  },
  {
    path: 'heroes/:id/editar',
    loadComponent: () =>
      import('./features/heroes/hero-form/hero-form.component').then((m) => m.HeroFormComponent),
  },
  { path: '**', redirectTo: 'heroes' },
];
