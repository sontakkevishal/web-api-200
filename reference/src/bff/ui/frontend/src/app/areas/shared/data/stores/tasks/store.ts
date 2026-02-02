import { httpResource } from '@angular/common/http';
import { computed, effect } from '@angular/core';
import {
  patchState,
  signalStore,
  watchState,
  withComputed,
  withHooks,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import { addEntity, removeEntity, setEntities, updateEntity } from '@ngrx/signals/entities';
import { withLocalTaskLog } from './internal/local-log-feature';
import {
  withTaskRecording,
  setStartRecording,
  setStopRecording,
} from './internal/task-recording-feature';

export type TaskEntity = {
  id: string;
  description: string;
  startTime: string;
  endTime: string;
  minutes: number;
};

type TasksState = {
  currentTime: {
    hours: number;
    minutes: number;
    seconds: number;
  };
  _tick: Date; // in a store, an underscore on a member is private, in a class, use a # or the private keyword.

  //   _mutatingTasks: string[];
};

type RawTaskFromServer = {
  id: string;
  description: string;
  startTime: string;
  endTime: string;
  minutes: number;
};

export const tasksStore = signalStore(
  withProps(() => {
    const serverTasks = httpResource<RawTaskFromServer[]>(() => '/api/tasks', {});
    return {
      _serverTasks: serverTasks,
    };
  }),
  withLocalTaskLog(),
  withTaskRecording(),
  withState<TasksState>({
    currentTime: {
      hours: 0,
      minutes: 0,
      seconds: 0,
    },
    _tick: new Date(),

    //   _mutatingTasks: [],
  }),

  // instead of having a reducer that takes actions and switches on them, just create methods.
  withMethods((store) => {
    return {
      // async is fine in Angular. You can async and await like the snobby react bros now.
      syncToServer: async (task: TaskEntity) => {
        await fetch('/api/tasks', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            description: task.description,
            startTime: task.startTime,
            endTime: task.endTime,
            minutes: task.minutes,
          }),
        });
        patchState(
          store,

          removeEntity(task.id),
        );
        store._serverTasks.reload(); // this can be whatever
        // what I'm doing is saying "reload the whole list"
        // if the post returned a new entity, you *could* just add it, but this is safest.
      },

      startRecording: () => patchState(store, setStartRecording()),
      cancelRecording: () => patchState(store, setStopRecording()),
      finishRecording: () => {
        const startTime = store.startTime();
        if (!startTime) {
          throw new Error('No start time recorded');
        }
        const endTime = new Date();
        const minutes = Math.round((endTime.getTime() - startTime.getTime()) / 60000);
        const taskEntity: TaskEntity = {
          id: crypto.randomUUID(),
          description: 'None',
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
          minutes,
        };

        patchState(store, setStopRecording(), addEntity(taskEntity));
      },
      deleteTask: (task: TaskEntity) => patchState(store, removeEntity(task.id)),
      changeDescription: (task: TaskEntity, newDescription: string) => {
        patchState(
          store,
          updateEntity({
            id: task.id,
            changes: {
              description: newDescription,
            },
          }),
        );
      },
    };
  }),
  withComputed((store) => {
    return {
      stats: computed(() => {
        const all = getAllTasks(store.localTasks(), store._serverTasks.value() || []);
        const localTasks = all.filter((t) => t.isLocal);
        const serverTasks = all.filter((t) => !t.isLocal);
        const totalMinutes = all.reduce((sum, task) => sum + task.minutes, 0);
        const totalMinutesLocal = localTasks.reduce((sum, task) => sum + task.minutes, 0);
        const totalMinutesServer = serverTasks.reduce((sum, task) => sum + task.minutes, 0);
        const totalTasks = all.length;
        const totalLocalTasks = localTasks.length;
        const totalServerTasks = serverTasks.length;
        const averageMinutes = totalTasks ? Math.round(totalMinutes / totalTasks) : 0;
        const averageMinutesLocal = totalLocalTasks
          ? Math.round(totalMinutesLocal / totalLocalTasks)
          : 0;
        const averageMinutesServer = totalServerTasks
          ? Math.round(totalMinutesServer / totalServerTasks)
          : 0;
        const longestTask = all.reduce((max, task) => (task.minutes > max ? task.minutes : max), 0);
        return {
          minutes: {
            total: totalMinutes,
            local: totalMinutesLocal,
            server: totalMinutesServer,
          },
          tasks: {
            total: totalTasks,
            local: totalLocalTasks,
            server: totalServerTasks,
          },
          averageMinutes: {
            total: averageMinutes,
            local: averageMinutesLocal,
            server: averageMinutesServer,
          },
          longestTask: {
            total: longestTask,
            local: localTasks.reduce((max, task) => (task.minutes > max ? task.minutes : max), 0),
            server: serverTasks.reduce((max, task) => (task.minutes > max ? task.minutes : max), 0),
          },
        };
      }),

      taskList: computed(() => {
        // Promise you will see why later...
        const localLogEntities = store.entities();
        const serverTasks = store._serverTasks.value() || [];

        const sorted = getAllTasks(localLogEntities, serverTasks);
        return sorted;
      }),
    };
  }),
  withHooks({
    onInit(store) {
      const savedJson = localStorage.getItem('tasks');
      if (savedJson) {
        const savedTasks = JSON.parse(savedJson) as TaskEntity[];
        patchState(store, setEntities(savedTasks));
      }
      watchState(store, () => {
        localStorage.setItem('tasks', JSON.stringify(store.entities()));
      });

      setInterval(() => {
        patchState(store, { _tick: new Date() });
      }, 1000);
      effect(() => {
        const now = store._tick();
        patchState(store, {
          currentTime: {
            hours: now.getHours(),
            minutes: now.getMinutes(),
            seconds: now.getSeconds(),
          },
        });
      });
    },
    onDestroy() {
      console.log('tasksStore destroyed');
    },
  }),
);

function getAllTasks(localLogEntities: TaskEntity[], serverTasks: RawTaskFromServer[]) {
  const mappedLocalTasks = getLocalLogEntities(localLogEntities);
  const mappedServerTasks = serverTasks.map(mapServerLog());
  const sorted = getAllTasksSorted(mappedLocalTasks, mappedServerTasks);
  return sorted;
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

function getAllTasksSorted(
  localTasks: {
    isLocal: boolean;
    isValid: boolean;
    isMutating: boolean;
    startTime: string;
    endTime: string;
    minutes: number;
    id: string;
    description: string;
  }[],
  serverTasks: {
    isLocal: boolean;
    isValid: boolean;
    isMutating: boolean;
    id: string;
    description: string;
    startTime: string;
    endTime: string;
    minutes: number;
  }[],
) {
  return [...localTasks, ...serverTasks].sort(
    (a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime(),
  ) as (TaskEntity & { isLocal: boolean; isValid: boolean; isMutating: boolean })[];
}

function mapServerLog(): (task: RawTaskFromServer) => {
  isLocal: boolean;
  isValid: boolean;
  isMutating: boolean;
  id: string;
  description: string;
  startTime: string;
  endTime: string;
  minutes: number;
} {
  return (task) => ({
    ...task,

    isLocal: false,
    isValid: true,
    isMutating: false,
  });
}
