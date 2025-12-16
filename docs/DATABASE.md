# Database Schema

## Genel Bakış

PostgreSQL (Supabase) kullanarak multi-tenant, audit-logged bir veri modeli tasarlıyoruz.

**Temel Prensipler:**
- Multi-tenancy: Organization bazlı izolasyon
- Environment separation: Her environment için ayrı API keys
- Audit trail: Tüm değişiklikler loglanır
- RLS (Row Level Security): Tenant verisi güvenliği

## Entity Relationship Diagram

```
┌─────────────────┐
│ organizations   │
└────────┬────────┘
         │ 1
         │
         │ N
┌────────▼────────┐       ┌─────────────────┐
│ projects        │◄──────┤ feature_flags   │
└────────┬────────┘  1:N  └─────────────────┘
         │ 1
         │
         │ N
┌────────▼────────┐       ┌─────────────────┐
│ environments    │◄──────┤ api_keys        │
└─────────────────┘  1:N  └─────────────────┘

         ┌─────────────────┐
         │ audit_logs      │
         └─────────────────┘
         
┌─────────────────┐
│ user_orgs       │  (junction table)
└─────────────────┘
```

## Tablolar

### 1. organizations

Organization'lar multi-tenancy'nin temel birimidir. Her müşteri bir organization'dır.

```sql
CREATE TABLE organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL, -- URL-friendly identifier
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_organizations_slug ON organizations(slug);
```

**Örnek Data:**
```sql
INSERT INTO organizations (name, slug) VALUES
  ('Acme Corp', 'acme-corp'),
  ('Beta Inc', 'beta-inc');
```

### 2. user_organizations

Kullanıcıların organization'lara aidiyeti (many-to-many).

```sql
CREATE TABLE user_organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('owner', 'admin', 'member')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, organization_id)
);

CREATE INDEX idx_user_orgs_user_id ON user_organizations(user_id);
CREATE INDEX idx_user_orgs_org_id ON user_organizations(organization_id);
```

### 3. projects

Her organization'ın birden fazla projesi olabilir (örn: web-app, mobile-app).

```sql
CREATE TABLE projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  key text NOT NULL, -- e.g. "campfire", unique within org
  name text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(organization_id, key)
);

CREATE INDEX idx_projects_org_id ON projects(organization_id);
CREATE INDEX idx_projects_key ON projects(key);
```

**Örnek Data:**
```sql
INSERT INTO projects (organization_id, key, name, description) VALUES
  ('org-uuid-1', 'campfire', 'Campfire App', 'Main web application'),
  ('org-uuid-1', 'mobile', 'Mobile App', 'iOS and Android app');
```

### 4. environments

Her proje için birden fazla environment (dev, staging, prod).

```sql
CREATE TABLE environments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL CHECK (name IN ('development', 'staging', 'production')),
  description text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(project_id, name)
);

CREATE INDEX idx_environments_project_id ON environments(project_id);
```

**Örnek Data:**
```sql
INSERT INTO environments (project_id, name) VALUES
  ('project-uuid-1', 'development'),
  ('project-uuid-1', 'staging'),
  ('project-uuid-1', 'production');
```

### 5. feature_flags

Asıl feature flag tanımları. Rules JSON olarak saklanır.

```sql
CREATE TABLE feature_flags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  key text NOT NULL, -- e.g. "new-dashboard"
  name text NOT NULL,
  description text,
  enabled boolean DEFAULT false, -- Global default
  rules jsonb DEFAULT '[]'::jsonb, -- Array of rule objects
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id),
  UNIQUE(project_id, key)
);

CREATE INDEX idx_flags_project_id ON feature_flags(project_id);
CREATE INDEX idx_flags_key ON feature_flags(key);
CREATE INDEX idx_flags_enabled ON feature_flags(enabled);
```

**Rules JSONB Schema:**

```typescript
// TypeScript type definition
type Rule = 
  | RoleRule
  | AttributeRule
  | PercentageRule;

interface RoleRule {
  type: 'role';
  role: string;          // e.g. 'admin', 'premium'
  value: boolean;        // return value if role matches
}

interface AttributeRule {
  type: 'attribute';
  attribute: string;     // e.g. 'email', 'country'
  operator: 'equals' | 'contains' | 'startsWith' | 'endsWith';
  value: string;
  result: boolean;
}

interface PercentageRule {
  type: 'percentage';
  percentage: number;    // 0-100
  value: boolean;
}
```

**Örnek Rules:**
```sql
-- Flag with multiple rules
INSERT INTO feature_flags (project_id, key, name, enabled, rules) VALUES (
  'project-uuid',
  'new-dashboard',
  'New Dashboard UI',
  false,
  '[
    {
      "type": "role",
      "role": "admin",
      "value": true
    },
    {
      "type": "attribute",
      "attribute": "email",
      "operator": "endsWith",
      "value": "@acme.com",
      "result": true
    },
    {
      "type": "percentage",
      "percentage": 30,
      "value": true
    }
  ]'::jsonb
);
```

### 6. environment_overrides

Environment-specific flag overrides (optional table, alternatif: rules içinde env check).

```sql
CREATE TABLE environment_overrides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  flag_id uuid REFERENCES feature_flags(id) ON DELETE CASCADE,
  environment_id uuid REFERENCES environments(id) ON DELETE CASCADE,
  enabled boolean NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(flag_id, environment_id)
);

CREATE INDEX idx_env_overrides_flag_id ON environment_overrides(flag_id);
```

**Kullanım:**
```sql
-- Prod'da %100 açık, staging'de %50 açık
INSERT INTO environment_overrides (flag_id, environment_id, enabled) VALUES
  ('flag-uuid', 'prod-env-uuid', true),
  ('flag-uuid', 'staging-env-uuid', false);
```

### 7. api_keys

API authentication için key'ler. Environment bazlı.

```sql
CREATE TABLE api_keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  environment_id uuid REFERENCES environments(id) ON DELETE CASCADE,
  name text NOT NULL,
  key_prefix text NOT NULL, -- e.g. 'fsk_prod_' (visible)
  key_hash text NOT NULL,   -- bcrypt hash of full key
  key_type text NOT NULL CHECK (key_type IN ('client', 'server')),
  revoked boolean DEFAULT false,
  last_used_at timestamptz,
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id)
);

CREATE INDEX idx_api_keys_env_id ON api_keys(environment_id);
CREATE INDEX idx_api_keys_prefix ON api_keys(key_prefix);
CREATE INDEX idx_api_keys_revoked ON api_keys(revoked) WHERE NOT revoked;
```

**Key Generation Flow:**
```typescript
// Server-side key creation
async function createApiKey(envId: string, name: string, type: 'client' | 'server') {
  // Generate random key
  const rawKey = `fsk_${type}_${crypto.randomUUID().replace(/-/g, '')}`;
  
  // Hash for storage
  const keyHash = await bcrypt.hash(rawKey, 10);
  
  // Prefix for quick lookup
  const keyPrefix = rawKey.substring(0, 12);
  
  // Store in DB
  await db.insert('api_keys', {
    environment_id: envId,
    name,
    key_prefix: keyPrefix,
    key_hash: keyHash,
    key_type: type
  });
  
  // Return raw key ONCE (never stored again)
  return rawKey;
}
```

### 8. audit_logs

Tüm flag değişikliklerinin logu.

```sql
CREATE TABLE audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES organizations(id),
  project_id uuid REFERENCES projects(id),
  environment_id uuid REFERENCES environments(id),
  user_id uuid REFERENCES auth.users(id),
  action text NOT NULL, -- 'flag.created', 'flag.updated', 'flag.deleted'
  resource_type text NOT NULL, -- 'flag', 'project', 'api_key'
  resource_id uuid,
  changes jsonb, -- before/after state
  ip_address inet,
  user_agent text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_audit_logs_org_id ON audit_logs(organization_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
```

**Örnek Log Entry:**
```json
{
  "organization_id": "org-uuid",
  "project_id": "project-uuid",
  "user_id": "user-uuid",
  "action": "flag.updated",
  "resource_type": "flag",
  "resource_id": "flag-uuid",
  "changes": {
    "before": { "enabled": false },
    "after": { "enabled": true }
  },
  "ip_address": "192.168.1.1",
  "user_agent": "Mozilla/5.0...",
  "created_at": "2025-12-16T10:30:00Z"
}
```

## Database Triggers

### Auto-update `updated_at`

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_feature_flags_updated_at 
  BEFORE UPDATE ON feature_flags
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### Auto-create Audit Log

```sql
CREATE OR REPLACE FUNCTION create_audit_log()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO audit_logs (
    organization_id,
    project_id,
    user_id,
    action,
    resource_type,
    resource_id,
    changes
  ) VALUES (
    NEW.organization_id,
    NEW.project_id,
    auth.uid(),
    TG_OP || '.' || TG_TABLE_NAME,
    TG_TABLE_NAME,
    NEW.id,
    jsonb_build_object(
      'before', to_jsonb(OLD),
      'after', to_jsonb(NEW)
    )
  );
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER audit_feature_flags
  AFTER INSERT OR UPDATE OR DELETE ON feature_flags
  FOR EACH ROW EXECUTE FUNCTION create_audit_log();
```

## Row Level Security (RLS)

Supabase RLS policies ile multi-tenant güvenliği.

### Organizations

```sql
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;

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

-- Only owners can update organization
CREATE POLICY "update_organizations"
ON organizations FOR UPDATE
USING (
  id IN (
    SELECT organization_id 
    FROM user_organizations 
    WHERE user_id = auth.uid() AND role = 'owner'
  )
);
```

### Projects

```sql
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_projects"
ON projects FOR SELECT
USING (
  organization_id IN (
    SELECT organization_id 
    FROM user_organizations 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "insert_projects"
ON projects FOR INSERT
WITH CHECK (
  organization_id IN (
    SELECT organization_id 
    FROM user_organizations 
    WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
  )
);
```

### Feature Flags

```sql
ALTER TABLE feature_flags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_flags"
ON feature_flags FOR SELECT
USING (
  project_id IN (
    SELECT p.id FROM projects p
    INNER JOIN user_organizations uo ON p.organization_id = uo.organization_id
    WHERE uo.user_id = auth.uid()
  )
);

CREATE POLICY "update_flags"
ON feature_flags FOR UPDATE
USING (
  project_id IN (
    SELECT p.id FROM projects p
    INNER JOIN user_organizations uo ON p.organization_id = uo.organization_id
    WHERE uo.user_id = auth.uid() AND uo.role IN ('owner', 'admin')
  )
);
```

## Migrations

Migrations Supabase CLI veya SQL scripts ile yönetilir.

### Migration 001: Initial Schema

```sql
-- /infra/migrations/001_initial_schema.sql

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Organizations
CREATE TABLE organizations (...);

-- User organizations
CREATE TABLE user_organizations (...);

-- Projects
CREATE TABLE projects (...);

-- Environments
CREATE TABLE environments (...);

-- Feature flags
CREATE TABLE feature_flags (...);

-- API keys
CREATE TABLE api_keys (...);

-- Audit logs
CREATE TABLE audit_logs (...);

-- Triggers
CREATE OR REPLACE FUNCTION update_updated_at_column() ...;
CREATE TRIGGER ...;

-- RLS Policies
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
CREATE POLICY ...;
```

### Migration 002: Add Environment Overrides

```sql
-- /infra/migrations/002_add_env_overrides.sql
CREATE TABLE environment_overrides (...);
```

## Query Examples

### Get all flags for a project

```sql
SELECT 
  f.id,
  f.key,
  f.name,
  f.enabled,
  f.rules,
  p.key as project_key
FROM feature_flags f
INNER JOIN projects p ON f.project_id = p.id
WHERE p.key = 'campfire';
```

### Get flags with environment context

```sql
SELECT 
  f.id,
  f.key,
  f.name,
  f.enabled,
  f.rules,
  eo.enabled as env_override
FROM feature_flags f
INNER JOIN projects p ON f.project_id = p.id
INNER JOIN environments e ON e.project_id = p.id
LEFT JOIN environment_overrides eo ON eo.flag_id = f.id AND eo.environment_id = e.id
WHERE p.key = 'campfire' AND e.name = 'production';
```

### Validate API key

```sql
SELECT 
  ak.id,
  ak.environment_id,
  e.project_id,
  p.key as project_key,
  ak.key_type,
  ak.revoked
FROM api_keys ak
INNER JOIN environments e ON ak.environment_id = e.id
INNER JOIN projects p ON e.project_id = p.id
WHERE ak.key_prefix = $1 
  AND NOT ak.revoked
LIMIT 1;

-- Then verify hash server-side:
-- bcrypt.compare(providedKey, ak.key_hash)
```

### Audit log query

```sql
SELECT 
  al.action,
  al.resource_type,
  al.changes,
  al.created_at,
  u.email as user_email
FROM audit_logs al
LEFT JOIN auth.users u ON al.user_id = u.id
WHERE al.organization_id = $1
ORDER BY al.created_at DESC
LIMIT 50;
```

## Indexes Strategy

**Primary Indexes:**
- All foreign keys indexed
- `feature_flags.key` for fast lookup
- `api_keys.key_prefix` for auth queries
- `audit_logs.created_at DESC` for recent logs

**Performance Notes:**
- JSONB `rules` column: No index needed (small arrays)
- If rules grow complex, use `GIN` index: `CREATE INDEX idx_flags_rules ON feature_flags USING GIN (rules);`

## Data Seeding (Development)

```sql
-- Seed script for local development
-- /infra/migrations/seed.sql

-- Create test organization
INSERT INTO organizations (id, name, slug) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Test Org', 'test-org');

-- Create test project
INSERT INTO projects (id, organization_id, key, name) VALUES
  ('22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'test-app', 'Test Application');

-- Create environments
INSERT INTO environments (id, project_id, name) VALUES
  ('33333333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222222', 'development'),
  ('44444444-4444-4444-4444-444444444444', '22222222-2222-2222-2222-222222222222', 'production');

-- Create test flags
INSERT INTO feature_flags (project_id, key, name, enabled, rules) VALUES
  (
    '22222222-2222-2222-2222-222222222222',
    'test-flag',
    'Test Feature Flag',
    false,
    '[{"type":"percentage","percentage":50,"value":true}]'::jsonb
  );
```

---

**Next:** [API Design](./API.md)
