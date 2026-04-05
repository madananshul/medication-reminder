export async function sendPushNotification(
  subscription: { endpoint: string; keys: { p256dh: string; auth: string } },
  payload: { title: string; body: string }
) {
  const webpush = await import('web-push');

  const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? '';
  const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY ?? '';

  if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
    throw new Error('VAPID keys not configured');
  }

  webpush.setVapidDetails(
    'mailto:medreminder@example.com',
    VAPID_PUBLIC_KEY,
    VAPID_PRIVATE_KEY
  );

  return webpush.sendNotification(subscription, JSON.stringify(payload));
}
