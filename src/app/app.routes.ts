import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'tournaments',
    pathMatch: 'full',
  },
  {
    path: 'tournaments',
    loadComponent: () => import('./pages/tournaments/tournaments.page').then( m => m.TournamentsPage)
  },
];
