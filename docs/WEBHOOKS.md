# Webhooks

Get real-time notifications when your feature flags change.

## Overview

Webhooks allow you to receive HTTP callbacks when specific events occur in your Flagship project. This is useful for:

- **Slack/Discord notifications** when flags are toggled
- **Triggering CI/CD pipelines** on flag changes
- **Syncing with external systems**
- **Audit trail integration**
- **Custom automation workflows**

## Supported Events

| Event | Description |
|-------|-------------|
| `flag.created` | A new feature flag is created |
| `flag.updated` | A flag's configuration is updated |
| `flag.deleted` | A flag is deleted |
| `flag.toggled` | A flag is turned on or off |
| `targeting.updated` | Targeting rules are modified |

## Webhook Providers

Flagship supports three types of webhooks:

### 1. Slack
Formatted messages for Slack channels with rich attachments.

**Setup:**
1. Go to your Slack workspace → Apps
2. Create an Incoming Webhook
3. Copy the webhook URL (e.g., `https://hooks.slack.com/services/...`)
4. Add to Flagship with provider = `slack`

**Payload Format:**
```json
{
  "text": "🔄 Feature Flag Event: flag.toggled",
  "attachments": [
    {
      "color": "#36a64f",
      "fields": [
        {
          "title": "Event",
          "value": "flag.toggled",
          "short": true
        },
        {
          "title": "Flag",
          "value": "new-checkout-flow",
          "short": true
        },
        {
          "title": "Action",
          "value": "FLAG_TOGGLED",
          "short": true
        },
        {
          "title": "Actor",
          "value": "john@example.com",
          "short": true
        }
      ],
      "footer": "Flagship Feature Flags",
      "ts": 1703001234
    }
  ]
}
```

### 2. Discord
Formatted embeds for Discord channels.

**Setup:**
1. Go to your Discord server → Server Settings → Integrations
2. Create a Webhook
3. Copy the webhook URL
4. Add to Flagship with provider = `discord`

**Payload Format:**
```json
{
  "content": "🔄 **Feature Flag Event:** flag.toggled",
  "embeds": [
    {
      "color": 2196611,
      "fields": [
        {
          "name": "Event",
          "value": "flag.toggled",
          "inline": true
        },
        {
          "name": "Flag",
          "value": "new-checkout-flow",
          "inline": true
        }
      ],
      "footer": {
        "text": "Flagship Feature Flags"
      },
      "timestamp": "2024-12-25T10:30:00.000Z"
    }
  ]
}
```

### 3. Custom
Send raw JSON payloads to any HTTP endpoint.

**Payload Format:**
```json
{
  "event": "flag.toggled",
  "timestamp": "2024-12-25T10:30:00.000Z",
  "projectId": "proj_abc123",
  "data": {
    "flagKey": "new-checkout-flow",
    "flagName": "New Checkout Flow",
    "action": "FLAG_TOGGLED",
    "actor": "john@example.com",
    "changes": {
      "enabled": true
    },
    "before": {
      "enabled": false
    },
    "after": {
      "enabled": true
    }
  }
}
```

## Creating a Webhook

### Via Dashboard

1. Navigate to your project
2. Go to **Settings** → **Webhooks**
3. Click **Create Webhook**
4. Fill in the form:
   - **Name**: Descriptive name (e.g., "Production Slack Alerts")
   - **Provider**: slack | discord | custom
   - **Webhook URL**: Your endpoint URL
   - **Events**: Select which events to listen for
   - **Secret** (optional): HMAC signature key

5. Click **Create**
6. Test the webhook with the **Test** button

### Event Selection

Choose which events trigger your webhook:

```typescript
// Listen to all flag changes
events: ['flag.created', 'flag.updated', 'flag.deleted', 'flag.toggled']

// Only targeting changes
events: ['targeting.updated']

// Critical events only
events: ['flag.created', 'flag.deleted']
```

## Security

### HMAC Signatures

Webhook payloads can be signed with HMAC-SHA256 to verify authenticity.

**Setup:**
1. Provide a `secret` when creating the webhook
2. Flagship will add an `X-Flagship-Signature` header

**Verification (Node.js):**
```typescript
import crypto from 'crypto';

function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
    
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

// In your webhook handler
app.post('/webhook', (req, res) => {
  const signature = req.headers['x-flagship-signature'];
  const payload = JSON.stringify(req.body);
  
  if (!verifyWebhookSignature(payload, signature, YOUR_SECRET)) {
    return res.status(401).send('Invalid signature');
  }
  
  // Process webhook
  console.log('Flag changed:', req.body);
  res.sendStatus(200);
});
```

### Best Practices

1. **Use HTTPS** - Always use secure URLs
2. **Validate signatures** - Verify HMAC signatures on production
3. **Whitelist IPs** - Restrict webhook sources (if possible)
4. **Handle retries** - Implement idempotency (check delivery IDs)
5. **Timeout handling** - Respond within 10 seconds
6. **Error logging** - Log failures for debugging

## Testing Webhooks

### Test Button

Use the **Test** button in the dashboard to send a sample payload:

```json
{
  "event": "flag.toggled",
  "timestamp": "2024-12-25T10:30:00.000Z",
  "projectId": "proj_abc123",
  "data": {
    "flagKey": "test-flag",
    "flagName": "Test Flag",
    "action": "Test webhook delivery",
    "actor": "System (Test)",
    "changes": {
      "enabled": true
    },
    "before": { "enabled": false },
    "after": { "enabled": true }
  }
}
```

### Request/Response

Flagship expects:
- **Status Code**: 200-299 for success
- **Timeout**: 10 seconds
- **Response Body**: Any (logged for debugging)

Example successful response:
```
HTTP/1.1 200 OK
Content-Type: application/json

{
  "received": true,
  "message": "Webhook processed"
}
```

## Delivery Logs

View webhook delivery history:

1. Go to **Settings** → **Webhooks** → **Delivery Logs**
2. Filter by webhook or event type
3. View delivery status and details

**Log Fields:**
- **Event**: Which event triggered the webhook
- **Status**: success | failed | pending
- **Attempts**: Number of delivery attempts
- **Status Code**: HTTP response code
- **Response**: Server response body
- **Error**: Error message (if failed)
- **Timestamp**: When delivery was attempted

## Retry Logic

Currently, Flagship does **not** automatically retry failed webhooks. Failed deliveries are logged for manual review.

**Coming Soon:**
- Automatic retries with exponential backoff
- Manual retry button in delivery logs
- Webhook failure alerts

## Use Cases

### 1. Slack Notifications

Get notified in Slack when production flags change:

```yaml
Name: Production Alerts
Provider: Slack
URL: https://hooks.slack.com/services/YOUR/WEBHOOK/URL
Events: 
  - flag.toggled
  - flag.deleted
  - targeting.updated
```

### 2. CI/CD Integration

Trigger deployments when flags are enabled:

```yaml
Name: Deploy Trigger
Provider: Custom
URL: https://ci.example.com/webhook/deploy
Events:
  - flag.toggled
```

```javascript
// CI webhook handler
app.post('/webhook/deploy', async (req, res) => {
  const { event, data } = req.body;
  
  if (event === 'flag.toggled' && data.after.enabled) {
    // Flag was enabled, trigger deployment
    await triggerDeployment({
      flag: data.flagKey,
      environment: 'production'
    });
  }
  
  res.sendStatus(200);
});
```

### 3. Audit Log Integration

Send flag changes to external audit system:

```yaml
Name: Audit System
Provider: Custom
URL: https://audit.example.com/api/events
Events: [all]
```

### 4. Analytics Integration

Track flag changes in your analytics platform:

```javascript
app.post('/webhook/analytics', async (req, res) => {
  const { event, data } = req.body;
  
  await analytics.track({
    userId: data.actor,
    event: 'Feature Flag Changed',
    properties: {
      flagKey: data.flagKey,
      action: data.action,
      enabled: data.after?.enabled
    }
  });
  
  res.sendStatus(200);
});
```

## Custom Headers

Add custom headers to webhook requests:

```javascript
// In webhook creation
{
  "name": "Custom API",
  "url": "https://api.example.com/webhook",
  "provider": "custom",
  "headers": {
    "Authorization": "Bearer YOUR_TOKEN",
    "X-Custom-Header": "value"
  }
}
```

All custom headers are sent with every webhook request.

## Limitations

- **Maximum payload size**: 1 MB
- **Timeout**: 10 seconds
- **Rate limit**: 100 webhooks/minute per project
- **Max webhooks**: 20 per project
- **Max delivery logs**: 10,000 per project (auto-pruned after 90 days)

## Troubleshooting

### Webhook not receiving requests

1. Check webhook is **enabled**
2. Verify **events** are selected
3. Test webhook with **Test** button
4. Check **Delivery Logs** for errors

### Signature verification fails

1. Ensure secret matches on both ends
2. Verify payload is not modified
3. Use raw body (not parsed JSON)
4. Check timing-safe comparison

### Timeouts

1. Respond quickly (< 10s)
2. Process webhooks asynchronously
3. Return 200 immediately, then process

### Failed deliveries

Check delivery logs for:
- HTTP status code
- Error message
- Response body

Common issues:
- Wrong URL (404)
- Authentication failure (401/403)
- Server error (500)
- Timeout (no response within 10s)

## API Reference

### List Webhooks

```typescript
GET /api/webhooks?projectId={projectId}

Response:
{
  "webhooks": [
    {
      "id": "wh_abc123",
      "name": "Production Slack",
      "url": "https://hooks.slack.com/...",
      "provider": "slack",
      "events": ["flag.toggled"],
      "enabled": true,
      "createdAt": "2024-12-25T10:00:00Z"
    }
  ]
}
```

### Create Webhook

```typescript
POST /api/webhooks

Body:
{
  "projectId": "proj_abc123",
  "name": "My Webhook",
  "url": "https://example.com/webhook",
  "provider": "custom",
  "events": ["flag.created", "flag.updated"],
  "secret": "optional_secret_key"
}

Response:
{
  "id": "wh_abc123",
  "message": "Webhook created successfully"
}
```

### Test Webhook

```typescript
POST /api/webhooks/test

Body:
{
  "webhookId": "wh_abc123"
}

Response:
{
  "success": true,
  "statusCode": 200,
  "message": "Webhook test successful"
}
```

## Examples

See [examples/webhooks](../examples/webhooks) for complete implementations:

- `slack-handler.js` - Slack webhook receiver
- `discord-handler.js` - Discord webhook receiver
- `cicd-trigger.js` - CI/CD integration
- `signature-verify.js` - HMAC signature verification

## Further Reading

- [Slack Incoming Webhooks](https://api.slack.com/messaging/webhooks)
- [Discord Webhooks](https://discord.com/developers/docs/resources/webhook)
- [HMAC Signatures](https://en.wikipedia.org/wiki/HMAC)
