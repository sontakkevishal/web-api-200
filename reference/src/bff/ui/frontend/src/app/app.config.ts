import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import {
  provideRouter,
  withComponentInputBinding,
  withExperimentalAutoCleanupInjectors,
  withViewTransitions,
} from '@angular/router';

import { provideHttpClient } from '@angular/common/http';
import { icons } from '@ht/shared/ui-common/icons/types';

import { tasksStore } from '@ht/shared/data/stores/tasks/store';
import { provideAppAuth } from '@ht/shared/util-auth/providers';

import { provideIcons } from '@ng-icons/core';
import { routes } from './app.routes';
import { FeaturesStore } from '@ht/shared/util-features/features';
import { FeatureService } from '@ht/shared/util-features/internal/feature-service';
export const appConfig: ApplicationConfig = {
  // are global providers for the entire application.
  // UNLESS someone somewhere adds a provider for it, then they get their own instance.
  providers: [
    provideHttpClient(/*your jwt auth and all that*/),
    provideBrowserGlobalErrorListeners(),
    provideAppAuth(),
    provideRouter(
      routes,
      withViewTransitions(),
      withComponentInputBinding(),
      withExperimentalAutoCleanupInjectors(),
    ),

    tasksStore,
    FeaturesStore,
    FeatureService,
    provideIcons(icons),
  ],
};
