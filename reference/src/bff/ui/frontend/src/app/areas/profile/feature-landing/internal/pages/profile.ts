import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { PageLayout } from '@ht/shared/ui-common/layouts/page';
import { form, FormField, required, minLength, maxLength } from '@angular/forms/signals';
import { UserProfilePersonalInformation } from '@ht/shared/util-auth/internal/auth-reducer';
import { authStore } from '@ht/shared/util-auth/internal/auth-store';
import { FormInputComponent } from '@ht/shared/ui-common/forms/inputs/form-input';
import { Router } from '@angular/router';
@Component({
  selector: 'app-profile-pages-personal-information',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageLayout, FormInputComponent, FormField],
  template: `<app-ui-page title="Personal Information">
    <form (submit)="handleSubmit($event)">
      <div class="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-6">
        <!-- First Name -->
        <div class="col-span-3">
          <app-ui-form-input
            label="First name"
            [formField]="form.firstName"
            id="firstName"
            autocomplete="given-name"
            placeholder="Enter first name"
            containerClass="sm:col-span-3"
          />
        </div>
        <div class="col-span-3">
          <app-ui-form-input
            label="Last name"
            [formField]="form.lastName"
            id="lastName"
            autocomplete="family-name"
            placeholder="Enter last name"
            containerClass="sm:col-span-3"
          />
        </div>
        <div class="col-span-3">
          <app-ui-form-input
            label="Email address"
            [formField]="form.email"
            id="email"
            autocomplete="email"
            placeholder="Enter email address"
            containerClass="sm:col-span-3"
          />
        </div>
        <div class="col-span-3">
          <app-ui-form-input
            label="Work Phone Extension"
            [formField]="form.workPhoneExtension"
            id="workPhoneExtension"
            autocomplete="tel"
            placeholder="Enter work phone extension"
            containerClass="sm:col-span-3"
          />
        </div>
        <div class="col-span-3">
          <app-ui-form-input
            label="Personal Phone"
            [formField]="form.personalPhone"
            id="personalPhone"
            autocomplete="tel"
            placeholder="Enter personal phone"
            containerClass="sm:col-span-3"
          />
        </div>
      </div>
      <div class="flex items-center justify-end gap-3">
        <button type="button" class="btn btn-ghost" (click)="router.navigate(['/'])">Cancel</button>
        <button type="submit" class="btn btn-primary">Save</button>
      </div>
    </form>
  </app-ui-page>`,
  styles: ``,
})
export class PersonalInformationPage {
  private store = inject(authStore);
  protected router = inject(Router);

  model = signal<UserProfilePersonalInformation>({
    firstName: this.store.profile()?.personalInfo?.firstName ?? '',
    lastName: this.store.profile()?.personalInfo?.lastName ?? '',
    email: this.store.profile()?.personalInfo?.email ?? '',
    workPhoneExtension: this.store.profile()?.personalInfo?.workPhoneExtension ?? '',
    personalPhone: this.store.profile()?.personalInfo?.personalPhone ?? '',
  });

  form = form(this.model);

  async handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    if (this.form().valid()) {
      await this.store.updateProfile(this.model());
      this.router.navigate(['..']);
    }
  }
}
