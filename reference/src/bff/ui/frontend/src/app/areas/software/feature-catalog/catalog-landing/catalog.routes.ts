import { Routes } from '@angular/router';
import { Home } from './internal/home';
import { HomePage } from './internal/pages/home';
import { SearchPage } from './internal/pages/search';
import { AddSoftwarePage } from './internal/pages/software/add';
import { ListSoftwarePage } from './internal/pages/software/list';
import { SoftwarePage } from './internal/pages/software/software';
import { AddVendorPage } from './internal/pages/vendors/add';
import { ListPage } from './internal/pages/vendors/list';
import { VendorsPage } from './internal/pages/vendors/vendors';
import { isManager, isSoftwareCenter } from '@ht/shared/util-auth/guards';

export const catalogFeatureRoutes: Routes = [
  {
    path: '',
    providers: [],
    component: Home,
    children: [
      {
        path: '',
        component: HomePage,
      },
      {
        path: 'search',
        component: SearchPage,
      },
      {
        path: 'vendors',
        component: VendorsPage,
        children: [
          { path: 'add', component: AddVendorPage, canActivate: [isSoftwareCenter(), isManager()] },
          { path: 'list', component: ListPage },
          { path: '**', redirectTo: 'list', pathMatch: 'full' },
        ],
      },
      {
        path: 'software',
        component: SoftwarePage,
        children: [
          {
            path: 'list',
            component: ListSoftwarePage,
          },
          {
            path: 'add',
            component: AddSoftwarePage,
            canActivate: [isSoftwareCenter()],
          },
          { path: '**', redirectTo: 'list', pathMatch: 'full' },
        ],
      },
    ],
  },
];
