# @flagship/sdk

Core JavaScript/TypeScript SDK for Flagship Feature Flags Platform.

## Installation

```bash
npm install @flagship/sdk
# or
yarn add @flagship/sdk
# or
pnpm add @flagship/sdk
```

## Quick Start

```typescript
import { createClient } from '@flagship/sdk';

// Initialize the client
const client = createClient({
  apiKey: 'fsk_server_your_api_key_here',
  apiUrl: 'https://your-domain.com/api/v1', // Optional, defaults to localhost:3000
  cacheTTL: 60000, // Optional, cache duration in ms (default: 60000)
});

// Get all flags for a user
const flags = await client.getFlags({
  id: 'user-123',
  attributes: {
    email: 'user@example.com',
    plan: 'pro',
  },
});

// Check if a flag is enabled
if (client.isEnabled('new-feature', flags)) {
  // Feature is enabled
}

// Get flag value with default fallback
const theme = client.getValue('theme', flags, 'light');
```

## API Reference

### `createClient(config)`

Creates a new Flagship client instance.

**Parameters:**

- `config.apiKey` (string, required): Your API key from Flagship dashboard
- `config.apiUrl` (string, optional): Base URL for the API. Default: `http://localhost:3000/api/v1`
- `config.cacheTTL` (number, optional): Cache time-to-live in milliseconds. Default: `60000` (1 minute)

**Returns:** `FlagshipClient`

### `client.getFlags(user?)`

Fetches all flags for the current project and environment.

**Parameters:**

- `user` (UserContext, optional): User context for targeting
  - `id` (string): User identifier
  - `attributes` (object): Additional user attributes

**Returns:** `Promise<FlagsResponse>`

```typescript
{
  flags: {
    'flag-key': {
      enabled: true,
      value: 'some-value',
      type: 'boolean' | 'multivariate' | 'number' | 'json'
    }
  },
  user: { id: 'user-123', attributes: { ... } }
}
```

### `client.isEnabled(flagKey, flags)`

Checks if a specific flag is enabled.

**Parameters:**

- `flagKey` (string): The flag key to check
- `flags` (FlagsResponse): The flags response from `getFlags()`

**Returns:** `boolean`

### `client.getValue(flagKey, flags, defaultValue)`

Gets the value of a flag with a fallback default.

**Parameters:**

- `flagKey` (string): The flag key
- `flags` (FlagsResponse): The flags response from `getFlags()`
- `defaultValue` (T): Default value to return if flag is disabled or not found

**Returns:** `T`

### `client.clearCache()`

Manually clears the internal cache. Next `getFlags()` call will fetch fresh data.

## TypeScript Types

```typescript
interface FlagshipConfig {
  apiKey: string;
  apiUrl?: string;
  cacheTTL?: number;
}

interface UserContext {
  id?: string;
  attributes?: Record<string, any>;
}

interface FlagValue {
  enabled: boolean;
  value: any;
  type: 'boolean' | 'multivariate' | 'number' | 'json';
}

interface FlagsResponse {
  flags: Record<string, FlagValue>;
  user?: UserContext;
}
```

## Usage Examples

### Node.js Server

```javascript
const { createClient } = require('@flagship/sdk');

const flagship = createClient({
  apiKey: process.env.FLAGSHIP_API_KEY,
  apiUrl: 'https://flags.yourapp.com/api/v1',
});

app.get('/api/endpoint', async (req, res) => {
  const flags = await flagship.getFlags({
    id: req.user.id,
    attributes: { plan: req.user.plan },
  });

  if (flagship.isEnabled('beta-feature', flags)) {
    // Serve beta feature
  }
});
```

### Next.js API Route

```typescript
import { createClient } from '@flagship/sdk';

const flagship = createClient({
  apiKey: process.env.FLAGSHIP_API_KEY!,
});

export async function GET(request: Request) {
  const flags = await flagship.getFlags({
    id: request.headers.get('user-id') || undefined,
  });

  return Response.json({
    features: {
      newUI: flagship.isEnabled('new-ui', flags),
      maxUpload: flagship.getValue('max-upload-size', flags, 10),
    },
  });
}
```

### Express.js Middleware

```javascript
const { createClient } = require('@flagship/sdk');

const flagship = createClient({
  apiKey: process.env.FLAGSHIP_API_KEY,
});

// Middleware to add flags to request
async function flagsMiddleware(req, res, next) {
  try {
    req.flags = await flagship.getFlags({
      id: req.user?.id,
      attributes: req.user?.attributes,
    });
    next();
  } catch (error) {
    console.error('Failed to fetch flags:', error);
    req.flags = { flags: {} }; // Fallback to empty flags
    next();
  }
}

app.use(flagsMiddleware);

app.get('/feature', (req, res) => {
  if (flagship.isEnabled('premium-feature', req.flags)) {
    res.json({ feature: 'premium' });
  } else {
    res.json({ feature: 'basic' });
  }
});
```

## Caching

The SDK implements automatic in-memory caching to reduce API calls:

- Default TTL: 60 seconds
- Cache is per-client instance
- Cache invalidates automatically after TTL
- Manual cache clearing: `client.clearCache()`

**Best Practices:**

- Use a single client instance per application
- Set appropriate TTL based on your update frequency
- Clear cache on critical flag updates if needed

## Error Handling

```typescript
try {
  const flags = await client.getFlags({ id: 'user-123' });
} catch (error) {
  console.error('Failed to fetch flags:', error);
  // Fallback to default behavior
}
```

Common errors:

- Invalid API key: `401 Unauthorized`
- Network issues: `fetch failed`
- Invalid response: Parse errors

## Performance

- Average response time: ~50-200ms (first call)
- Cached responses: <1ms
- Bundle size:
  - ESM: ~1.42 KB
  - CJS: ~2.45 KB
  - Types: ~912 B

## License

MIT
