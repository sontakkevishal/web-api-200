import { httpMutation, withDevtools, withMutations } from '@angular-architects/ngrx-toolkit';
import { withAuthEffects } from './auth-effects';
import { UserProfilePersonalInformation, withAuthReducers } from './auth-reducer';
import { computed } from '@angular/core';
import { signalStore, withComputed } from '@ngrx/signals';
import { injectDispatch } from '@ngrx/signals/events';
import { authEffectEvents } from '../auth-events';

export const authStore = signalStore(
  withAuthEffects(),
  withAuthReducers(),
  withDevtools('auth'),
  withMutations((store) => {
    const eventDispatch = injectDispatch(authEffectEvents);
    return {
      updateProfile: httpMutation({
        request: (payload: UserProfilePersonalInformation) => ({
          url: `/api/user/personal-info`,
          method: 'PUT',
          body: payload,
        }),
        onSuccess: () => eventDispatch.profileUpdated(),
      }),
    };
  }),
  withComputed((store) => ({
    isLoggedIn: computed(() => store.user()?.isAuthenticated === true),
    userName: computed(() => store.user()?.sub),
    isSoftwareCenterEmployee: computed(() => {
      const user = store.user();
      if (!user || !user.isAuthenticated) {
        return false;
      }
      const roleClaims = user.claims
        .filter((c) => c.type === 'role')
        .map((c) => c.value.toLowerCase());
      return roleClaims.includes('softwarecenter');
    }),
    isSoftwareCenterManager: computed(() => {
      const user = store.user();
      if (!user || !user.isAuthenticated) {
        return false;
      }
      const roleClaims = user.claims
        .filter((c) => c.type === 'role')
        .map((c) => c.value.toLowerCase());
      return roleClaims.includes('softwarecenter') && roleClaims.includes('manager');
    }),
  })),
);
