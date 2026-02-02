import { Component, ChangeDetectionStrategy } from '@angular/core';
import { SectionLayout } from '@ht/shared/ui-common/layouts/section';

@Component({
  selector: 'app-dev-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionLayout],
  template: ` <app-ui-section-layout title="Your Profile" [links]="[]" /> `,
  styles: ``,
})
export class Home {}
