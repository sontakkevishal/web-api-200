import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { SectionLayout, SectionLink } from '@ht/shared/ui-common/layouts/section';
import { authStore } from '@ht/shared/util-auth/internal/auth-store';

@Component({
  selector: 'app-catalog-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionLayout],
  template: ` <app-ui-section-layout title="Software Center" [links]="links()" /> `,
  styles: ``,
})
export class Home {
  protected store = inject(authStore);
  links = signal<SectionLink[]>([
    {
      title: 'Search Catalog',
      path: 'search',
    },

    ...(this.store.isSoftwareCenterManager()
      ? [
          {
            title: 'Vendor Management',
            path: 'vendors',
          },
        ]
      : []),
    ...(this.store.isSoftwareCenterEmployee()
      ? [
          {
            title: 'Software Management',
            path: 'software',
          },
        ]
      : []),
  ]);
}
