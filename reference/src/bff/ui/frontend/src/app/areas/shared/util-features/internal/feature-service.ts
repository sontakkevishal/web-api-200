import { injectDispatch } from '@ngrx/signals/events';
import { FlagdWebProvider } from '@openfeature/flagd-web-provider';
import {
  OpenFeature,
  ProviderEvents,
  throwAggregateErrorFromPromiseResults,
} from '@openfeature/web-sdk';

import { BehaviorSubject, from, of } from 'rxjs';
import { featureEvents, FeaturesState } from '../features';
import { effect, signal } from '@angular/core';

export class FeatureService {
  protected eventDispatcher = injectDispatch(featureEvents);
  #started = signal(false);
  feature$ = new BehaviorSubject<FeaturesState>({
    softwareCenter: false,
    helpDesk: false,
  });

  constructor() {
    this.watch().then((r) => {
      this.feature$.next(r);
    });
  }
  client = OpenFeature.getClient('frontend');

  async watch() {
    if (!this.#started()) {
      await this.start();
    }
    const isSoftwareEnabled = await this.client.getBooleanValue('software-center', false);

    const isHelpdeskEnabled = await this.client.getBooleanValue('help-desk', false);

    return {
      softwareCenter: isSoftwareEnabled,
      helpDesk: isHelpdeskEnabled,
    } satisfies FeaturesState;
  }

  async start() {
    try {
      await OpenFeature.setProviderAndWait(
        new FlagdWebProvider({
          host: window.location.hostname,
          port: +window.location.port,
          pathPrefix: 'api/features',

          tls: true,
          maxRetries: 10,
          maxDelay: 50000,
        }),
      );
      this.#started.set(true);
      this.client.addHandler(ProviderEvents.ConfigurationChanged, async () => {
        const isSoftwareEnabled = await this.client.getBooleanValue('software-center', false);

        const isHelpdeskEnabled = await this.client.getBooleanValue('help-desk', false);

        if (!isHelpdeskEnabled) {
          this.eventDispatcher.featureHelpDeskDisabled();
        }
        if (!isSoftwareEnabled) {
          this.eventDispatcher.featureSoftwareCenterDisabled();
        }
        this.feature$.next({
          softwareCenter: isSoftwareEnabled,
          helpDesk: isHelpdeskEnabled,
        } satisfies FeaturesState);
      });
    } catch (error) {
      console.error('Error setting FlagdWebProvider:', error);
    }
  }
}
