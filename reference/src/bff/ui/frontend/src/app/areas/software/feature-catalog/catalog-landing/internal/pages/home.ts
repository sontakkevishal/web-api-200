import { Component, ChangeDetectionStrategy } from '@angular/core';
import { PageLayout } from '@ht/shared/ui-common/layouts/page';
import { EntitlementList } from '../../widgets/entitlement-list';

@Component({
  selector: 'ht-home-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageLayout, EntitlementList],
  template: `
    <app-ui-page title="Your Entitled Software">
      <app-software-center-entitlement-list />
    </app-ui-page>
  `,
  styles: ``,
})
export class HomePage {}
