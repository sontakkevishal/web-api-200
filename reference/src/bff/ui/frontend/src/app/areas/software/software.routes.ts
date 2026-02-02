import { Routes } from '@angular/router';
export const sotwareAreaRoutes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./feature-catalog/catalog-landing/catalog.routes').then(
        (r) => r.catalogFeatureRoutes,
      ),
  },
];
