import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-ui-typography-em-block',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  template: `
    <div class="px-4 border-l-4 border-primary my-8">
      <p>
        <span class="font-bold text-accent mr-2">
          <ng-content select="[em-block-title]"></ng-content
        ></span>
        <ng-content select="[em-block-content]"></ng-content>
      </p>
    </div>
  `,
  styles: ``,
})
export class EmBlock {}
