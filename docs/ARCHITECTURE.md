# Sistem Mimarisi

## Genel Bakış

Feature Flags platformu, üç ana katmandan oluşan modern bir web uygulamasıdır:

1. **Dashboard (Frontend + Backend)** - Next.js App Router
2. **Public Flags API** - Edge Functions / Serverless
3. **Database & Auth** - Supabase (PostgreSQL + Auth)

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENT APPS                          │
│  (Web App, Mobile App, Backend Service, etc.)               │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ @flagship/flags SDK
                         │
                    ┌────▼────────────────┐
                    │  Public Flags API   │
                    │  (Edge Function)    │
                    │  GET /v1/flags      │
                    └────┬────────────────┘
                         │
                         │ Read flags + evaluate rules
                         │
        ┌────────────────▼─────────────────┐
        │                                   │
        │       Supabase PostgreSQL        │
        │                                   │
        │  • feature_flags                 │
        │  • projects                      │
        │  • environments                  │
        │  • api_keys                      │
        │  • audit_logs                    │
        │                                   │
        └────────────────▲─────────────────┘
                         │
                         │ Admin operations (CRUD)
                         │
                    ┌────┴────────────────┐
                    │   Dashboard App     │
                    │   (Next.js)         │
                    │                     │
                    │  • Project mgmt     │
                    │  • Flag editor      │
                    │  • API key mgmt     │
                    │  • Audit logs       │
                    └─────────────────────┘
                         │
                         │ Supabase Auth
                         │
                    ┌────▼────────────────┐
                    │   Admin Users       │
                    └─────────────────────┘
```

## Komponent Detayları

### 1. Dashboard (Next.js App)

**Sorumluluklar:**
- Admin kullanıcı UI/UX
- Proje, environment, flag CRUD işlemleri
- API key oluşturma ve yönetimi
- Audit log görüntüleme
- Basit analytics

**Teknoloji:**
- Next.js 15 App Router (React Server Components)
- TypeScript
- Tailwind CSS + shadcn/ui
- React Query (data fetching & cache)
- Zustand (client state)
- Supabase JS Client

**Klasör Yapısı:**
```
/apps/dashboard
  /app
    /api                    # Next.js API routes (internal)
    /dashboard              # Dashboard pages
      /projects
      /flags
      /environments
      /api-keys
      /audit-logs
    /auth                   # Login/signup pages
    layout.tsx
    page.tsx
  /components
    /ui                     # shadcn components
    /features               # Feature-specific components
      /flag-editor
      /rule-builder
  /lib
    /supabase              # Supabase client
    /hooks                 # Custom hooks
    /utils                 # Helper functions
```

**Data Flow:**
1. User → Dashboard UI
2. Dashboard → Supabase Client (authenticated)
3. Supabase → RLS policies check
4. Database operation (CRUD)
5. Audit log creation (trigger)
6. UI update (React Query invalidation)

### 2. Public Flags API

**Sorumluluklar:**
- Client SDK isteklerini karşılama
- API key authentication
- Rule evaluation (flag engine)
- Response caching
- Rate limiting

**Endpoint:**
```
POST /v1/flags
Authorization: Bearer <api-key>
Content-Type: application/json

Request:
{
  "project": "campfire",
  "env": "prod",
  "user": {
    "id": "user-123",
    "email": "user@example.com",
    "role": "user",
    "attributes": {
      "country": "TR",
      "plan": "premium"
    }
  }
}

Response:
{
  "flags": {
    "new-dashboard": true,
    "beta-chat": false,
    "premium-feature": {
      "value": true,
      "reason": "role-match",
      "ruleIndex": 0
    }
  },
  "timestamp": "2025-12-16T10:30:00.000Z",
  "ttl": 60
}
```

**İmplementasyon Seçenekleri:**

**Option A: Vercel Edge Function**
```typescript
// /apps/dashboard/app/api/v1/flags/route.ts
export const runtime = 'edge';

export async function POST(req: Request) {
  // Auth
  const apiKey = req.headers.get('authorization')?.replace('Bearer ', '');
  
  // Rate limit check
  await rateLimit(apiKey);
  
  // Parse request
  const body = await req.json();
  
  // Fetch flags from DB
  const flags = await getProjectFlags(body.project, body.env);
  
  // Evaluate rules
  const evaluated = evaluateFlags(flags, body.user);
  
  return Response.json({ flags: evaluated, timestamp: new Date() });
}
```

**Option B: Supabase Edge Function**
```typescript
// /infra/supabase/functions/flags/index.ts
Deno.serve(async (req) => {
  // Similar logic
});
```

**Tercih: Vercel Edge** (dashboard ile aynı repo, kolay deployment)

### 3. Rule Engine (Core Logic)

Flag evaluation mantığı:

```typescript
interface Flag {
  id: string;
  key: string;
  enabled: boolean;
  rules: Rule[];
}

interface Rule {
  type: 'role' | 'attribute' | 'percentage';
  // Role-based
  role?: string;
  // Attribute-based
  attribute?: string;
  operator?: 'equals' | 'contains' | 'endsWith' | 'startsWith';
  value?: string;
  // Percentage-based
  percentage?: number;
  // Result
  result: boolean;
}

interface User {
  id: string;
  email?: string;
  role?: string;
  attributes?: Record<string, any>;
}

function evaluateFlag(flag: Flag, user: User): boolean {
  // Quick exit if disabled
  if (!flag.enabled) return false;
  
  // Evaluate rules in order
  for (const rule of flag.rules) {
    const match = evaluateRule(rule, user);
    if (match !== null) return match;
  }
  
  // Default to enabled value if no rules matched
  return flag.enabled;
}

function evaluateRule(rule: Rule, user: User): boolean | null {
  switch (rule.type) {
    case 'role':
      if (user.role === rule.role) return rule.result;
      break;
      
    case 'attribute':
      const userValue = user.attributes?.[rule.attribute!];
      if (matchOperator(userValue, rule.operator!, rule.value!)) {
        return rule.result;
      }
      break;
      
    case 'percentage':
      const hash = deterministicHash(user.id + flag.key);
      const bucket = hash % 100;
      if (bucket < rule.percentage!) return rule.result;
      break;
  }
  
  return null; // No match
}

// Deterministic hash for consistent percentage rollout
function deterministicHash(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = ((hash << 5) - hash) + input.charCodeAt(i);
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}
```

**Rule Evaluation Stratejisi:**
- Rules sırayla değerlendirilir (first match wins)
- Percentage rollout deterministik olmalı (userId + flagKey hash)
- Cache friendly (flags değişmezse cache hit)

### 4. Database Layer (Supabase)

**Bağlantı:**
```typescript
// Server-side (Dashboard)
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Admin key
);

// Client-side (Dashboard)
import { createBrowserClient } from '@supabase/ssr';

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
```

**RLS (Row Level Security):**
```sql
-- Users can only see their organization's projects
CREATE POLICY "select_projects_own_org" 
ON projects FOR SELECT 
USING (
  organization_id IN (
    SELECT organization_id 
    FROM user_organizations 
    WHERE user_id = auth.uid()
  )
);

-- Only admins can update flags
CREATE POLICY "update_flags_admin"
ON feature_flags FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);
```

### 5. SDK Architecture

**Package Structure:**
```
/packages/sdk
  /src
    /client.ts          # Main client
    /api.ts             # API calls
    /cache.ts           # In-memory cache
    /types.ts           # TypeScript types
    /utils.ts           # Helpers
  /index.ts

/packages/sdk-react
  /src
    /provider.tsx       # Context provider
    /hooks.ts           # useFlags, useFlag
  /index.ts
```

**Core Client:**
```typescript
// packages/sdk/src/client.ts
export class FlagshipClient {
  private apiKey: string;
  private baseUrl: string;
  private cache: Map<string, CacheEntry>;
  private cacheTTL: number = 60000; // 60s

  constructor(config: ClientConfig) {
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl || 'https://flags.flagship.app';
    this.cache = new Map();
  }

  async getFlags(context: FlagContext): Promise<FlagMap> {
    const cacheKey = this.getCacheKey(context);
    
    // Check cache
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() < cached.expiry) {
      return cached.data;
    }

    // Fetch from API
    const response = await fetch(`${this.baseUrl}/v1/flags`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(context),
    });

    if (!response.ok) {
      throw new Error(`Flagship API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Cache response
    this.cache.set(cacheKey, {
      data: data.flags,
      expiry: Date.now() + this.cacheTTL,
    });

    return data.flags;
  }

  isEnabled(flagKey: string, flags: FlagMap): boolean {
    const flag = flags[flagKey];
    if (typeof flag === 'boolean') return flag;
    if (typeof flag === 'object' && 'value' in flag) return flag.value;
    return false;
  }
}
```

**React Integration:**
```typescript
// packages/sdk-react/src/hooks.ts
import { useContext, useEffect, useState } from 'react';
import { FlagshipContext } from './provider';

export function useFlags() {
  const client = useContext(FlagshipContext);
  const [flags, setFlags] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client.getFlags().then(setFlags).finally(() => setLoading(false));
  }, [client]);

  return { flags, loading };
}

export function useFlag(flagKey: string): boolean {
  const { flags } = useFlags();
  return client.isEnabled(flagKey, flags);
}
```

## Data Flow Senaryoları

### Senaryo 1: Admin Flag Oluşturma

```
1. Admin → Dashboard UI (Create Flag form)
2. Dashboard → POST /api/flags (Next.js API route)
3. API Route → Supabase Client (insert)
4. Supabase → RLS check (auth.uid() has permission?)
5. Database → Insert into feature_flags table
6. Database → Trigger → Insert audit_log entry
7. Supabase → Return success
8. Dashboard → React Query invalidation
9. UI → Refresh flag list
```

### Senaryo 2: Client App Flag Sorgulama

```
1. Client App → SDK.getFlags({ project, env, user })
2. SDK → Check in-memory cache
3. [Cache miss] → POST /v1/flags API
4. Edge Function → Verify API key (hash check)
5. Edge Function → Rate limit check
6. Edge Function → Query flags from DB
7. Database → Return flags + rules (RLS bypassed for API key)
8. Edge Function → Evaluate rules for user
9. Edge Function → Return evaluated flags
10. SDK → Cache response (60s TTL)
11. SDK → Return flags to app
12. Client App → if (flags['new-ui']) render new UI
```

### Senaryo 3: Percentage Rollout

```
Flag: "new-dashboard", percentage: 30%

User A (id: "user-123"):
- hash("user-123" + "new-dashboard") % 100 = 42
- 42 >= 30 → FALSE

User B (id: "user-456"):
- hash("user-456" + "new-dashboard") % 100 = 15
- 15 < 30 → TRUE

→ %30 kullanıcı görür, tutarlı şekilde
```

## Caching Stratejisi

### SDK Cache (Client-side)
- In-memory Map
- TTL: 60 saniye (configurable)
- Key: `${project}:${env}:${userId}`

### API Cache (Edge)
- Vercel Edge Cache (optional)
- Cache-Control header
- TTL: 30 saniye

### Database Query Cache
- Supabase PostgREST cache
- Minimal (flags frequently change)

**Trade-off:** Daha uzun cache = daha hızlı, ama flag değişiklikleri geç yansır.

## Güvenlik Katmanları

```
┌─────────────────────────────────────┐
│         Client Request              │
└─────────────┬───────────────────────┘
              │
         ┌────▼─────┐
         │ Rate     │  IP + API key bazlı
         │ Limiting │  (Upstash/Redis)
         └────┬─────┘
              │
         ┌────▼─────┐
         │ API Key  │  bcrypt hash check
         │ Auth     │  revoked kontrolü
         └────┬─────┘
              │
         ┌────▼─────┐
         │ RLS      │  Row-Level Security
         │ Policy   │  (Supabase)
         └────┬─────┘
              │
         ┌────▼─────┐
         │ Database │
         │ Query    │
         └──────────┘
```

## Monitoring & Observability

### Metrics (Vercel Analytics)
- Request per second (RPS)
- Edge function latency (p50, p95, p99)
- Cache hit ratio
- Error rate

### Logging (Structured JSON)
```typescript
{
  "timestamp": "2025-12-16T10:30:00Z",
  "level": "info",
  "event": "flag_evaluated",
  "project": "campfire",
  "env": "prod",
  "flagKey": "new-dashboard",
  "userId": "user-123",
  "result": true,
  "reason": "percentage-match",
  "latency_ms": 45
}
```

### Alerting
- Error rate > 1% → PagerDuty/Slack
- Latency p95 > 500ms → Warning
- Rate limit hits > 100/min → Investigation

## Scalability Considerations

### Current (MVP)
- Vercel Edge: Auto-scales
- Supabase Free: 500MB DB, 2GB bandwidth
- SDK cache: Reduces API calls

### Future (Growth)
- CDN caching (CloudFlare)
- Read replicas (Supabase Pro)
- Separate read/write databases
- Redis for centralized cache
- WebSocket for realtime updates

---

**Next:** [Database Schema](./DATABASE.md)
