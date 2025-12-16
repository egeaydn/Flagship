# Deployment

## Overview

Flagship platformu, Vercel (Next.js) ve Supabase (PostgreSQL) kullanarak modern, serverless bir deployment stratejisi izler.

**Stack:**
- **Frontend/Dashboard:** Vercel (Next.js App Router)
- **Database:** Supabase (PostgreSQL + Auth)
- **Edge Functions:** Vercel Edge Runtime
- **Cache:** Upstash Redis (rate limiting)
- **Monitoring:** Vercel Analytics + Sentry

## Environments

### Development (Local)

```bash
# Local development setup
git clone <repo>
cd flagship
pnpm install

# Start Supabase locally
supabase start

# Copy environment variables
cp .env.example .env.local

# Start Next.js dev server
pnpm dev
```

**Environment Variables (`.env.local`):**
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

# Upstash Redis (optional for local)
UPSTASH_REDIS_URL=http://localhost:6379

# Feature flags
NODE_ENV=development
```

### Staging

**Purpose:** Pre-production testing, QA environment

**URL:** `https://flagship-staging.vercel.app`

**Database:** Supabase staging project

**Deployment:** Auto-deploy on `develop` branch

```bash
# Push to develop branch
git push origin develop

# Vercel automatically deploys
```

### Production

**Purpose:** Live user-facing application

**URL:** `https://flagship.app` (custom domain)

**Database:** Supabase production project

**Deployment:** Auto-deploy on `main` branch (with approval)

```bash
# Merge to main
git checkout main
git merge develop
git push origin main

# Vercel deploys after checks pass
```

## Vercel Setup

### 1. Project Configuration

**Import Repository:**
1. Go to [vercel.com](https://vercel.com)
2. Import Git Repository
3. Select `flagship` repo
4. Configure:
   - Framework Preset: Next.js
   - Root Directory: `apps/dashboard`
   - Build Command: `pnpm build`
   - Output Directory: `.next`

### 2. Environment Variables

**Production Variables:**
```
NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc... (Secret)
UPSTASH_REDIS_URL=https://... (Secret)
UPSTASH_REDIS_TOKEN=... (Secret)
DATABASE_URL=postgresql://... (Secret)
SENTRY_DSN=https://... (optional)
```

**Setting Variables:**
1. Vercel Dashboard → Project → Settings → Environment Variables
2. Add each variable with appropriate environment (Production/Preview/Development)
3. Mark sensitive values as "Secret"

### 3. Custom Domain

**Setup:**
1. Vercel Dashboard → Domains → Add Domain
2. Enter `flagship.app`
3. Add DNS records:
   ```
   Type: CNAME
   Name: @
   Value: cname.vercel-dns.com
   ```
4. Wait for SSL certificate (auto)

### 4. Build Configuration

**`vercel.json`:**
```json
{
  "version": 2,
  "buildCommand": "pnpm build",
  "devCommand": "pnpm dev",
  "installCommand": "pnpm install",
  "framework": "nextjs",
  "regions": ["iad1"],
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=60, stale-while-revalidate=120"
        }
      ]
    }
  ]
}
```

### 5. Edge Functions

**Configuration (`app/api/v1/flags/route.ts`):**
```typescript
// Deploy to edge runtime
export const runtime = 'edge';
export const preferredRegion = ['iad1', 'sfo1']; // US East & West

export async function POST(req: Request) {
  // ... API logic
}
```

**Benefits:**
- Low latency (global edge network)
- Auto-scaling
- No cold starts

## Supabase Setup

### 1. Project Creation

1. Go to [supabase.com](https://supabase.com)
2. Create Organization → `Flagship`
3. Create Project:
   - Name: `flagship-prod`
   - Database Password: (generate strong)
   - Region: `US East` (closest to Vercel)

### 2. Database Migrations

**Local → Production:**
```bash
# 1. Create migration locally
supabase migration new initial_schema

# 2. Write SQL in /supabase/migrations/...initial_schema.sql

# 3. Test locally
supabase db reset

# 4. Push to production
supabase db push
```

**Migration Files:**
```
/infra/supabase/migrations/
  001_initial_schema.sql
  002_add_env_overrides.sql
  003_audit_triggers.sql
```

### 3. Authentication Setup

**Enable Email Provider:**
1. Supabase Dashboard → Authentication → Providers
2. Enable Email
3. Configure email templates (welcome, password reset)

**Auth Settings:**
```
Site URL: https://flagship.app
Redirect URLs: https://flagship.app/auth/callback
JWT expiry: 3600 (1 hour)
```

### 4. Row Level Security

**Enable RLS on all tables:**
```sql
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE feature_flags ENABLE ROW LEVEL SECURITY;
-- ... etc
```

**Test Policies:**
```bash
# SQL Editor in Supabase dashboard
SET request.jwt.claims.sub = 'test-user-uuid';
SELECT * FROM projects; -- Should only see own org
```

### 5. Backups

**Automatic Backups (Supabase Pro):**
- Daily backups (7 days retention)
- Point-in-time recovery

**Manual Backup:**
```bash
# Export database
supabase db dump > backup.sql

# Restore
psql $DATABASE_URL < backup.sql
```

## Upstash Redis Setup

### 1. Create Database

1. Go to [upstash.com](https://upstash.com)
2. Create Database:
   - Name: `flagship-ratelimit`
   - Region: `US-East-1` (same as Supabase)
   - Type: Regional (lower latency)

### 2. Get Credentials

```bash
UPSTASH_REDIS_URL=https://...upstash.io
UPSTASH_REDIS_TOKEN=AX...
```

Add to Vercel environment variables.

## CI/CD Pipeline

### GitHub Actions Workflow

**`.github/workflows/ci.yml`:**
```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm lint

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: pnpm install
      - run: pnpm test

  build:
    runs-on: ubuntu-latest
    needs: [lint, test]
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
      - run: pnpm install
      - run: pnpm build
      
  e2e:
    runs-on: ubuntu-latest
    needs: build
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
      - run: pnpm install
      - run: pnpm playwright install
      - run: pnpm test:e2e
```

### Deployment Flow

```
Developer → Git Push
    ↓
GitHub Actions (CI)
    ↓
✅ Lint, Test, Build
    ↓
Vercel Preview Deploy (PR)
    ↓
Manual Review & Approve
    ↓
Merge to Main
    ↓
Vercel Production Deploy
    ↓
Supabase Migrations (auto)
    ↓
✅ Production Live
```

### Branch Strategy

```
main (production)
  ↑
  merge after review
  ↑
develop (staging)
  ↑
  merge feature branches
  ↑
feature/* (dev branches)
```

## Monitoring & Observability

### Vercel Analytics

**Built-in Metrics:**
- Real User Monitoring (RUM)
- Web Vitals (LCP, FID, CLS)
- Edge function latency
- Bandwidth usage

**Access:** Vercel Dashboard → Analytics

### Sentry (Error Tracking)

**Setup:**
```bash
pnpm add @sentry/nextjs
```

**`sentry.client.config.ts`:**
```typescript
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
  beforeSend(event) {
    // Don't send API key leaks
    if (event.request?.headers?.authorization) {
      delete event.request.headers.authorization;
    }
    return event;
  },
});
```

**Sentry Dashboard:** Track errors, performance issues

### Logs (Vercel Logs)

**Structured Logging:**
```typescript
import { log } from '@/lib/logger';

log.info('Flag evaluated', {
  project: 'campfire',
  flagKey: 'new-dashboard',
  userId: 'user-123',
  result: true,
  latency: 42,
});
```

**View Logs:**
```bash
# Vercel CLI
vercel logs <deployment-url>

# Or Vercel Dashboard → Deployments → Logs
```

### Uptime Monitoring

**BetterUptime / Uptime Robot:**
- Monitor `https://flagship.app/api/health`
- Alert on downtime (Slack/email)
- 99.9% SLA target

### Custom Metrics (Posthog - optional)

**Track:**
- Flag evaluation count
- API response times
- User actions (dashboard)

## Scaling Considerations

### Current (MVP)

| Resource | Limit | Scaling |
|----------|-------|---------|
| Vercel | 100GB bandwidth/mo | Auto-scales |
| Supabase Free | 500MB DB | Upgrade to Pro |
| Upstash Free | 10k commands/day | Upgrade |

### Growth (1k+ users)

**Vercel Pro ($20/mo):**
- Unlimited bandwidth
- Advanced analytics
- Team collaboration

**Supabase Pro ($25/mo):**
- 8GB database
- Daily backups
- Point-in-time recovery

**Upstash Pro ($10/mo):**
- 100k commands/day
- Better latency

### High Traffic (10k+ users)

**Optimizations:**
- CDN caching (CloudFlare)
- Database read replicas
- Redis cache layer (flag responses)
- Multi-region deployment

## Rollback Strategy

### Vercel Rollback

```bash
# CLI rollback to previous deployment
vercel rollback

# Or via dashboard:
# Deployments → Select previous → Promote to Production
```

### Database Rollback

```sql
-- Revert migration
supabase migration down

-- Or restore from backup
supabase db restore <backup-id>
```

### Feature Flag Rollback

**Built-in safety:**
- Toggle flag off in dashboard (instant)
- No code deployment needed
- Audit log tracks change

## Health Checks

### API Health Endpoint

**`/api/health`:**
```typescript
export async function GET() {
  try {
    // Check database
    await db.query('SELECT 1');
    
    // Check Redis
    await redis.ping();
    
    return Response.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.APP_VERSION,
      services: {
        database: 'up',
        redis: 'up',
      },
    });
  } catch (error) {
    return Response.json({
      status: 'unhealthy',
      error: error.message,
    }, { status: 503 });
  }
}
```

### Monitoring Health

```bash
# Curl check
curl https://flagship.app/api/health

# Expected response
{
  "status": "healthy",
  "timestamp": "2025-12-16T10:30:00.000Z",
  "version": "1.0.0"
}
```

## Disaster Recovery

### Backup Strategy

**Database:**
- Automated daily backups (Supabase)
- Manual export before major changes
- Retention: 7 days (free), 30 days (pro)

**Code:**
- Git repository (GitHub)
- Multiple branches (main, develop)
- Tag releases (`v1.0.0`)

**Secrets:**
- Vercel environment variables
- 1Password vault (team access)
- Rotate API keys quarterly

### Recovery Steps

**Scenario: Database corruption**
1. Identify issue (monitoring alert)
2. Stop writes (disable dashboard access temporarily)
3. Restore from latest backup
4. Verify data integrity
5. Resume operations
6. Post-mortem document

**Scenario: Vercel outage**
1. Check Vercel status page
2. Communicate with users (status page)
3. Wait for resolution (or deploy to backup provider)
4. Verify deployment after recovery

## Security Hardening

### Production Checklist

- [ ] HTTPS enforced (redirects)
- [ ] Security headers configured
- [ ] API keys rotated
- [ ] Database backups enabled
- [ ] RLS policies tested
- [ ] Rate limiting active
- [ ] Secrets in Vercel (not code)
- [ ] Sentry error tracking
- [ ] Uptime monitoring
- [ ] Incident response plan

### Regular Maintenance

**Weekly:**
- Review error logs (Sentry)
- Check uptime reports
- Monitor API usage

**Monthly:**
- Dependency updates (`pnpm update`)
- Security audit (npm audit)
- Review audit logs
- Performance review

**Quarterly:**
- API key rotation
- Database optimization
- Cost review
- Security review

## Cost Estimation

### MVP (Free Tier)

- Vercel Hobby: $0
- Supabase Free: $0
- Upstash Free: $0
- **Total: $0/month**

### Production (Low Traffic)

- Vercel Pro: $20/mo
- Supabase Pro: $25/mo
- Upstash Pro: $10/mo
- Sentry Team: $26/mo
- **Total: ~$80/month**

### Scale (1k+ active users)

- Vercel Pro: $20/mo
- Supabase Team: $599/mo (large DB)
- Upstash Pro: $50/mo
- Sentry Business: $80/mo
- **Total: ~$750/month**

---

**Proje dokümantasyonu tamamlandı!** 🎉

## Quick Links

- [Main README](./README.md)
- [Architecture](./ARCHITECTURE.md)
- [Database Schema](./DATABASE.md)
- [API Design](./API.md)
- [SDK Documentation](./SDK.md)
- [Development Roadmap](./ROADMAP.md)
- [Security](./SECURITY.md)
- [Deployment](./DEPLOYMENT.md) (this doc)
