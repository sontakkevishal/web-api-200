import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';

import { AuthApi } from './internal/auth-api';
import { authStore } from './internal/auth-store';
import { AuthState } from './auth-state';

export function provideAppAuth(): EnvironmentProviders {
  return makeEnvironmentProviders([
    authStore,
    { provide: AuthApi, useClass: AuthApi },
    { provide: AuthState, useClass: AuthState },
  ]);
}
