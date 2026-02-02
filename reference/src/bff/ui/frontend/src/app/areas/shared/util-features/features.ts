import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { mapResponse, tapResponse } from '@ngrx/operators';
import { rxMethod } from '@ngrx/signals/rxjs-interop';

import {
  patchState,
  signalStore,
  withHooks,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import {
  eventGroup,
  Events,
  injectDispatch,
  on,
  withEventHandlers,
  withReducer,
} from '@ngrx/signals/events';

import { map, mergeMap, pipe, tap } from 'rxjs';

import { createFeatureEvents } from './feature-events';
import { FeatureService } from './internal/feature-service';

export type FeaturesState = {
  softwareCenter: boolean;
  helpDesk: boolean;
};
const initialState: FeaturesState = {
  softwareCenter: false,
  helpDesk: false,
};

export const featureEvents = eventGroup({
  source: 'Feature Events',
  events: createFeatureEvents(initialState),
});

export const FeaturesStore = signalStore(
  withDevtools('features'),
  withState<FeaturesState>(initialState),
  withProps((store) => {
    const router = inject(Router);
    const evts = injectDispatch(featureEvents);
    return {
      _route: router.currentNavigation,
      _router: router,
      _events: evts,
    };
  }),
  withMethods((store) => {
    const svc = inject(FeatureService);
    return {
      _start: rxMethod<void>(
        pipe(
          mergeMap(() =>
            svc.feature$.pipe(
              tapResponse({
                next: (s) => patchState(store, s),
                error: (err) => console.error('Error starting feature store', err),
              }),
            ),
          ),
        ),
      ),
    };
  }),

  withEventHandlers((_, events = inject(Events), router = inject(Router)) => ({
    handleHelpDesk$: events.on(featureEvents.featureHelpDeskDisabled).pipe(
      tapResponse({
        next: (e) => router.navigate(['/']),
        error: (err) => console.error('Error navigating due to feature flag change', err),
      }),
    ),
    handleSoftwareCenter$: events.on(featureEvents.featureSoftwareCenterDisabled).pipe(
      tapResponse({
        next: (e) => router.navigate(['/']),
        error: (err) => console.error('Error navigating due to feature flag change', err),
      }),
    ),
  })),
  withHooks({
    onInit(store) {
      store._start();
    },
  }),
);
