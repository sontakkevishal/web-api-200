import { Component, ChangeDetectionStrategy } from '@angular/core';
import { PageLayout } from '@ht/shared/ui-common/layouts/page';

@Component({
  selector: 'app-software-pages-add',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageLayout],
  template: `
    <app-ui-page title="Add Software">
      <div class="p-4">Add Software Form Coming Soon...</div>
    </app-ui-page>
  `,
  styles: ``,
})
export class AddSoftwarePage {}
