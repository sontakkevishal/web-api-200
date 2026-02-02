import { Component, input } from '@angular/core';
import { NgClass } from '@angular/common';

export type AlertVariant = 'info' | 'success' | 'warning' | 'error' | 'neutral';

/**
 * Alert component following DaisyUI design patterns.
 *
 * @example
 * ```html
 * <app-ui-common-alert variant="info">
 *   <app-alert-icon-info slot="icon" />
 *   <div>
 *     <h3 class="font-bold">Title</h3>
 *     <p>Description</p>
 *   </div>
 * </app-ui-common-alert>
 * ```
 */
@Component({
  selector: 'app-ui-common-alert',
  standalone: true,
  imports: [NgClass],
  template: `
    <div role="alert" [ngClass]="alertClasses()">
      @if (showIcon()) {
        <ng-content select="[slot='icon']" />
      }
      <div class="flex-1">
        <ng-content />
      </div>
      <ng-content select="[slot='actions']" />
    </div>
  `,
})
export class AlertComponent {
  variant = input<AlertVariant>('neutral');
  showIcon = input<boolean>(true);
  shadow = input<boolean>(true);

  alertClasses() {
    const classes = ['alert'];

    const variantClass = this.getVariantClass();
    if (variantClass) {
      classes.push(variantClass);
    }

    if (this.shadow()) {
      classes.push('shadow-lg');
    }

    return classes;
  }

  private getVariantClass(): string | null {
    const variant = this.variant();
    switch (variant) {
      case 'info':
        return 'alert-info';
      case 'success':
        return 'alert-success';
      case 'warning':
        return 'alert-warning';
      case 'error':
        return 'alert-error';
      case 'neutral':
        return `alert-neutral`;
      default:
        return null;
    }
  }
}
