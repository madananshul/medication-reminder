import { db } from './db';

export async function requestNotificationPermission(): Promise<boolean> {
  if (typeof Notification === 'undefined') return false;
  if (Notification.permission === 'granted') return true;
  if (Notification.permission === 'denied') return false;

  const result = await Notification.requestPermission();
  return result === 'granted';
}

export async function subscribeToPush(): Promise<PushSubscription | null> {
  if (!('serviceWorker' in navigator)) return null;

  const registration = await navigator.serviceWorker.ready;
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  if (!publicKey) return null;

  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(publicKey).buffer as ArrayBuffer,
  });

  // Store in IndexedDB
  const json = subscription.toJSON();
  await db.pushSubscriptions.put({
    endpoint: subscription.endpoint,
    keys: {
      p256dh: json.keys!.p256dh!,
      auth: json.keys!.auth!,
    },
    createdAt: new Date().toISOString(),
  });

  return subscription;
}

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  return Uint8Array.from(rawData, (char) => char.charCodeAt(0));
}
