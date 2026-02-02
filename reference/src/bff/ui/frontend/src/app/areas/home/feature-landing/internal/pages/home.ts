import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { BasicCard } from '@ht/shared/ui-common/cards/basic-card';
import { PageLayout } from '@ht/shared/ui-common/layouts/page';
import { authEvents } from '@ht/shared/util-auth/auth-events';
import { authStore } from '@ht/shared/util-auth/internal/auth-store';
import { injectDispatch } from '@ngrx/signals/events';

@Component({
  selector: 'ht-home-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageLayout, BasicCard],
  template: `
    <app-ui-page title="Desktop Support">
      @if (auth.isLoggedIn()) {
        <app-ui-card-basic title="Welcome Back">

        </app-ui-card-basic>
      } @else {
        <app-ui-card-basic title="Welcome to Desktop Support">
          <p>Please log in to access your dashboard and support resources.</p>
          <button class="btn btn-primary" (click)="events.loginRequested()">Log In</button>
        </app-ui-card-basic>
      }
    </app-ui-page>
  `,
  styles: ``,
})
export class HomePage {
  auth = inject(authStore);
  events = injectDispatch(authEvents);
}
