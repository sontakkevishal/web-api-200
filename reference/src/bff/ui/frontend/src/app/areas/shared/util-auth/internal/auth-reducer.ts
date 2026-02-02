import { authEffectEvents } from '../auth-events';
import { authEvents } from '../auth-events';
import { signalStoreFeature, withState } from '@ngrx/signals';
import { on, withReducer } from '@ngrx/signals/events';
import { User } from './types';
export type UserProfilePersonalInformation = {
  firstName: string;
  lastName: string;
  email: string;
  workPhoneExtension: string;
  personalPhone: string;
};

export type UserProfile = AuthState & {
  version: number;
  createdOn: string;
  personalInfo: UserProfilePersonalInformation | null;
};
type AuthState = {
  user: User | null;
  pendingLogin: boolean;
  profile: UserProfile | null;
};

export function withAuthReducers() {
  return signalStoreFeature(
    withState<AuthState>({
      user: null,
      pendingLogin: false,
      profile: null,
    }),
    withReducer(
      on(authEvents.loginRequested, (state) => ({
        ...state,
        pendingLogin: true,
      })),

      on(authEffectEvents.loginSucceeded, ({ payload }) => ({
        user: { ...payload },
        pendingLogin: false,
      })),
      on(authEffectEvents.logoutSucceeded, () => ({ user: null, pendingLogin: false })),
      on(authEffectEvents.profileLoaded, (payload, state) => ({
        ...state,
        profile: payload.payload,
      })),
    ),
  );
}
