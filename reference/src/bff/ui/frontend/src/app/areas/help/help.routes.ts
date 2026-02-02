import { Routes } from '@angular/router';
export const helpDeskRoutes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./feature-desk/desk-landing/desk.routes').then((r) => r.deskFeatureRoutes),
  },
];
