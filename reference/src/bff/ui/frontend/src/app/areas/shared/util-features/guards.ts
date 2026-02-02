import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { FeaturesState, FeaturesStore } from './features';

export function featureEnabledGuard(featureFlag: keyof FeaturesState): CanActivateFn {
  return () => {
    const store = inject(FeaturesStore);
    return store[featureFlag]();
  };
}
