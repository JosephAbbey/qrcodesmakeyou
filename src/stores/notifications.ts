import { get, writable } from 'svelte/store';
import type { SvelteUIColor } from '@svelteuidev/core';
import type { SvelteComponentDev } from 'svelte/internal';

type Notification = {
  title?: string | undefined;
  icon?: typeof SvelteComponentDev | HTMLOrSVGElement | undefined;
  color?: SvelteUIColor | undefined;
  body: string;
};
// Create a store and update it when necessary...
export const notifications = writable<Notification[]>([]);

export const notify = (n: Notification) => {
  notifications.set([...get(notifications), n]);
};

export const clear = (i: number) => {
  notifications.set(get(notifications).toSpliced(i, 1));
};
