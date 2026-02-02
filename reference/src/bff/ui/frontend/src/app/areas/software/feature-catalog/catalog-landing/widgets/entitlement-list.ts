import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { NgIcon } from '@ng-icons/core';

@Component({
  selector: 'app-software-center-entitlement-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgIcon],
  template: `
    <ul class="flex flex-col gap-2  p-4">
      @for (title of entitledSoftware(); track title.id) {
        <li class="flex flex-col lg:flex-row gap-4 p-2 mb-4 border-2 border-base-300 bg-base-200 ">
          <div class="bg-base-200 p-2 w-1/3  ">
            <div class="flex flex-col gap-2 items-baseline ">
              <span class="text-xs uppercase font-semibold opacity-60 text-secondary">{{
                title.vendor
              }}</span>
              <span class="text-lg font-bold text-accent">{{ title.name }}</span>
            </div>
            <div class="text-xs py-2 font-semibold opacity-60">{{ title.description }}</div>
            <div class="flex flex-col gap-1 text-xs bg-base-100/70 p-2 rounded-md h-fit ">
              <span>License: {{ title.license }}</span>
              @if (title.requiresApproval) {
                <span>Requires Manager Approval</span>
              }
            </div>
          </div>

          <div class="flex flex-col gap-2  p-2 w-full ">
            @for (platform of title.platforms; track platform.name) {
              <div
                class="flex flex-row gap-1  p-4 w-full align-items-center justify-between bg-base-100/70 rounded-md "
              >
                <p class=" font-medium text-accent">{{ platform.name }}</p>
                <div class="flex flex-row items-start justify-start gap-4 w-fit">
                  @for (version of platform.versions; track version.version) {
                    <div class="dropdown dropdown-top">
                      <button
                        tabindex="0"
                        role="button"
                        class="  px-2 py-1 font-mono"
                        [class.bg-gray-600]="version.status === 'outdated'"
                        [class.opacity-60]="version.status === 'outdated' && !version.entitiled"
                        [class.bg-blue-600]="version.status === 'current'"
                        [class.bg-green-800]="!version.entitiled && version.status === 'current'"
                        [class.border-blue-800]="version.entitiled"
                      >
                        {{ version.version }}
                        @if (version.entitiled) {
                          <ng-icon name="lucideCheckCheck" />
                        }
                        @if (version.status === 'outdated') {
                          <ng-icon name="lucideSkull" />
                        }
                      </button>
                      @if (version.status !== 'outdated' || version.entitiled) {
                        <ul
                          tabindex="-1"
                          class="dropdown-content menu bg-base-300 rounded-box z-1 w-52 p-2 shadow-sm"
                        >
                          @if (version.status !== 'outdated' && version.entitiled) {
                            <li><span class="btn btn-warning disabled">Version Outdated</span></li>
                          }
                          @if (version.entitiled) {
                            <li>
                              <a class="btn btn-sm btn-warning"
                                ><ng-icon name="lucideCircleSlash" class="mr-2" size="16" /> Remove
                                Entitlement</a
                              >
                            </li>
                          }

                          @if (version.status === 'current' && !version.entitiled) {
                            <a class="btn btn-sm btn-success"
                              ><ng-icon name="lucideCheckCheck" class="mr-2" size="16" />
                              @if (title.requiresApproval) {
                                Request
                              } @else {
                                Add
                              }
                              Entitlement</a
                            >
                          }
                        </ul>
                      }
                    </div>
                  }
                </div>
              </div>
            }
          </div>
        </li>
      }
    </ul>
  `,
  styles: ``,
})
export class EntitlementList {
  entitledSoftware = signal([
    {
      id: 'vs-code',
      name: 'Visual Studio Code',
      vendor: 'Microsoft',
      description: 'Editor For Software Development',
      license: 'MIT',
      requiresApproval: true,
      platforms: [
        {
          name: 'Windows',
          versions: [
            { version: '1.80.2', status: 'current', entitiled: false },
            { version: '1.80.1', status: 'current', entitiled: true },
            { version: '1.80.0', status: 'current', entitiled: true },
            { version: '1.75.2', status: 'outdated', entitiled: true },
            { version: '1.71.0', status: 'outdated', entitiled: false },
            { version: '1.70.0', status: 'outdated', entitiled: false },
          ],
        },
        {
          name: 'MacOs',
          versions: [
            { version: '1.80.2', status: 'current', entitiled: false },
            { version: '1.80.1', status: 'current', entitiled: true },
          ],
        },
      ],
    },
    {
      id: 'visual-studio',
      name: 'Visual Studio',
      vendor: 'Microsoft',
      description: 'Editor For Software Development',
      license: 'Commercial',
      requiresApproval: true,
      platforms: [
        {
          name: 'Windows',
          versions: [
            { version: '2026', status: 'current', entitiled: false },
            { version: '2022', status: 'outdated', entitiled: true },
          ],
        },
      ],
    },
    {
      id: 'intellij-idea',
      name: 'IntelliJ IDEA',
      vendor: 'JetBrains',
      description: 'Integrated Development Environment for Java and Kotlin',
      license: 'Commercial',
      requiresApproval: true,
      platforms: [
        {
          name: 'Windows',
          versions: [
            { version: '2023.3', status: 'outdated', entitiled: true },
            { version: '2024.1', status: 'current', entitiled: true },
            { version: '2024.2', status: 'current', entitiled: false },
          ],
        },
        {
          name: 'MacOs',
          versions: [
            { version: '2024.1', status: 'current', entitiled: true },
            { version: '2024.2', status: 'current', entitiled: false },
          ],
        },
        {
          name: 'Linux',
          versions: [{ version: '2024.1', status: 'current', entitiled: true }],
        },
      ],
    },
    {
      id: 'docker-desktop',
      name: 'Docker Desktop',
      vendor: 'Docker Inc.',
      description: 'Containerization Platform for Development',
      license: 'Commercial',
      requiresApproval: true,
      platforms: [
        {
          name: 'Windows',
          versions: [
            { version: '4.25.0', status: 'outdated', entitiled: true },
            { version: '4.28.0', status: 'current', entitiled: true },
            { version: '4.29.0', status: 'current', entitiled: false },
          ],
        },
        {
          name: 'MacOs',
          versions: [
            { version: '4.28.0', status: 'current', entitiled: true },
            { version: '4.29.0', status: 'current', entitiled: true },
          ],
        },
      ],
    },
    {
      id: 'slack',
      name: 'Slack',
      vendor: 'Slack Technologies',
      description: 'Team Communication and Collaboration Platform',
      license: 'Commercial',
      requiresApproval: false,
      platforms: [
        {
          name: 'Windows',
          versions: [
            { version: '4.38.0', status: 'current', entitiled: true },
            { version: '4.36.0', status: 'outdated', entitiled: true },
          ],
        },
        {
          name: 'MacOs',
          versions: [{ version: '4.38.0', status: 'current', entitiled: true }],
        },
        {
          name: 'Linux',
          versions: [{ version: '4.38.0', status: 'current', entitiled: true }],
        },
      ],
    },
    {
      id: 'adobe-acrobat',
      name: 'Adobe Acrobat Pro',
      vendor: 'Adobe',
      description: 'PDF Creation and Editing Software',
      license: 'Commercial',
      requiresApproval: true,
      platforms: [
        {
          name: 'Windows',
          versions: [
            { version: '2024.002', status: 'current', entitiled: false },
            { version: '2024.001', status: 'current', entitiled: false },
            { version: '2023.001', status: 'outdated', entitiled: false },
          ],
        },
        {
          name: 'MacOs',
          versions: [
            { version: '2024.002', status: 'current', entitiled: false },
            { version: '2024.001', status: 'current', entitiled: false },
          ],
        },
      ],
    },
  ]);
}
