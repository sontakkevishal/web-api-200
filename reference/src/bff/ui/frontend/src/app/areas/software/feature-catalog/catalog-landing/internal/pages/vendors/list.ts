import { httpResource } from '@angular/common/http';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Vendor } from './add';
export type VendorListItem = Omit<Vendor, 'poc'> & {
  currentPoc: Vendor['poc'];
};

@Component({
  selector: 'app-vendors-pages-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  template: ` <div class="text-2xl font-bold p-4 border-b-2 text-secondary/80 border-base-300">
      Vendor List
    </div>
    @if (listResource.isLoading()) {
      <div class="p-4">Loading vendors...</div>
    } @else {
      <div class="overflow-x-auto p-4">
        <table class="table table-zebra w-full">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Website</th>
              <th>Contact Name</th>
              <th>Contact Email</th>
              <th>Contact Phone</th>
            </tr>
          </thead>
          <tbody>
            @for (vendor of listResource.value(); track vendor.id) {
              <tr>
                <td>{{ vendor.name }}</td>
                <td>{{ vendor.description }}</td>
                <td>
                  <a href="{{ vendor.websiteUrl }}" target="_blank" class="link link-primary">
                    {{ vendor.websiteUrl }}
                  </a>
                </td>
                <td>{{ vendor.currentPoc.name }}</td>
                <td>
                  <a href="mailto:{{ vendor.currentPoc.email }}" class="link link-primary">
                    {{ vendor.currentPoc.email }}
                  </a>
                </td>
                <td>
                  <a href="tel:{{ vendor.currentPoc.phone }}" class="link link-primary">
                    {{ vendor.currentPoc.phone }}
                  </a>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    }`,
  styles: ``,
})
export class ListPage {
  listResource = httpResource<VendorListItem[]>(() => '/api/catalog/vendors');
}
