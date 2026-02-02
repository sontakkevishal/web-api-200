import { Component, inject, input } from '@angular/core';
import { Route, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Icon } from '../icons/icon';
import { authStore } from '@ht/shared/util-auth/internal/auth-store';
import { authEvents } from '@ht/shared/util-auth/auth-events';
import { injectDispatch } from '@ngrx/signals/events';
export type SectionLink = Pick<Route, 'path' | 'title'>;
@Component({
  selector: 'app-ui-section-layout',

  template: `
    <!-- Navbar -->
    <nav class="navbar w-full bg-linear-to-r from-base-300 to-base-200">
      <div class="flex flex-row gap-2 justify-items-center items-center">
        <label for="my-drawer-4" aria-label="open sidebar" class="btn btn-circle btn-ghost btn-sm">
          <!-- Sidebar toggle icon -->
          <app-ui-icon name="lucideChevronsUpDown" class="size-4 rotate-90" />
        </label>
        <a
          routerLink="."
          class=" text-base-content font-bold btn btn-ghost mr-2"
          [routerLinkActive]="['btn-active']"
          [routerLinkActiveOptions]="{ exact: true }"
          >{{ title() }}</a
        >
        @if (links() && links()!.length > 0) {
          <div class="flex-1">
            <ul class="flex flex-row gap-2 justify-items-end items-end">
              @for (link of links(); track link.path) {
                <li>
                  <a
                    [routerLink]="link.path"
                    class="font-extralight text-xs btn btn-ghost btn-sm"
                    routerLinkActive="btn-active"
                    >{{ link.title }}</a
                  >
                </li>
              }
            </ul>
          </div>
        }
      </div>

          <div class="ml-auto">
      @if(authState.isLoggedIn()) {
        <button class="btn btn-xs btn-warning" (click)="authDispatch.logoutRequested()">Log Out</button>
      } @else {
        <button class="btn btn-xs btn-primary" (click)="authDispatch.loginRequested()">Log In</button>
      }
    </div>
    </nav>
    <!-- Page content here -->
    <div class="flex flex-col items-stretch justify-items-stretch h-full"><router-outlet /></div>
  `,
  imports: [RouterOutlet, Icon, RouterLink, RouterLinkActive],
})
export class SectionLayout {
  title = input.required<string>();
  links = input<Array<SectionLink> | null>(null);
  protected authDispatch = injectDispatch(authEvents);
  authState = inject(authStore)
}
