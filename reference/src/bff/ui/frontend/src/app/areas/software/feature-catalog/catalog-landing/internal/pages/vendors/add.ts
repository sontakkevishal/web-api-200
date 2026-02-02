import { httpMutation } from '@angular-architects/ngrx-toolkit';
import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { form, FormField, maxLength, required } from '@angular/forms/signals';

import { FormInputComponent } from '@ht/shared/ui-common/forms/inputs/form-input';

export type Vendor = {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
  poc: {
    name: string;
    email: string;
    phone: string;
  };
};
type VendorCreate = Omit<Vendor, 'id'>;
@Component({
  selector: 'app-software-pages-vendors-add',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormInputComponent, FormField],
  template: `
    <div class="">
      <div class="text-2xl font-bold p-4 border-b-2 text-secondary/80 border-base-300">
        Add Vendor
      </div>
      <form (submit)="handleSubmit($event)">
        <div class="flex flex-col gap-4 p-4">
          <div class="form-control w-full">
            <app-ui-form-input id="name" label="Vendor Name" [formField]="form.name" />
          </div>
          <div class="form-control w-full">
            <textarea
              rows="4"
              class="textarea textarea-bordered w-full mt-2"
              [formField]="form.description"
              placeholder="Notes or Description"
            ></textarea>
          </div>
          <div class="flex flex-row gap-4">
            <div class="form-control w-full">
              <app-ui-form-input id="websiteUrl" label="Website" [formField]="form.websiteUrl" />
            </div>
            <div class="form-control w-full">
              <app-ui-form-input
                id="contactName"
                label="Contact Name"
                [formField]="form.poc.name"
              />
            </div>
          </div>
          <div class="flex flex-row gap-4">
            <div class="form-control w-full">
              <app-ui-form-input
                id="contactEmail"
                label="Contact Email"
                [formField]="form.poc.email"
              />
            </div>
            <div class="form-control w-full">
              <app-ui-form-input
                id="contactPhone"
                label="Contact Phone"
                [formField]="form.poc.phone"
              />
            </div>
          </div>
          <div class="flex flex-row justify-end pt-4">
            <button type="submit" class="btn btn-primary">Add Vendor</button>
          </div>
        </div>
      </form>
    </div>
  `,
  styles: ``,
})
export class AddVendorPage {
  protected addMutation = httpMutation((model: VendorCreate) => ({
    url: `/api/catalog/vendors`,
    method: 'POST',
    body: model,
  }));
  private initialModel: VendorCreate = {
    name: '',
    description: '',
    websiteUrl: '',
    poc: {
      name: '',
      email: '',
      phone: '',
    },
  };
  model = signal<VendorCreate>(this.initialModel);

  form = form(this.model, (s) => {
    required(s.name);
    maxLength(s.name, 100);
    maxLength(s.description, 500);
    required(s.websiteUrl);
    required(s.poc.name);
    required(s.poc.email);
  });

  async handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    await this.addMutation(this.model());
    this.model.set(this.initialModel);
  }
}
