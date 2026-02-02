import { type } from '@ngrx/signals';

// Mapped type to transform state properties into event names
type FeatureEnabledNames<T> = {
  [K in keyof T as `feature${Capitalize<string & K>}Enabled`]: ReturnType<typeof type<void>>;
};
type FeatureDisabledNames<T> = {
  [K in keyof T as `feature${Capitalize<string & K>}Disabled`]: ReturnType<typeof type<void>>;
};
type FeatureEventNames<T> = FeatureEnabledNames<T> & FeatureDisabledNames<T>;

export function createFeatureEvents<T extends Record<string, unknown>>(
  state: T,
): FeatureEventNames<T> {
  return Object.keys(state).reduce((acc, key) => {
    const eventEnabledName =
      `feature${key.charAt(0).toUpperCase()}${key.slice(1)}Enabled` as keyof FeatureEventNames<T>;
    (acc as Record<string, unknown>)[eventEnabledName] = type<void>();
    const eventDisabledName =
      `feature${key.charAt(0).toUpperCase()}${key.slice(1)}Disabled` as keyof FeatureEventNames<T>;
    (acc as Record<string, unknown>)[eventDisabledName] = type<void>();

    return acc;
  }, {}) as FeatureEventNames<T>;
}
