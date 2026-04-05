import { NextRequest, NextResponse } from 'next/server';
import { sendPushNotification } from '@/lib/push-server';

export async function POST(request: NextRequest) {
  try {
    const { subscription, title, body } = await request.json();

    if (!subscription?.endpoint || !subscription?.keys) {
      return NextResponse.json({ error: 'Invalid subscription' }, { status: 400 });
    }

    await sendPushNotification(subscription, { title, body });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Push notification error:', error);
    return NextResponse.json(
      { error: 'Failed to send notification' },
      { status: 500 }
    );
  }
}
