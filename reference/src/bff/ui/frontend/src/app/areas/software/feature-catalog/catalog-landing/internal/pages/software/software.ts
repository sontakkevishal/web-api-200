import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { PageLayout } from '@ht/shared/ui-common/layouts/page';
import { RouterOutlet, RouterLinkWithHref, RouterLinkActive } from '@angular/router';
import { SectionLink } from '@ht/shared/ui-common/layouts/section';

@Component({
  selector: 'app-software-pages-software',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, RouterLinkWithHref, RouterLinkActive],
  template: ` <div class="bg-base-100 flex flex-row h-full w-full gap-0 p-2">
    <div class="flex flex-col w-1/8  justify-start  items-stretch gap-2 p-2 bg-base-200 h-full ">
      @for (link of links(); track $index) {
        <a
          [routerLink]="link.path"
          [routerLinkActive]="['bg-accent/80', 'text-black']"
          class="btn btn-sm font-bolder"
          >{{ link.title }}</a
        >
      }
    </div>
    <div class="rounded-none  bg-base-200 w-full  border-l-2 border-base-100 h-full">
      <router-outlet />
    </div>
  </div>`,
  styles: ``,
})
export class SoftwarePage {
  links = signal<SectionLink[]>([
    {
      title: 'List Software',
      path: 'list',
    },
    {
      title: 'Add Software',
      path: 'add',
    },
  ]);
}
