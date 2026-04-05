export interface PushSubscriptionRecord {
  id?: number;
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
  createdAt: string;
}

export interface AppSettings {
  id: number; // always 1 (singleton)
  timeSlotTimes: Record<string, string>; // e.g. { morning: '08:00', noon: '12:00' }
  notificationsEnabled: boolean;
  onboardingComplete: boolean;
}
