import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { IconName } from './types';

@Component({
  selector: 'app-ui-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgIcon],
  template: `<ng-icon [name]="name()" class=""></ng-icon> `,
  styles: ``,
})
export class Icon {
  name = input.required<IconName>();
}
