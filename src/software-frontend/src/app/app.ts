import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: `
    <div class="container mx-auto">
      <div class="text-center my-4">
        <h1 class="text-4xl font-bold">{{ title() }}</h1>
      </div>
      <router-outlet />
    </div>
  `,
  styles: [],
})
export class App {
  protected readonly title = signal('Software Center');
}
