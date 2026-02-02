import { computed } from '@angular/core';
import { signalStoreFeature, withComputed } from '@ngrx/signals';
import { withEntities } from '@ngrx/signals/entities';
import { TaskEntity } from '../store';

export function withLocalTaskLog() {
  return signalStoreFeature(
    withEntities<TaskEntity>(),
    withComputed((store) => ({
      localTasks: computed(() => getLocalLogEntities(store.entities())),
    })),
  );
}

function getLocalLogEntities(entities: TaskEntity[]) {
  return entities.map((task) => mapLocalLog(task));
  function mapLocalLog(task: TaskEntity): {
    isLocal: boolean;
    isValid: boolean;
    isMutating: boolean;
    startTime: string;
    endTime: string;
    minutes: number;
    id: string;
    description: string;
  } {
    return {
      ...task,
      isLocal: true,
      isValid: task.description !== 'None',
      isMutating: false,
    };
  }
}
