import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { sendWebhook, Webhook, WebhookPayload } from '@/lib/webhooks';

export async function POST(request: NextRequest) {
  try {
    const { webhookId } = await request.json();

    if (!webhookId) {
      return NextResponse.json(
        { error: 'Webhook ID is required' },
        { status: 400 }
      );
    }

    // Get webhook
    const webhookDoc = await getDoc(doc(db, 'webhooks', webhookId));

    if (!webhookDoc.exists()) {
      return NextResponse.json(
        { error: 'Webhook not found' },
        { status: 404 }
      );
    }

    const webhook = { id: webhookDoc.id, ...webhookDoc.data() } as Webhook;

    // Create test payload
    const testPayload: WebhookPayload = {
      event: 'flag.toggled',
      timestamp: new Date().toISOString(),
      projectId: webhook.projectId,
      data: {
        flagKey: 'test-flag',
        flagName: 'Test Flag',
        action: 'Test webhook delivery',
        actor: 'System (Test)',
        changes: {
          enabled: true,
        },
        before: { enabled: false },
        after: { enabled: true },
      },
    };

    // Send webhook
    const result = await sendWebhook(webhook, testPayload);

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Webhook test successful',
        statusCode: result.statusCode,
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: result.error || 'Webhook test failed',
          statusCode: result.statusCode,
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Webhook test error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
