import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/dashboard/dashboard').then((m) => m.Dashboard),
  },
  {
    path: 'endpoints',
    loadComponent: () => import('./features/endpoints/endpoints').then((m) => m.Endpoints),
  },
];
