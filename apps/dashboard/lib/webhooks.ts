import { db } from './firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

// Webhook types
export type WebhookEvent = 
  | 'flag.created'
  | 'flag.updated' 
  | 'flag.deleted'
  | 'flag.toggled'
  | 'targeting.updated';

export type WebhookProvider = 'slack' | 'discord' | 'custom';

export interface Webhook {
  id: string;
  projectId: string;
  name: string;
  url: string;
  provider: WebhookProvider;
  events: WebhookEvent[];
  enabled: boolean;
  secret?: string;
  headers?: Record<string, string>;
  createdAt: Date;
  updatedAt: Date;
  lastTriggeredAt?: Date;
}

export interface WebhookPayload {
  event: WebhookEvent;
  timestamp: string;
  projectId: string;
  data: {
    flagKey?: string;
    flagName?: string;
    action: string;
    actor: string;
    changes?: any;
    before?: any;
    after?: any;
  };
}

export interface WebhookDelivery {
  id: string;
  webhookId: string;
  event: WebhookEvent;
  payload: WebhookPayload;
  status: 'success' | 'failed' | 'pending';
  statusCode?: number;
  response?: string;
  error?: string;
  attemptCount: number;
  deliveredAt?: Date;
  createdAt: Date;
}

// Format payload for different providers
export function formatWebhookPayload(
  webhook: Webhook,
  payload: WebhookPayload
): any {
  switch (webhook.provider) {
    case 'slack':
      return formatSlackPayload(payload);
    case 'discord':
      return formatDiscordPayload(payload);
    case 'custom':
    default:
      return payload;
  }
}

// Slack message format
function formatSlackPayload(payload: WebhookPayload): any {
  const { event, data, timestamp } = payload;
  
  const emoji = getEventEmoji(event);
  const color = getEventColor(event);
  
  return {
    text: `${emoji} Feature Flag Event: ${event}`,
    attachments: [
      {
        color: color,
        fields: [
          {
            title: 'Event',
            value: event,
            short: true,
          },
          {
            title: 'Flag',
            value: data.flagKey || 'N/A',
            short: true,
          },
          {
            title: 'Action',
            value: data.action,
            short: true,
          },
          {
            title: 'Actor',
            value: data.actor || 'System',
            short: true,
          },
          ...(data.changes ? [{
            title: 'Changes',
            value: `\`\`\`${JSON.stringify(data.changes, null, 2)}\`\`\``,
            short: false,
          }] : []),
        ],
        footer: 'Flagship Feature Flags',
        ts: new Date(timestamp).getTime() / 1000,
      },
    ],
  };
}

// Discord message format
function formatDiscordPayload(payload: WebhookPayload): any {
  const { event, data, timestamp } = payload;
  
  const emoji = getEventEmoji(event);
  const color = getEventColorHex(event);
  
  return {
    content: `${emoji} **Feature Flag Event:** ${event}`,
    embeds: [
      {
        color: color,
        fields: [
          {
            name: 'Event',
            value: event,
            inline: true,
          },
          {
            name: 'Flag',
            value: data.flagKey || 'N/A',
            inline: true,
          },
          {
            name: 'Action',
            value: data.action,
            inline: true,
          },
          {
            name: 'Actor',
            value: data.actor || 'System',
            inline: true,
          },
          ...(data.changes ? [{
            name: 'Changes',
            value: `\`\`\`json\n${JSON.stringify(data.changes, null, 2)}\n\`\`\``,
            inline: false,
          }] : []),
        ],
        footer: {
          text: 'Flagship Feature Flags',
        },
        timestamp: timestamp,
      },
    ],
  };
}

// Helper functions
function getEventEmoji(event: WebhookEvent): string {
  switch (event) {
    case 'flag.created': return '🎉';
    case 'flag.updated': return '✏️';
    case 'flag.deleted': return '🗑️';
    case 'flag.toggled': return '🔄';
    case 'targeting.updated': return '🎯';
    default: return '📢';
  }
}

function getEventColor(event: WebhookEvent): string {
  switch (event) {
    case 'flag.created': return 'good';
    case 'flag.updated': return 'warning';
    case 'flag.deleted': return 'danger';
    case 'flag.toggled': return '#36a64f';
    case 'targeting.updated': return '#439FE0';
    default: return '#808080';
  }
}

function getEventColorHex(event: WebhookEvent): number {
  switch (event) {
    case 'flag.created': return 0x36a64f; // Green
    case 'flag.updated': return 0xff9800; // Orange
    case 'flag.deleted': return 0xf44336; // Red
    case 'flag.toggled': return 0x2196f3; // Blue
    case 'targeting.updated': return 0x9c27b0; // Purple
    default: return 0x808080; // Gray
  }
}

// Send webhook
export async function sendWebhook(
  webhook: Webhook,
  payload: WebhookPayload
): Promise<{ success: boolean; statusCode?: number; error?: string }> {
  if (!webhook.enabled) {
    return { success: false, error: 'Webhook is disabled' };
  }

  try {
    const formattedPayload = formatWebhookPayload(webhook, payload);
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'User-Agent': 'Flagship-Webhooks/1.0',
      ...(webhook.headers || {}),
    };

    // Add signature if secret is provided
    if (webhook.secret) {
      const signature = await generateSignature(
        JSON.stringify(formattedPayload),
        webhook.secret
      );
      headers['X-Flagship-Signature'] = signature;
    }

    const response = await fetch(webhook.url, {
      method: 'POST',
      headers,
      body: JSON.stringify(formattedPayload),
      signal: AbortSignal.timeout(10000), // 10s timeout
    });

    const success = response.ok;
    const statusCode = response.status;

    // Log delivery
    await logWebhookDelivery({
      webhookId: webhook.id,
      event: payload.event,
      payload,
      status: success ? 'success' : 'failed',
      statusCode,
      response: success ? await response.text() : undefined,
      error: success ? undefined : `HTTP ${statusCode}: ${response.statusText}`,
      attemptCount: 1,
    });

    return { success, statusCode };
  } catch (error: any) {
    // Log failed delivery
    await logWebhookDelivery({
      webhookId: webhook.id,
      event: payload.event,
      payload,
      status: 'failed',
      error: error.message,
      attemptCount: 1,
    });

    return { success: false, error: error.message };
  }
}

// Generate HMAC signature
async function generateSignature(payload: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(payload);
  const key = encoder.encode(secret);

  // Import key for HMAC
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    key,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  // Generate signature
  const signature = await crypto.subtle.sign('HMAC', cryptoKey, data);

  // Convert to hex
  return Array.from(new Uint8Array(signature))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

// Log webhook delivery
async function logWebhookDelivery(
  delivery: Omit<WebhookDelivery, 'id' | 'createdAt' | 'deliveredAt'>
): Promise<void> {
  try {
    await addDoc(collection(db, 'webhook_deliveries'), {
      ...delivery,
      createdAt: serverTimestamp(),
      deliveredAt: delivery.status === 'success' ? serverTimestamp() : null,
    });
  } catch (error) {
    console.error('Failed to log webhook delivery:', error);
  }
}

// Trigger webhooks for an event
export async function triggerWebhooks(
  projectId: string,
  event: WebhookEvent,
  data: WebhookPayload['data']
): Promise<void> {
  const { collection: firestoreCollection, query, where, getDocs } = await import('firebase/firestore');
  
  try {
    // Get all enabled webhooks for this project that listen to this event
    const webhooksQuery = query(
      firestoreCollection(db, 'webhooks'),
      where('projectId', '==', projectId),
      where('enabled', '==', true),
      where('events', 'array-contains', event)
    );

    const webhooksSnapshot = await getDocs(webhooksQuery);

    if (webhooksSnapshot.empty) {
      return;
    }

    const payload: WebhookPayload = {
      event,
      timestamp: new Date().toISOString(),
      projectId,
      data,
    };

    // Send to all matching webhooks (in parallel)
    const promises = webhooksSnapshot.docs.map(doc => {
      const webhook = { id: doc.id, ...doc.data() } as Webhook;
      return sendWebhook(webhook, payload);
    });

    await Promise.allSettled(promises);
  } catch (error) {
    console.error('Failed to trigger webhooks:', error);
  }
}
