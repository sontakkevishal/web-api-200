import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { padHours, padMinutes, padSeconds } from '@ht/shared/util-dates/padding';
import { NgIcon } from '@ng-icons/core';
import { tasksStore } from '../../shared/data/stores/tasks/store';

@Component({
  selector: 'app-task-recorder',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgIcon],
  template: `
    <div class="recorder">
      @if (showRecordingControls()) {
        <div
          animate.leave="animate-slide-out "
          animate.enter="animate-slide-in "
          (animationend)="playButtonsDoneAnimating($event)"
          class="fit bg-base-100/90 backdrop-blur-sm shadow rounded-b-lg p-2 items-center flex flex-row delay-500"
        >
          <span class="w-1/2">
            <span class="font-mono text-green-400 animate-pulse text-sm p-2 rounded delay-300">
              {{ elapsedTime().hours }}:{{ elapsedTime().minutes.toString().padStart(2, '0') }}:{{
                elapsedTime().seconds.toString().padStart(2, '0')
              }}
            </span>
          </span>
          <button
            class="btn btn-xs btn-circle btn-success mr-2 opacity-50 hover:opacity-100 duration-200 transition-all"
            (click)="finished()"
          >
            <ng-icon name="lucideCheckCircle" size="20"></ng-icon>
          </button>
          <button
            class="btn btn-xs btn-circle btn-error mr-2 opacity-50 hover:opacity-100 duration-200 transition-all"
            (click)="canceled()"
          >
            <ng-icon name="lucideCircleSlash" size="20"></ng-icon>
          </button>
        </div>
      }
      @if (showPlayButton()) {
        <div
          class="fit bg-base-100/90 backdrop-blur-sm shadow rounded-b-lg p-2 items-center flex flex-row "
          animate.enter="animate-slide-in "
          animate.leave="animate-slide-out"
          (animationend)="recordButtonDoneAnimating($event)"
        >
          <button
            class="btn btn-xs btn-circle btn-success z-50 opacity-50 hover:opacity-100 duration-200 transition-all"
            (click)="startRecording()"
            [disabled]="store.isRecording()"
          >
            <ng-icon name="lucideVoicemail" size="20"></ng-icon>
          </button>
        </div>
      }
    </div>
  `,
  styles: ``,
  host: {
    class: '',
  },
})
export class Recorder {
  startRecording() {
    this.store.startRecording();
    this.showPlayButton.set(false);
  }
  playButtonsDoneAnimating(event: AnimationEvent) {
    if (event.animationName === 'slideOut') {
      this.showPlayButton.set(true);
    }
  }
  showRecordingControls = signal(false);
  showPlayButton = signal(true);
  recordButtonDoneAnimating(event: AnimationEvent) {
    if (event.animationName === 'slideOut') {
      this.showRecordingControls.set(true);
      this.showPlayButton.set(false);
    }
  }
  protected store = inject(tasksStore);

  protected elapsedTime = computed(() => {
    if (!this.store.isRecording()) {
      return { hours: padHours(0), minutes: padMinutes(0), seconds: padSeconds(0) };
    }
    const now = this.store.currentTime();

    const start = this.store.startTime();
    const startHours = start ? start.getHours() : 0;
    const startMinutes = start ? start.getMinutes() : 0;
    const startSeconds = start ? start.getSeconds() : 0;

    if (start === null) {
      return { hours: padHours(0), minutes: padMinutes(0), seconds: padSeconds(0) };
    }
    const elapsedMs =
      new Date(1, 1, 1, now.hours, now.minutes, now.seconds).getTime() -
      new Date(1, 1, 1, startHours, startMinutes, startSeconds).getTime();

    return {
      hours: padHours(elapsedMs),
      minutes: padMinutes(elapsedMs),
      seconds: padSeconds(elapsedMs),
    };
  });
  finished() {
    this.store.finishRecording();
    this.showRecordingControls.set(false);
  }
  canceled() {
    this.store.cancelRecording();
    this.showRecordingControls.set(false);
  }
}
