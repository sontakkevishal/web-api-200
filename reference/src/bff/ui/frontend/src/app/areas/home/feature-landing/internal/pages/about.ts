import { Component, ChangeDetectionStrategy } from '@angular/core';
import { PageLayout } from '@ht/shared/ui-common/layouts/page';

@Component({
  selector: 'ht-home-about',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageLayout],
  template: `
    <app-ui-page title="About this App">
      <p>First off, this is <em>fake</em>. It is for training purposes.</p>
      <p>
        This app is built using the Hypertheory Angular Starter 2026, which provides a solid
        foundation for building Angular applications with best practices in mind.
      </p>
    </app-ui-page>
  `,
  styles: ``,
})
export class AboutPage {}
