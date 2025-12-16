# Feature Flags Platform - Proje Dokümantasyonu

> Production-ready, multi-tenant feature flag yönetim platformu

## 🎯 Proje Özeti

Feature Flags platformu, uygulamaların yeniden deploy edilmeden özelliklerin açılıp kapatılabilmesini sağlayan merkezi bir yönetim sistemidir. Dashboard, secure public API ve minimal SDK ile entegrasyon kolaylığı sunar.

### Problem
- Redeploy riskleri ve uzun deployment süreçleri
- Canary releases ve percentage rollout'ların manuel yönetimi
- Farklı environment'larda (dev, staging, prod) özellik kontrolü zorluğu

### Çözüm
- Merkezi feature flag servisi ile canlı davranış kontrolü
- Environment bazlı izolasyon ve API key yönetimi
- Role-based, attribute-based ve percentage-based targeting
- Audit logging ve güvenli multi-tenant yapı

## 🛠️ Teknoloji Stack

- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes, Serverless/Edge Functions
- **Database**: PostgreSQL (Supabase)
- **Auth**: Supabase Auth + API Keys
- **SDK**: TypeScript, React hooks
- **Deployment**: Vercel (Next.js) + Supabase
- **CI/CD**: GitHub Actions

## 📦 Monorepo Yapısı

```
/flagship
  /apps
    /dashboard          # Next.js yönetim paneli
    /demo-app          # SDK entegrasyonu demo
  /packages
    /sdk               # Core SDK (@flagship/flags)
    /sdk-react         # React hooks wrapper
    /shared-types      # Ortak TypeScript tipleri
  /infra
    /migrations        # Database migrations
    /scripts           # Deployment & setup scripts
  /docs                # Bu dokümantasyon
```

## 📚 Dokümantasyon İçeriği

### Tasarım Dokümantasyonu
- [Mimari Tasarım](./ARCHITECTURE.md) - Sistem mimarisi, data flow, componenler
- [Database Schema](./DATABASE.md) - Tablo yapıları, ilişkiler, migrations
- [API Tasarımı](./API.md) - Endpoint'ler, authentication, rate limiting
- [SDK Kullanımı](./SDK.md) - NPM package kullanımı, React hooks, örnekler

### Geliştirme Dokümantasyonu
- [Development Roadmap](./ROADMAP.md) - Adım adım geliştirme planı, MVP checklist
- [Güvenlik](./SECURITY.md) - Auth, API keys, RLS, audit logging
- [Deployment](./DEPLOYMENT.md) - CI/CD, environment setup, monitoring

## 🎯 MVP Scope

### ✅ Yapıyoruz
- Dashboard (Next.js) - projeler, environment'lar, flag'ler yönetimi
- Public read API - flag evaluation, hızlı, cache'li, auth'li
- Minimal SDK (`getFlags`) - frontend & backend kullanım
- Postgres (Supabase) - multi-tenant model, audit log
- API keys (env bazlı) ve RLS ile güvenlik
- Unit & integration testler
- Demo app + README + GIF

### ❌ Yapmıyoruz (İlk Sürümde)
- Push-based realtime updates (websocket/push)
- Full SDK feature set (offline mode, streaming)
- Billing / payments
- Gelişmiş A/B analytics
- Mobile SDK'lar

## 🚀 Hızlı Başlangıç

### Kullanıcı Perspektifi

1. **Dashboard'dan API key al**
   ```
   Dashboard → Projects → Environments → API Keys → Create
   ```

2. **SDK'yı yükle**
   ```bash
   npm install @flagship/flags
   ```

3. **Kullan**
   ```typescript
   import { createClient } from '@flagship/flags';
   
   const client = createClient({ 
     apiKey: process.env.FEATURE_FLAG_KEY 
   });
   
   const flags = await client.getFlags({
     project: 'my-app',
     env: 'prod',
     user: { id: 'user-123', role: 'user' }
   });
   
   if (flags['new-dashboard']) {
     showNewDashboard();
   }
   ```

### Geliştirici Perspektifi

```bash
# Repository'yi clone'la
git clone <repo-url>

# Dependencies'leri yükle
pnpm install

# Supabase setup
pnpm setup:db

# Development server
pnpm dev

# Testleri çalıştır
pnpm test
```

## 📊 Özellikler

### Dashboard
- ✅ Proje ve environment yönetimi
- ✅ Feature flag CRUD işlemleri
- ✅ Rule editor (role, attribute, percentage)
- ✅ API key oluşturma ve revoke etme
- ✅ Audit log görüntüleme
- ✅ Basit analytics (toggle counts, last used)

### Rule Engine
- **Role-based targeting**: Admin, user, premium gibi roller
- **Attribute-based targeting**: Email, country, custom attributes
- **Percentage rollouts**: Deterministik hashing ile tutarlı gruplar
- **Environment overrides**: Dev/staging/prod için farklı kurallar

### Security
- API key authentication (hashed storage)
- Row-Level Security (RLS) ile multi-tenancy
- Rate limiting (IP & key based)
- Audit logging (tüm değişiklikler)
- Environment isolation

## 🎓 CV Bullet Points

Feature flag platformu geliştirirken:

- Designed and implemented a **multi-tenant feature flag service** with environment isolation and role-based targeting
- Built a **rule engine** supporting deterministic percentage rollouts and attribute-based targeting  
- Implemented **secure public APIs** and a minimal SDK for easy integration into client and server apps
- Developed **real-time dashboard** using Next.js 15 with server components and React Query for state management
- Applied **Row-Level Security (RLS)** policies in PostgreSQL for tenant data isolation
- Integrated **CI/CD pipeline** with automated testing and deployment to Vercel

## 📈 Mülakat Anlatımı

**Problem**: Uygulamaları her özellik değişikliğinde yeniden deploy etmek riskli ve yavaş. Canary release ve percentage rollout'ları manuel yönetmek zor.

**Çözüm**: Merkezi bir feature flag servisi geliştirdim. Dashboard'dan flag'leri yönetiyorsunuz, SDK ile uygulamanızda sorgu yapıyorsunuz, backend rule engine'i değerlendiriyor.

**Teknik**: Next.js ile modern dashboard, Supabase PostgreSQL ile multi-tenant veri modeli, secure API keys ve Edge Functions ile düşük latency, deterministik percentage rollout algoritması.

**Etki**: Risk azaltma (hızlı rollback), canary releases kolaylığı, admin kontrolü, zero-downtime feature deployment.

## 📞 İletişim & Katkıda Bulunma

Bu bir portfolio projesidir. Sorularınız için issue açabilir veya PR gönderebilirsiniz.

---

**Son Güncelleme**: Aralık 2025
