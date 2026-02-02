import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { authStore } from './internal/auth-store';

export function isSoftwareCenter(): CanActivateFn {
  return () => {
    const store = inject(authStore);
    return store.isSoftwareCenterEmployee();
  };
}

export function isManager(): CanActivateFn {
  return () => {
    const store = inject(authStore);
    return store.isSoftwareCenterManager();
  };
}
