import { signalStoreFeature, withState } from '@ngrx/signals';

type TaskRecordingState = {
  isRecording: boolean;
  startTime: Date | null;
};
export function withTaskRecording() {
  return signalStoreFeature(withState<TaskRecordingState>({ isRecording: false, startTime: null }));
}

export function setStartRecording(): TaskRecordingState {
  return {
    isRecording: true,
    startTime: new Date(),
  };
}

export function setStopRecording(): TaskRecordingState {
  return {
    isRecording: false,
    startTime: null,
  };
}
