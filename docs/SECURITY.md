# Security

## Overview

Güvenlik, feature flags platformu için kritik öneme sahiptir. Multi-tenant yapı, API key yönetimi, ve sensitive data handling dikkatli ele alınmalıdır.

## Threat Model

### Potential Threats

1. **Unauthorized Access**
   - Attacker steals API key → Access to flags
   - Insider threat → Access to other orgs' data

2. **Data Leakage**
   - SQL injection → Database breach
   - RLS bypass → Cross-tenant data access

3. **Denial of Service**
   - Rate limit bypass → API abuse
   - Database overload → Service down

4. **Man-in-the-Middle**
   - API key interception → Replay attacks
   - Unencrypted traffic → Sniffing

## Security Layers

### 1. Authentication & Authorization

#### API Keys

**Generation:**
```typescript
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

async function createApiKey(
  envId: string, 
  name: string, 
  type: 'client' | 'server'
) {
  // Generate cryptographically secure random key
  const randomBytes = crypto.randomBytes(32);
  const rawKey = `fsk_${type}_${randomBytes.toString('hex')}`;
  
  // Hash for storage (bcrypt with salt)
  const keyHash = await bcrypt.hash(rawKey, 10);
  
  // Prefix for fast lookup (first 12 chars)
  const keyPrefix = rawKey.substring(0, 12);
  
  await db.insert('api_keys', {
    environment_id: envId,
    name,
    key_prefix: keyPrefix,
    key_hash: keyHash,
    key_type: type,
    created_at: new Date(),
  });
  
  // Return raw key ONCE (never stored in plaintext)
  return rawKey;
}
```

**Verification:**
```typescript
async function verifyApiKey(providedKey: string): Promise<ApiKey | null> {
  const prefix = providedKey.substring(0, 12);
  
  // Lookup by prefix (indexed, fast)
  const apiKey = await db.queryOne(
    'SELECT * FROM api_keys WHERE key_prefix = $1 AND NOT revoked',
    [prefix]
  );
  
  if (!apiKey) return null;
  
  // Constant-time comparison (prevent timing attacks)
  const valid = await bcrypt.compare(providedKey, apiKey.key_hash);
  
  if (!valid) return null;
  
  return apiKey;
}
```

**Best Practices:**
- ✅ Hash keys with bcrypt (salt rounds: 10)
- ✅ Never log raw keys
- ✅ Show key only once (on creation)
- ✅ Support key rotation (revoke old, create new)
- ✅ Track last_used_at for auditing
- ❌ Never store keys in plaintext
- ❌ Never include keys in URLs

#### Dashboard Authentication (Supabase Auth)

```typescript
// Supabase handles:
// - Email/password authentication
// - JWT token management
// - Session persistence
// - Password reset flows

// middleware.ts (Next.js)
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session && req.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
  
  return res;
}
```

### 2. Row-Level Security (RLS)

Supabase RLS policies enforce multi-tenancy at database level.

#### Organizations

```sql
-- Users can only see orgs they belong to
CREATE POLICY "select_organizations"
ON organizations FOR SELECT
USING (
  id IN (
    SELECT organization_id 
    FROM user_organizations 
    WHERE user_id = auth.uid()
  )
);

-- Only owners can delete
CREATE POLICY "delete_organizations"
ON organizations FOR DELETE
USING (
  id IN (
    SELECT organization_id 
    FROM user_organizations 
    WHERE user_id = auth.uid() AND role = 'owner'
  )
);
```

#### Projects & Flags

```sql
-- Projects visible only to org members
CREATE POLICY "select_projects"
ON projects FOR SELECT
USING (
  organization_id IN (
    SELECT organization_id 
    FROM user_organizations 
    WHERE user_id = auth.uid()
  )
);

-- Flags visible based on project access
CREATE POLICY "select_flags"
ON feature_flags FOR SELECT
USING (
  project_id IN (
    SELECT p.id FROM projects p
    INNER JOIN user_organizations uo 
      ON p.organization_id = uo.organization_id
    WHERE uo.user_id = auth.uid()
  )
);

-- Only admins and owners can update flags
CREATE POLICY "update_flags"
ON feature_flags FOR UPDATE
USING (
  project_id IN (
    SELECT p.id FROM projects p
    INNER JOIN user_organizations uo 
      ON p.organization_id = uo.organization_id
    WHERE uo.user_id = auth.uid() 
      AND uo.role IN ('admin', 'owner')
  )
);
```

**Testing RLS:**
```sql
-- Test as specific user
SET request.jwt.claims.sub = 'user-uuid';

-- Should only see own org's data
SELECT * FROM projects;

-- Should fail (different org)
UPDATE feature_flags SET enabled = true WHERE id = 'other-org-flag-id';
```

### 3. Rate Limiting

Prevent API abuse and DoS attacks.

#### Implementation (Upstash Redis)

```typescript
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

// Different limits for different key types
const clientLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(100, '1 m'),
  analytics: true,
});

const serverLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(1000, '1 m'),
  analytics: true,
});

async function checkRateLimit(
  apiKey: ApiKey,
  identifier: string
): Promise<{ success: boolean; reset: number }> {
  const limiter = apiKey.key_type === 'client' ? clientLimit : serverLimit;
  
  // Use API key ID as identifier
  const result = await limiter.limit(identifier);
  
  return {
    success: result.success,
    reset: result.reset,
  };
}

// In API route
export async function POST(req: Request) {
  const apiKey = await authenticateRequest(req);
  if (!apiKey) return unauthorized();
  
  const { success, reset } = await checkRateLimit(apiKey, apiKey.id);
  
  if (!success) {
    return new Response(JSON.stringify({
      error: 'rate_limit_exceeded',
      message: 'Too many requests',
      retryAfter: Math.ceil((reset - Date.now()) / 1000),
    }), {
      status: 429,
      headers: {
        'X-RateLimit-Limit': apiKey.key_type === 'client' ? '100' : '1000',
        'X-RateLimit-Remaining': '0',
        'X-RateLimit-Reset': reset.toString(),
        'Retry-After': Math.ceil((reset - Date.now()) / 1000).toString(),
      },
    });
  }
  
  // Continue processing...
}
```

#### Rate Limit Tiers

| Key Type | Requests/min | Use Case |
|----------|--------------|----------|
| Client   | 100          | Browser/mobile apps |
| Server   | 1,000        | Backend services |
| Enterprise | 10,000     | High-traffic (future) |

### 4. Input Validation

Prevent injection attacks and malformed data.

#### Request Validation (Zod)

```typescript
import { z } from 'zod';

const FlagsRequestSchema = z.object({
  project: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/),
  environment: z.enum(['development', 'staging', 'production']).optional(),
  user: z.object({
    id: z.string().min(1).max(255),
    email: z.string().email().optional(),
    role: z.string().max(50).optional(),
    attributes: z.record(z.any()).optional(),
  }),
  flags: z.array(z.string()).optional(),
});

export async function POST(req: Request) {
  const body = await req.json();
  
  // Validate input
  const result = FlagsRequestSchema.safeParse(body);
  
  if (!result.success) {
    return new Response(JSON.stringify({
      error: 'validation_error',
      message: result.error.errors[0].message,
      field: result.error.errors[0].path.join('.'),
    }), { status: 400 });
  }
  
  const data = result.data;
  // Continue with validated data...
}
```

#### SQL Injection Prevention

```typescript
// ✅ GOOD: Parameterized queries
const flags = await db.query(
  'SELECT * FROM feature_flags WHERE project_id = $1',
  [projectId]
);

// ❌ BAD: String concatenation
const flags = await db.query(
  `SELECT * FROM feature_flags WHERE project_id = '${projectId}'`
);
```

### 5. Audit Logging

Track all sensitive operations.

```sql
CREATE TABLE audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid,
  user_id uuid,
  action text NOT NULL,
  resource_type text NOT NULL,
  resource_id uuid,
  changes jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_audit_logs_org_created 
  ON audit_logs(organization_id, created_at DESC);
```

**Automatic Logging (Trigger):**
```sql
CREATE OR REPLACE FUNCTION log_flag_change()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO audit_logs (
    organization_id,
    user_id,
    action,
    resource_type,
    resource_id,
    changes
  ) VALUES (
    (SELECT organization_id FROM projects WHERE id = NEW.project_id),
    auth.uid(),
    TG_OP || '_flag',
    'feature_flag',
    NEW.id,
    jsonb_build_object(
      'before', to_jsonb(OLD),
      'after', to_jsonb(NEW)
    )
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER audit_flags
  AFTER INSERT OR UPDATE OR DELETE ON feature_flags
  FOR EACH ROW EXECUTE FUNCTION log_flag_change();
```

**Logged Actions:**
- `flag.created`
- `flag.updated`
- `flag.deleted`
- `flag.toggled`
- `api_key.created`
- `api_key.revoked`
- `user.invited`
- `user.removed`

### 6. Transport Security

#### HTTPS Only

```typescript
// middleware.ts
export function middleware(req: NextRequest) {
  // Redirect HTTP to HTTPS in production
  if (
    process.env.NODE_ENV === 'production' &&
    req.headers.get('x-forwarded-proto') !== 'https'
  ) {
    return NextResponse.redirect(
      `https://${req.headers.get('host')}${req.nextUrl.pathname}`,
      301
    );
  }
}
```

#### CORS Configuration

```typescript
// api/v1/flags/route.ts
export async function POST(req: Request) {
  const origin = req.headers.get('origin');
  
  // Whitelist allowed origins (or allow all for public API)
  const allowedOrigins = [
    'https://myapp.com',
    'https://app.myapp.com',
  ];
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (origin && allowedOrigins.includes(origin)) {
    headers['Access-Control-Allow-Origin'] = origin;
    headers['Access-Control-Allow-Methods'] = 'POST, OPTIONS';
    headers['Access-Control-Allow-Headers'] = 'Authorization, Content-Type';
  }
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers });
  }
  
  // ... rest of logic
}
```

#### Security Headers

```typescript
// next.config.ts
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          }
        ],
      },
    ];
  },
};
```

### 7. Secrets Management

#### Environment Variables

```bash
# .env.local (never committed)
DATABASE_URL=postgresql://...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
UPSTASH_REDIS_URL=https://...
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
```

**Vercel Environment Variables:**
- Production secrets → Vercel dashboard
- Never hardcode secrets in code
- Use `process.env` for runtime access

#### Rotating Secrets

```typescript
// API key rotation
async function rotateApiKey(oldKeyId: string) {
  // 1. Create new key
  const newKey = await createApiKey(envId, 'Rotated key', 'server');
  
  // 2. Give grace period (24 hours)
  await db.query(
    'UPDATE api_keys SET revoked_at = NOW() + interval \'24 hours\' WHERE id = $1',
    [oldKeyId]
  );
  
  // 3. Notify user
  await sendEmail({
    to: user.email,
    subject: 'API Key Rotation',
    body: `Your API key will be revoked in 24 hours. Please update to: ${newKey}`,
  });
  
  return newKey;
}
```

## Security Checklist

### Development
- [ ] All secrets in `.env.local` (not committed)
- [ ] API keys hashed (bcrypt)
- [ ] Input validation (Zod schemas)
- [ ] Parameterized SQL queries
- [ ] RLS policies enabled
- [ ] HTTPS enforced
- [ ] Security headers configured
- [ ] CORS properly configured

### Pre-Production
- [ ] Security audit (automated tools)
- [ ] Dependency vulnerability scan
- [ ] Rate limiting tested
- [ ] RLS policies tested
- [ ] Auth flows tested (edge cases)
- [ ] Secrets rotated
- [ ] Monitoring alerts configured

### Production
- [ ] HTTPS certificate valid
- [ ] Database backups enabled
- [ ] Audit logs retention configured
- [ ] Incident response plan documented
- [ ] Security contact published
- [ ] Regular security reviews scheduled

## Incident Response

### Compromised API Key

1. **Detect:** Unusual API usage, customer report
2. **Respond:**
   - Immediately revoke key via dashboard
   - Check audit logs for affected resources
   - Notify organization owner
3. **Recover:**
   - Generate new key
   - Review RLS policies
   - Update documentation
4. **Learn:**
   - Analyze how key was compromised
   - Improve key protection guidance

### Data Breach

1. **Detect:** Anomalous database access, security alert
2. **Respond:**
   - Isolate affected systems
   - Revoke all API keys
   - Force password resets
3. **Recover:**
   - Restore from backup if needed
   - Audit all RLS policies
   - Patch vulnerabilities
4. **Notify:**
   - Inform affected users (GDPR compliance)
   - Report to authorities if required
   - Public disclosure (responsible)

## Compliance

### GDPR (EU Users)

- **Right to Access:** Export user data via dashboard
- **Right to Deletion:** Delete account + cascade data
- **Data Minimization:** Only collect necessary fields
- **Consent:** Clear ToS and Privacy Policy

### SOC 2 (Future)

- Audit logging (complete trail)
- Access controls (RLS + auth)
- Encryption (in transit + at rest)
- Incident response procedures

---

**Next:** [Deployment](./DEPLOYMENT.md)
