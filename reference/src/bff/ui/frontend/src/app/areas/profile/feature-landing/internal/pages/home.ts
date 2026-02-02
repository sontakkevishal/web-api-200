import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { PageLayout } from '@ht/shared/ui-common/layouts/page';

import { RouterLink } from '@angular/router';
import { DataDisplayCard } from '@ht/shared/ui-common/data-display/card';
import { CardItemText } from '@ht/shared/ui-common/data-display/card-item-text';
import { authEvents } from '@ht/shared/util-auth/auth-events';
import { authStore } from '@ht/shared/util-auth/internal/auth-store';
import { injectDispatch } from '@ngrx/signals/events';

@Component({
  selector: 'app-profile-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageLayout, DataDisplayCard, CardItemText, RouterLink],
  template: `
    <app-ui-page title="Your Profile">
      @if (authState.isLoggedIn()) {
        <div class="flex flex-row justify-end mb-4">
          @if (authState.isSoftwareCenterEmployee()) {
            <span class="badge badge-success rounded-2xl">SoftwareCenter Role</span>
          }
          @if (authState.isSoftwareCenterManager()) {
            <span class="badge badge-primary rounded-2xl ml-2">Manager Role</span>
          }
        </div>
        <app-ui-data-display-card title="Your User Information" subTitle="What We Track About You">
          @if (authState.profile()) {
            @let profile = authState.profile();
            <app-ui-data-display-card-text-item
              data-test="profile-first-name"
              label="First Name"
              [value]="profile?.personalInfo?.firstName ?? 'N/A'"
            ></app-ui-data-display-card-text-item>
            <app-ui-data-display-card-text-item
              data-test="profile-last-name"
              label="Last Name"
              [value]="profile?.personalInfo?.lastName ?? 'N/A'"
            ></app-ui-data-display-card-text-item>
            <app-ui-data-display-card-text-item
              data-test="profile-email"
              label="Email Address"
              [value]="profile?.personalInfo?.email ?? 'N/A'"
            ></app-ui-data-display-card-text-item>
            <app-ui-data-display-card-text-item
              data-test="profile-work-phone-extension"
              label="Work Phone Extension"
              [value]="profile?.personalInfo?.workPhoneExtension ?? 'N/A'"
            ></app-ui-data-display-card-text-item>
            <app-ui-data-display-card-text-item
              data-test="profile-personal-phone"
              label="Personal Phone"
              [value]="profile?.personalInfo?.personalPhone ?? 'N/A'"
            ></app-ui-data-display-card-text-item>
            <a class="btn btn-xs btn-primary mt-4 w-1/4" routerLink="/profile/personal-information"
              >Edit Personal Information</a
            >
          } @else {
            <p class="pb-4">Loading profile information...</p>
          }
        </app-ui-data-display-card>
      } @else {
        <app-ui-data-display-card title="Please Log In" subTitle="Access Your Profile Information">
          <p class="pb-4">You are not logged in. Please log in to view your profile information.</p>
        </app-ui-data-display-card>
      }
    </app-ui-page>
  `,
  styles: ``,
})
export class HomePage {
  protected authState = inject(authStore);
  protected authDispatch = injectDispatch(authEvents);
}
