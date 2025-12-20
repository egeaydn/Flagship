# @flagship/sdk-react

React hooks and components for Flagship Feature Flags Platform.

## Installation

```bash
npm install @flagship/sdk-react @flagship/sdk
```

## Quick Start

```tsx
import { createClient } from '@flagship/sdk';
import { FlagshipProvider, useFlag, useFlags } from '@flagship/sdk-react';

const client = createClient({
  apiKey: 'fsk_server_...',
  apiUrl: 'http://localhost:3000/api/v1',
});

function App() {
  return (
    <FlagshipProvider 
      client={client}
      user={{ id: 'user-123', attributes: { plan: 'pro' } }}
    >
      <YourApp />
    </FlagshipProvider>
  );
}

function YourApp() {
  // Use a single flag
  const { enabled, value } = useFlag('new-feature', false);
  
  // Or get all flags
  const { flags, loading } = useFlags();

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {enabled && <NewFeature />}
    </div>
  );
}
```

## API Reference

### `<FlagshipProvider>`

Provider component that wraps your application and manages flag state.

**Props:**

- `client` (FlagshipClient, required): Client instance from `@flagship/sdk`
- `user` (UserContext, optional): User context for targeting
- `refreshInterval` (number, optional): Auto-refresh interval in milliseconds
- `children` (ReactNode, required): Your application components

```tsx
<FlagshipProvider 
  client={client}
  user={{ id: 'user-123' }}
  refreshInterval={60000} // Refresh every 60 seconds
>
  <App />
</FlagshipProvider>
```

### `useFlag(flagKey, defaultValue)`

Hook to access a single flag with its value.

**Parameters:**

- `flagKey` (string): The flag key to retrieve
- `defaultValue` (T): Default value when flag is disabled or not found

**Returns:**

```typescript
{
  enabled: boolean;    // Is the flag enabled?
  value: T;           // Flag value or default
  loading: boolean;   // Is data loading?
  error: Error | null; // Any error that occurred
}
```

**Example:**

```tsx
function FeatureComponent() {
  const { enabled, value, loading } = useFlag('theme', 'light');
  
  if (loading) return <Spinner />;
  
  return (
    <div className={value}>
      {enabled && <PremiumFeature />}
    </div>
  );
}
```

### `useFlags()`

Hook to access all flags at once.

**Returns:**

```typescript
{
  flags: FlagsResponse | null;
  loading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
}
```

**Example:**

```tsx
function Dashboard() {
  const { flags, loading, error, refresh } = useFlags();
  
  if (loading) return <Spinner />;
  if (error) return <Error message={error.message} />;
  
  return (
    <div>
      <button onClick={refresh}>Refresh Flags</button>
      {flags?.flags['dashboard-v2']?.enabled && <NewDashboard />}
      {flags?.flags['analytics']?.enabled && <Analytics />}
    </div>
  );
}
```

## Usage Examples

### Simple Feature Toggle

```tsx
function App() {
  const { enabled } = useFlag('new-ui', false);
  
  return enabled ? <NewUI /> : <OldUI />;
}
```

### Multivariate Flag

```tsx
function PricingPage() {
  const { value } = useFlag('pricing-tier', 'standard');
  
  return (
    <div>
      {value === 'premium' && <PremiumPricing />}
      {value === 'standard' && <StandardPricing />}
      {value === 'basic' && <BasicPricing />}
    </div>
  );
}
```

### Conditional Rendering

```tsx
function Features() {
  const newChat = useFlag('chat-feature', false);
  const darkMode = useFlag('dark-mode', false);
  const maxUpload = useFlag('max-upload-mb', 10);
  
  return (
    <div>
      {newChat.enabled && <ChatWidget />}
      <UploadForm maxSize={maxUpload.value} />
      <ThemeToggle enabled={darkMode.enabled} />
    </div>
  );
}
```

### Loading States

```tsx
function Profile() {
  const { enabled, loading, error } = useFlag('profile-v2', false);
  
  if (loading) return <Skeleton />;
  if (error) return <ErrorBoundary error={error} />;
  
  return enabled ? <ProfileV2 /> : <ProfileV1 />;
}
```

### Manual Refresh

```tsx
function AdminPanel() {
  const { flags, refresh } = useFlags();
  
  const handleFlagUpdate = async () => {
    // Update flag in dashboard, then refresh
    await refresh();
  };
  
  return (
    <div>
      <button onClick={refresh}>Refresh Flags</button>
      <FlagsList flags={flags} />
    </div>
  );
}
```

### Dynamic User Context

```tsx
function UserApp() {
  const [user, setUser] = useState(null);
  
  return (
    <FlagshipProvider 
      client={client}
      user={user ? { 
        id: user.id, 
        attributes: { 
          plan: user.plan,
          country: user.country 
        }
      } : undefined}
    >
      <AppContent />
    </FlagshipProvider>
  );
}
```

### Auto-Refresh

```tsx
function LiveDashboard() {
  return (
    <FlagshipProvider 
      client={client}
      refreshInterval={30000} // Refresh every 30 seconds
    >
      <Dashboard />
    </FlagshipProvider>
  );
}
```

## TypeScript Support

Full TypeScript support with type inference:

```tsx
interface ThemeConfig {
  primary: string;
  secondary: string;
}

const { value } = useFlag<ThemeConfig>('theme-config', {
  primary: '#000',
  secondary: '#fff'
});

// value is typed as ThemeConfig
console.log(value.primary);
```

## Performance

- Automatic caching via `@flagship/sdk`
- Efficient re-renders with React Context
- Optional auto-refresh with configurable intervals
- Minimal bundle size: ~2KB gzipped

## Best Practices

1. **Single Provider**: Use one `FlagshipProvider` at your app root
2. **Stable User Context**: Avoid changing user object reference unnecessarily
3. **Loading States**: Always handle loading state in your components
4. **Error Boundaries**: Wrap flag-dependent features in error boundaries
5. **Default Values**: Provide sensible defaults for all flags

## License

MIT
