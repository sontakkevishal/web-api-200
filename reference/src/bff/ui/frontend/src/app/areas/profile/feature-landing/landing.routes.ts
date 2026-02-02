import { Routes } from '@angular/router';
import { Home } from './internal/home';
import { HomePage } from './internal/pages/home';
import { PersonalInformationPage } from './internal/pages/profile';
export const profileLandingFeatureRoutes: Routes = [
  {
    path: '',
    component: Home,
    children: [
      {
        path: '',
        component: HomePage,
      },
      {
        path: 'personal-information',
        component: PersonalInformationPage,
      },
    ],
  },
];
