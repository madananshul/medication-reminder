export const APP_NAME = 'MedReminder';

export const TIME_SLOTS = [
  { id: 'morning', label: 'Morning', icon: '🌅', defaultTime: '08:00' },
  { id: 'noon', label: 'Noon', icon: '☀️', defaultTime: '12:00' },
  { id: 'evening', label: 'Evening', icon: '🌇', defaultTime: '18:00' },
  { id: 'bedtime', label: 'Bedtime', icon: '🌙', defaultTime: '21:00' },
] as const;

export const DEFAULT_TIME_SLOT_TIMES: Record<string, string> = {
  morning: '08:00',
  noon: '12:00',
  evening: '18:00',
  bedtime: '21:00',
};

export const DEFAULT_SETTINGS = {
  id: 1,
  timeSlotTimes: DEFAULT_TIME_SLOT_TIMES,
  notificationsEnabled: false,
  onboardingComplete: false,
};
