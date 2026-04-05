import { TIME_SLOTS } from './constants';

export function getTimeSlot(id: string) {
  return TIME_SLOTS.find((slot) => slot.id === id);
}

export function getTimeSlotLabel(id: string): string {
  return getTimeSlot(id)?.label ?? id;
}

export function getTimeSlotIcon(id: string): string {
  return getTimeSlot(id)?.icon ?? '💊';
}

export function sortByTimeSlot(a: string, b: string): number {
  const order: readonly string[] = TIME_SLOTS.map((s) => s.id);
  return order.indexOf(a) - order.indexOf(b);
}
