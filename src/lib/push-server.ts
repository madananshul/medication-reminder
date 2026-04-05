import webpush from 'web-push';

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? '';
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY ?? '';

if (VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(
    'mailto:medreminder@example.com',
    VAPID_PUBLIC_KEY,
    VAPID_PRIVATE_KEY
  );
}

export async function sendPushNotification(
  subscription: webpush.PushSubscription,
  payload: { title: string; body: string }
) {
  return webpush.sendNotification(subscription, JSON.stringify(payload));
}
