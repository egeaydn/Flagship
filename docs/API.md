# Public Flags API

## Genel Bakış

Public Flags API, client uygulamaların feature flag değerlerini sorguladığı ana endpoint'tir. Edge/Serverless function olarak deploy edilir.

**Özellikler:**
- 🔐 API key authentication
- 🚦 Rate limiting
- ⚡ Cache-friendly responses
- 🎯 Rule evaluation engine
- 📊 Minimal response size

## Base URL

```
Production: https://flags.flagship.app
Development: http://localhost:3000
```

## Authentication

Tüm istekler `Authorization` header ile API key gerektirir.

```http
Authorization: Bearer fsk_prod_abc123...
```

**Key Types:**
- `fsk_client_*` - Client-side (browser) kullanımı için, read-only, rate-limited
- `fsk_server_*` - Server-side kullanım için, daha yüksek rate limit

## Endpoints

### POST /v1/flags

Feature flag değerlerini evaluation ile birlikte döner.

#### Request

```http
POST /v1/flags HTTP/1.1
Host: flags.flagship.app
Authorization: Bearer fsk_prod_abc123...
Content-Type: application/json

{
  "project": "campfire",
  "environment": "production",
  "user": {
    "id": "user-123",
    "email": "john@example.com",
    "role": "user",
    "attributes": {
      "country": "TR",
      "plan": "premium",
      "signupDate": "2025-01-15"
    }
  }
}
```

**Request Body Schema:**

```typescript
interface FlagsRequest {
  project: string;           // Project key
  environment?: string;      // Defaults to 'production'
  user: {
    id: string;              // Required for percentage rollouts
    email?: string;
    role?: string;
    attributes?: Record<string, any>;
  };
  flags?: string[];          // Optional: only evaluate specific flags
}
```

#### Response (Success)

```http
HTTP/1.1 200 OK
Content-Type: application/json
Cache-Control: public, max-age=60

{
  "flags": {
    "new-dashboard": true,
    "beta-chat": false,
    "premium-feature": {
      "value": true,
      "reason": "role-match",
      "ruleIndex": 0
    },
    "percentage-rollout": {
      "value": false,
      "reason": "percentage-miss"
    }
  },
  "timestamp": "2025-12-16T10:30:00.000Z",
  "ttl": 60
}
```

**Response Schema:**

```typescript
interface FlagsResponse {
  flags: Record<string, boolean | FlagDetail>;
  timestamp: string;         // ISO 8601
  ttl: number;              // Seconds to cache
}

interface FlagDetail {
  value: boolean;
  reason?: string;          // 'role-match', 'percentage-hit', 'default'
  ruleIndex?: number;       // Which rule matched
}
```

#### Response (Error)

**401 Unauthorized** - Invalid or revoked API key
```json
{
  "error": "unauthorized",
  "message": "Invalid API key"
}
```

**429 Too Many Requests** - Rate limit exceeded
```json
{
  "error": "rate_limit_exceeded",
  "message": "Too many requests. Try again in 60 seconds.",
  "retryAfter": 60
}
```

**400 Bad Request** - Invalid request body
```json
{
  "error": "validation_error",
  "message": "Missing required field: user.id",
  "field": "user.id"
}
```

**500 Internal Server Error** - Server error
```json
{
  "error": "internal_error",
  "message": "An unexpected error occurred"
}
```

### GET /v1/health

Health check endpoint (no auth required).

#### Request

```http
GET /v1/health HTTP/1.1
Host: flags.flagship.app
```

#### Response

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "status": "healthy",
  "version": "1.0.0",
  "timestamp": "2025-12-16T10:30:00.000Z"
}
```

## Authentication Flow

```
1. Client → POST /v1/flags with Authorization header
2. API → Extract key from header
3. API → Lookup key_prefix in database
4. API → Verify bcrypt hash matches
5. API → Check if key revoked
6. [If valid] → Continue to rate limit check
7. [If invalid] → Return 401
```

**Implementation:**

```typescript
async function authenticateApiKey(authHeader: string): Promise<ApiKey | null> {
  // Extract key
  const key = authHeader.replace('Bearer ', '');
  if (!key) return null;
  
  // Get prefix (first 12 chars)
  const prefix = key.substring(0, 12);
  
  // Lookup in DB
  const apiKey = await db.query(
    'SELECT * FROM api_keys WHERE key_prefix = $1 AND NOT revoked',
    [prefix]
  );
  
  if (!apiKey) return null;
  
  // Verify hash
  const valid = await bcrypt.compare(key, apiKey.key_hash);
  if (!valid) return null;
  
  // Update last used
  await db.query(
    'UPDATE api_keys SET last_used_at = NOW() WHERE id = $1',
    [apiKey.id]
  );
  
  return apiKey;
}
```

## Rate Limiting

**Limits (per API key):**
- Client keys: 100 requests / minute
- Server keys: 1000 requests / minute

**Implementation (Upstash Redis):**

```typescript
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL,
  token: process.env.UPSTASH_REDIS_TOKEN,
});

const clientRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(100, '1 m'),
});

const serverRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(1000, '1 m'),
});

async function checkRateLimit(apiKey: ApiKey): Promise<boolean> {
  const limiter = apiKey.key_type === 'client' 
    ? clientRateLimit 
    : serverRateLimit;
    
  const { success } = await limiter.limit(apiKey.id);
  return success;
}
```

**Headers (rate limit info):**

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 87
X-RateLimit-Reset: 1702735260
```

## Caching Strategy

### Response Caching

API responses cache'lenebilir (flags sık değişmiyorsa).

```http
Cache-Control: public, max-age=60, stale-while-revalidate=120
```

- `max-age=60`: 60 saniye fresh
- `stale-while-revalidate=120`: 60-180 saniye arası stale ama kullanılabilir

### SDK-level Caching

SDK kendi cache'ini yönetir (in-memory, 60s TTL).

### Edge Caching (optional)

Vercel Edge Network veya CloudFlare ile aggressive caching:

```typescript
export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  const response = await evaluateFlags(req);
  
  response.headers.set('Cache-Control', 'public, s-maxage=60');
  return response;
}
```

## Flag Evaluation Algorithm

```typescript
interface Flag {
  key: string;
  enabled: boolean;
  rules: Rule[];
}

interface User {
  id: string;
  email?: string;
  role?: string;
  attributes?: Record<string, any>;
}

function evaluateFlag(flag: Flag, user: User): boolean {
  // Quick exit if globally disabled
  if (!flag.enabled) return false;
  
  // Evaluate rules in order
  for (let i = 0; i < flag.rules.length; i++) {
    const rule = flag.rules[i];
    const match = evaluateRule(rule, user, flag.key);
    
    // First matching rule wins
    if (match !== null) {
      return match;
    }
  }
  
  // No rules matched, return default
  return flag.enabled;
}

function evaluateRule(rule: Rule, user: User, flagKey: string): boolean | null {
  switch (rule.type) {
    case 'role':
      if (user.role === rule.role) {
        return rule.value;
      }
      return null;
      
    case 'attribute':
      const attrValue = user.attributes?.[rule.attribute];
      if (!attrValue) return null;
      
      const matches = matchOperator(
        attrValue,
        rule.operator,
        rule.value
      );
      
      return matches ? rule.result : null;
      
    case 'percentage':
      const hash = deterministicHash(user.id + flagKey);
      const bucket = hash % 100;
      
      return bucket < rule.percentage ? rule.value : false;
      
    default:
      return null;
  }
}

function matchOperator(
  userValue: any,
  operator: string,
  ruleValue: string
): boolean {
  const userStr = String(userValue).toLowerCase();
  const ruleStr = String(ruleValue).toLowerCase();
  
  switch (operator) {
    case 'equals':
      return userStr === ruleStr;
    case 'contains':
      return userStr.includes(ruleStr);
    case 'startsWith':
      return userStr.startsWith(ruleStr);
    case 'endsWith':
      return userStr.endsWith(ruleStr);
    default:
      return false;
  }
}

// Consistent hashing for percentage rollouts
function deterministicHash(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}
```

## Error Handling

### Client-side Errors (4xx)

**400 Bad Request:**
- Missing required fields
- Invalid data types
- Malformed JSON

**401 Unauthorized:**
- Missing Authorization header
- Invalid API key
- Revoked API key

**404 Not Found:**
- Project not found
- Invalid endpoint

**429 Too Many Requests:**
- Rate limit exceeded

### Server-side Errors (5xx)

**500 Internal Server Error:**
- Database connection failed
- Unexpected exception

**503 Service Unavailable:**
- Database maintenance
- Temporary outage

### Error Response Format

```typescript
interface ErrorResponse {
  error: string;           // Machine-readable error code
  message: string;         // Human-readable message
  field?: string;          // For validation errors
  retryAfter?: number;     // For rate limit errors (seconds)
}
```

## Request/Response Examples

### Example 1: Simple Flag Check

**Request:**
```json
{
  "project": "web-app",
  "environment": "production",
  "user": {
    "id": "user-456"
  }
}
```

**Response:**
```json
{
  "flags": {
    "dark-mode": true,
    "new-editor": false
  },
  "timestamp": "2025-12-16T10:30:00.000Z",
  "ttl": 60
}
```

### Example 2: Role-based Targeting

**Request:**
```json
{
  "project": "dashboard",
  "user": {
    "id": "admin-123",
    "email": "admin@acme.com",
    "role": "admin"
  }
}
```

**Response:**
```json
{
  "flags": {
    "admin-panel": {
      "value": true,
      "reason": "role-match",
      "ruleIndex": 0
    },
    "beta-features": {
      "value": true,
      "reason": "attribute-match",
      "ruleIndex": 1
    }
  },
  "timestamp": "2025-12-16T10:30:00.000Z",
  "ttl": 60
}
```

### Example 3: Percentage Rollout

**Request (User A):**
```json
{
  "project": "mobile",
  "user": {
    "id": "user-123"
  }
}
```

**Response:**
```json
{
  "flags": {
    "new-ui": {
      "value": true,
      "reason": "percentage-hit"
    }
  }
}
```

**Request (User B):**
```json
{
  "project": "mobile",
  "user": {
    "id": "user-789"
  }
}
```

**Response:**
```json
{
  "flags": {
    "new-ui": {
      "value": false,
      "reason": "percentage-miss"
    }
  }
}
```

### Example 4: Attribute Filtering

**Request:**
```json
{
  "project": "saas",
  "user": {
    "id": "user-555",
    "email": "user@internal.com",
    "attributes": {
      "country": "US",
      "plan": "enterprise"
    }
  }
}
```

**Response:**
```json
{
  "flags": {
    "internal-tools": {
      "value": true,
      "reason": "attribute-match (email endsWith @internal.com)"
    },
    "enterprise-dashboard": {
      "value": true,
      "reason": "attribute-match (plan equals enterprise)"
    }
  }
}
```

## Performance Considerations

### Latency Targets

- p50: < 50ms
- p95: < 150ms
- p99: < 300ms

### Optimization Strategies

1. **Database Query Optimization**
   - Index on `project.key`, `environment.name`
   - Single query to fetch all project flags
   - Avoid N+1 queries

2. **Edge Deployment**
   - Deploy to Vercel Edge Network
   - Automatic global CDN
   - Low cold start

3. **Response Compression**
   - Gzip/Brotli encoding
   - Minimal JSON payload

4. **Connection Pooling**
   - Supabase connection pooler
   - Reuse database connections

## Monitoring & Logging

### Metrics

```typescript
// Track these metrics
{
  "event": "flag_evaluated",
  "project": "campfire",
  "environment": "production",
  "flagCount": 15,
  "userId": "user-123",
  "latency_ms": 42,
  "cacheHit": false,
  "timestamp": "2025-12-16T10:30:00Z"
}
```

### Structured Logs

```json
{
  "level": "info",
  "timestamp": "2025-12-16T10:30:00Z",
  "event": "api_request",
  "method": "POST",
  "path": "/v1/flags",
  "apiKeyId": "key-uuid",
  "project": "campfire",
  "userId": "user-123",
  "responseTime": 45,
  "statusCode": 200
}
```

### Alerts

- Error rate > 1% → Slack notification
- p95 latency > 500ms → Warning
- Rate limit breaches > 100/min → Investigation

---

**Next:** [SDK Documentation](./SDK.md)
