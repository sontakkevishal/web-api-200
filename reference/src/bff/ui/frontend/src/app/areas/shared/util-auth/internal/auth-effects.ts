// import { appErrorEvents } from '../../errors/error-events';
import { authEffectEvents, authEvents } from '../auth-events';

import { inject } from '@angular/core';
import { mapResponse } from '@ngrx/operators';
import { signalStoreFeature } from '@ngrx/signals';
import { Events, injectDispatch, withEventHandlers } from '@ngrx/signals/events';
import { map, mergeMap, switchMap, tap } from 'rxjs';
import { AuthApi } from './auth-api';

export function withAuthEffects() {
  return signalStoreFeature(
    withEventHandlers(
      (
        _,
        events = inject(Events),
        api = inject(AuthApi),
        //  errorEvents = injectDispatch(appErrorEvents),
      ) => ({
        login$: events.on(authEvents.loginRequested).pipe(tap(() => api.login())),
        checkAuth$: events.on(authEvents.checkAuth).pipe(
          switchMap(() =>
            api.getUser().pipe(
              mapResponse({
                next(value) {
                  if (value.isAuthenticated) {
                    return authEffectEvents.loginSucceeded(value);
                  } else {
                    return authEffectEvents.logoutSucceeded();
                  }
                },
                error(e) {
                  return authEffectEvents.loginFailed({
                    errorMessage: 'Login Failed',
                    error: e,
                  });
                },
              }),
            ),
          ),
        ),
        handleLogout$: events.on(authEvents.logoutRequested).pipe(tap(() => api.logOut())),
        loadProfile$: events
          .on(authEffectEvents.loginSucceeded, authEffectEvents.profileUpdated)
          .pipe(
            mergeMap(() =>
              api.getProfile().pipe(
                mapResponse({
                  next(profile) {
                    // Here you might want to dispatch another event to store the profile
                    // For example: return authEffectEvents.profileLoaded(profile);
                    return authEffectEvents.profileLoaded(profile);
                  },
                  error(e) {
                    // Handle profile load error if necessary
                    console.error('Failed to load profile', e);
                  },
                }),
              ),
            ),
          ),

        // handleLoginFailed$: events.on(authEffectEvents.loginFailed).pipe(
        //   map((a) => {
        //     errorEvents.setError({
        //       error: `Could Not Log You In`,
        //       feature: 'auth',
        //       originalError: a.payload.error,
        //     });
        //     errorEvents.setError({
        //       error: `Please try again later.`,
        //       feature: 'auth',
        //     });
        //   }),
        // ),
      }),
    ),
  );
}
