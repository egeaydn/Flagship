# SDK Documentation

## Overview

`@flagship/flags` SDK, client ve server tarafında feature flag sorgulama için minimal ve type-safe bir interface sağlar.

**Features:**
- ✅ TypeScript first (full type safety)
- ✅ Automatic caching (in-memory TTL)
- ✅ React hooks (optional `@flagship/flags-react`)
- ✅ Server & client support
- ✅ Zero dependencies (core)
- ✅ < 5KB gzipped

## Installation

```bash
# Core SDK
npm install @flagship/flags

# React hooks (optional)
npm install @flagship/flags-react
```

## Quick Start

### Server-side (Node.js, Next.js API routes)

```typescript
import { createClient } from '@flagship/flags';

const flagship = createClient({
  apiKey: process.env.FLAGSHIP_API_KEY!,
});

// Get all flags for a user
const flags = await flagship.getFlags({
  project: 'my-app',
  environment: 'production',
  user: {
    id: 'user-123',
    email: 'john@example.com',
    role: 'premium',
  },
});

// Check if a flag is enabled
if (flags['new-dashboard']) {
  console.log('New dashboard enabled!');
}

// Or use helper method
if (flagship.isEnabled('new-dashboard', flags)) {
  // ...
}
```

### Client-side (React)

```typescript
// app/providers.tsx
import { FlagshipProvider } from '@flagship/flags-react';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <FlagshipProvider
      apiKey={process.env.NEXT_PUBLIC_FLAGSHIP_CLIENT_KEY!}
      project="my-app"
      environment="production"
      user={{
        id: currentUser.id,
        email: currentUser.email,
        role: currentUser.role,
      }}
    >
      {children}
    </FlagshipProvider>
  );
}
```

```typescript
// components/Dashboard.tsx
import { useFlag, useFlags } from '@flagship/flags-react';

export function Dashboard() {
  // Single flag
  const isNewDashboard = useFlag('new-dashboard');
  
  // All flags
  const { flags, loading } = useFlags();
  
  if (loading) return <Spinner />;
  
  return (
    <div>
      {isNewDashboard ? <NewDashboard /> : <OldDashboard />}
      {flags['beta-features'] && <BetaPanel />}
    </div>
  );
}
```

## API Reference

### Core SDK (`@flagship/flags`)

#### `createClient(config)`

Creates a new Flagship client instance.

```typescript
interface ClientConfig {
  apiKey: string;                    // Required: API key
  baseUrl?: string;                  // Optional: API base URL (default: production)
  cacheTTL?: number;                 // Optional: Cache TTL in ms (default: 60000)
  timeout?: number;                  // Optional: Request timeout (default: 5000)
  onError?: (error: Error) => void;  // Optional: Error handler
}

const client = createClient({
  apiKey: 'fsk_prod_...',
  cacheTTL: 30000, // 30 seconds
  onError: (err) => console.error('Flagship error:', err),
});
```

#### `client.getFlags(context)`

Fetches and evaluates flags for a user.

```typescript
interface FlagContext {
  project: string;
  environment?: string;              // Default: 'production'
  user: {
    id: string;                      // Required for percentage rollouts
    email?: string;
    role?: string;
    attributes?: Record<string, any>;
  };
  flags?: string[];                  // Optional: specific flags to fetch
}

type FlagMap = Record<string, boolean | FlagDetail>;

interface FlagDetail {
  value: boolean;
  reason?: string;
  ruleIndex?: number;
}

const flags = await client.getFlags({
  project: 'web-app',
  environment: 'production',
  user: {
    id: 'user-123',
    email: 'john@example.com',
    role: 'admin',
    attributes: {
      country: 'US',
      plan: 'enterprise',
    },
  },
});

// Result:
// {
//   'new-dashboard': true,
//   'beta-chat': { value: false, reason: 'percentage-miss' }
// }
```

#### `client.isEnabled(flagKey, flags)`

Helper method to check if a flag is enabled.

```typescript
const flags = await client.getFlags(context);

if (client.isEnabled('new-dashboard', flags)) {
  // Flag is enabled
}

// Handles both boolean and FlagDetail types
```

#### `client.clearCache()`

Clears the in-memory cache (useful for testing).

```typescript
client.clearCache();
```

### React SDK (`@flagship/flags-react`)

#### `<FlagshipProvider>`

Context provider for React app.

```typescript
interface FlagshipProviderProps {
  apiKey: string;
  project: string;
  environment?: string;
  user: {
    id: string;
    email?: string;
    role?: string;
    attributes?: Record<string, any>;
  };
  children: React.ReactNode;
  baseUrl?: string;
  cacheTTL?: number;
}

<FlagshipProvider
  apiKey="fsk_client_..."
  project="my-app"
  environment="production"
  user={currentUser}
>
  <App />
</FlagshipProvider>
```

#### `useFlags()`

Hook to get all flags with loading state.

```typescript
const { flags, loading, error, refetch } = useFlags();

if (loading) return <Spinner />;
if (error) return <ErrorMessage error={error} />;

return (
  <div>
    {flags['new-ui'] && <NewUI />}
    <button onClick={refetch}>Refresh Flags</button>
  </div>
);
```

#### `useFlag(flagKey)`

Hook to get a single flag value.

```typescript
const isNewDashboard = useFlag('new-dashboard');

if (isNewDashboard) {
  return <NewDashboard />;
}
```

#### `useFlagDetails(flagKey)`

Hook to get flag value with details.

```typescript
const { value, reason, loading } = useFlagDetails('beta-feature');

return (
  <div>
    Enabled: {value ? 'Yes' : 'No'}
    {reason && <span>Reason: {reason}</span>}
  </div>
);
```

## Usage Examples

### Example 1: Simple Feature Toggle

```typescript
// Server-side API route
import { createClient } from '@flagship/flags';

const flagship = createClient({
  apiKey: process.env.FLAGSHIP_API_KEY,
});

export async function GET(req: Request) {
  const user = await getUser(req);
  
  const flags = await flagship.getFlags({
    project: 'api',
    user: { id: user.id, role: user.role },
  });
  
  if (flags['rate-limit-v2']) {
    // Use new rate limiting algorithm
    return rateLimitV2(req);
  } else {
    // Use old algorithm
    return rateLimitV1(req);
  }
}
```

### Example 2: A/B Testing

```typescript
// React component
import { useFlag } from '@flagship/flags-react';

export function PricingPage() {
  const showNewPricing = useFlag('new-pricing-v2');
  
  useEffect(() => {
    // Track which variant user sees
    analytics.track('pricing_page_view', {
      variant: showNewPricing ? 'v2' : 'v1',
    });
  }, [showNewPricing]);
  
  return showNewPricing ? <PricingV2 /> : <PricingV1 />;
}
```

### Example 3: Gradual Rollout

```typescript
// Dashboard: Set percentage rollout to 10%
// Flag: 'redesigned-editor', percentage rule: 10%

// Frontend
import { useFlag } from '@flagship/flags-react';

export function Editor() {
  const useNewEditor = useFlag('redesigned-editor');
  
  // 10% of users will see new editor
  // Always consistent for same user (deterministic hash)
  return useNewEditor ? <EditorV2 /> : <EditorV1 />;
}
```

### Example 4: Role-based Access

```typescript
// Backend service
const flags = await flagship.getFlags({
  project: 'admin-panel',
  user: {
    id: user.id,
    email: user.email,
    role: user.role, // 'admin', 'user', etc.
  },
});

if (flags['admin-dashboard']) {
  // User has admin role
  return renderAdminDashboard();
} else {
  return res.status(403).json({ error: 'Forbidden' });
}
```

### Example 5: Attribute Targeting

```typescript
const flags = await flagship.getFlags({
  project: 'saas-app',
  user: {
    id: user.id,
    email: user.email,
    attributes: {
      country: 'TR',
      plan: 'enterprise',
      signupDate: '2025-01-01',
    },
  },
});

// Dashboard rule:
// - attribute: 'plan', operator: 'equals', value: 'enterprise' → true
if (flags['enterprise-features']) {
  // Show enterprise features
}

// Dashboard rule:
// - attribute: 'email', operator: 'endsWith', value: '@acme.com' → true
if (flags['beta-internal']) {
  // Show beta features to internal users
}
```

### Example 6: Environment-specific Flags

```typescript
// Development
const devFlags = await flagship.getFlags({
  project: 'web-app',
  environment: 'development',
  user: { id: 'dev-user' },
});
// All flags might be enabled for testing

// Production
const prodFlags = await flagship.getFlags({
  project: 'web-app',
  environment: 'production',
  user: { id: 'user-123' },
});
// Only stable flags enabled
```

### Example 7: Fallback Behavior

```typescript
const flagship = createClient({
  apiKey: process.env.FLAGSHIP_API_KEY,
  onError: (error) => {
    // Log error but don't crash
    console.error('Flagship error:', error);
  },
});

try {
  const flags = await flagship.getFlags(context);
  
  if (flags['new-feature']) {
    return <NewFeature />;
  }
} catch (error) {
  // API is down, use safe default
  return <OldFeature />;
}
```

### Example 8: Caching & Performance

```typescript
// Cache automatically managed, but can be controlled

// Force fresh fetch (bypass cache)
client.clearCache();
const freshFlags = await client.getFlags(context);

// Configure longer cache TTL
const client = createClient({
  apiKey: '...',
  cacheTTL: 300000, // 5 minutes
});

// Cache key includes: project + environment + user.id
// Different users = different cache entries
```

## Advanced Patterns

### Server-side with Next.js App Router

```typescript
// app/layout.tsx (Server Component)
import { createClient } from '@flagship/flags';
import { cookies } from 'next/headers';

async function getFlags(userId: string) {
  const flagship = createClient({
    apiKey: process.env.FLAGSHIP_SERVER_KEY!,
  });
  
  return flagship.getFlags({
    project: 'web-app',
    user: { id: userId },
  });
}

export default async function RootLayout({ children }) {
  const userId = cookies().get('user_id')?.value;
  const flags = await getFlags(userId);
  
  return (
    <html>
      <body>
        <FlagsProvider initialFlags={flags}>
          {children}
        </FlagsProvider>
      </body>
    </html>
  );
}
```

### Testing with Mock Flags

```typescript
// __tests__/Dashboard.test.tsx
import { FlagshipProvider } from '@flagship/flags-react';
import { render } from '@testing-library/react';

function renderWithFlags(ui: React.ReactNode, flags: Record<string, boolean>) {
  return render(
    <FlagshipProvider
      apiKey="test-key"
      project="test"
      user={{ id: 'test-user' }}
      mockFlags={flags} // Override API calls
    >
      {ui}
    </FlagshipProvider>
  );
}

test('renders new dashboard when flag enabled', () => {
  const { getByText } = renderWithFlags(
    <Dashboard />,
    { 'new-dashboard': true }
  );
  
  expect(getByText('New Dashboard')).toBeInTheDocument();
});
```

### Error Handling

```typescript
import { createClient, FlagshipError } from '@flagship/flags';

const client = createClient({
  apiKey: process.env.FLAGSHIP_API_KEY,
});

try {
  const flags = await client.getFlags(context);
} catch (error) {
  if (error instanceof FlagshipError) {
    if (error.code === 'UNAUTHORIZED') {
      // Invalid API key
    } else if (error.code === 'RATE_LIMITED') {
      // Too many requests
      console.log(`Retry after ${error.retryAfter} seconds`);
    } else if (error.code === 'NETWORK_ERROR') {
      // Network issue
    }
  }
}
```

## Performance Best Practices

### 1. Use Server-side Keys for Backend

```typescript
// ✅ Good: Server key (higher rate limit, server-side only)
const client = createClient({
  apiKey: process.env.FLAGSHIP_SERVER_KEY, // fsk_server_...
});

// ❌ Bad: Client key on server (lower rate limit)
const client = createClient({
  apiKey: process.env.NEXT_PUBLIC_FLAGSHIP_CLIENT_KEY,
});
```

### 2. Cache Aggressively

```typescript
// Longer cache for less frequently changing flags
const client = createClient({
  apiKey: '...',
  cacheTTL: 300000, // 5 minutes
});
```

### 3. Batch Flag Checks

```typescript
// ✅ Good: Single API call
const flags = await client.getFlags(context);
const showA = flags['feature-a'];
const showB = flags['feature-b'];
const showC = flags['feature-c'];

// ❌ Bad: Multiple API calls
const flagA = await client.getFlags({ ...context, flags: ['feature-a'] });
const flagB = await client.getFlags({ ...context, flags: ['feature-b'] });
```

### 4. Prefetch on Server, Hydrate on Client

```typescript
// Server: Prefetch flags
const initialFlags = await getFlags(userId);

// Client: Start with server data, refresh in background
<FlagshipProvider initialFlags={initialFlags} user={user}>
  <App />
</FlagshipProvider>
```

## Migration Guide

### From LaunchDarkly

```typescript
// LaunchDarkly
import * as ld from 'launchdarkly-js-client-sdk';
const client = ld.initialize('client-id', user);
await client.waitUntilReady();
const showFeature = client.variation('feature-key', false);

// Flagship
import { createClient } from '@flagship/flags';
const client = createClient({ apiKey: '...' });
const flags = await client.getFlags({ project: '...', user });
const showFeature = flags['feature-key'] ?? false;
```

### From Custom Solution

```typescript
// Old: Direct database query
const flag = await db.query('SELECT enabled FROM flags WHERE key = ?', ['feature-key']);

// New: Flagship SDK
const flags = await flagship.getFlags({ project: 'my-app', user });
const enabled = flags['feature-key'];
```

## Troubleshooting

### Flags not updating

```typescript
// Clear cache and refetch
client.clearCache();
const freshFlags = await client.getFlags(context);
```

### Rate limit errors

```typescript
// Use server key for higher limits
// Or implement exponential backoff
async function getFlagsWithRetry(context, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await client.getFlags(context);
    } catch (error) {
      if (error.code === 'RATE_LIMITED' && i < retries - 1) {
        await sleep(Math.pow(2, i) * 1000);
        continue;
      }
      throw error;
    }
  }
}
```

### TypeScript errors

```typescript
// Ensure types are imported
import type { FlagMap, FlagContext } from '@flagship/flags';

// Define flag keys as const for better type safety
const FLAGS = {
  NEW_DASHBOARD: 'new-dashboard',
  BETA_FEATURES: 'beta-features',
} as const;

const enabled = flags[FLAGS.NEW_DASHBOARD];
```

---

**Next:** [Development Roadmap](./ROADMAP.md)
