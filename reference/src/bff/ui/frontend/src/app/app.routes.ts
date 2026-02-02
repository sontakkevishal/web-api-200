import { Routes } from '@angular/router';
import { featureEnabledGuard } from '@ht/shared/util-features/guards';

export const routes: Routes = [
  {
    path: 'home',
    loadChildren: () =>
      import('./areas/home/feature-landing/landing.routes').then((r) => r.homeLandingFeatureRoutes),
  },

  {
    path: 'profile',
    loadChildren: () =>
      import('./areas/profile/feature-landing/landing.routes').then(
        (r) => r.profileLandingFeatureRoutes,
      ),
  },

  {
    path: 'tasks',
    loadChildren: () =>
      import('./areas/tasks/feature-list/list-landing/list.routes').then(
        (r) => r.listFeatureRoutes,
      ),
  },

  {
    path: 'software',
    canActivate: [featureEnabledGuard('softwareCenter')],
    loadChildren: () => import('./areas/software/software.routes').then((r) => r.sotwareAreaRoutes),
  },
  {
    path: 'help-desk',
    canActivate: [featureEnabledGuard('helpDesk')],
    loadChildren: () => import('./areas/help/help.routes').then((r) => r.helpDeskRoutes),
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];
