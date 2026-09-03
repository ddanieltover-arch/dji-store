# DJI Store EU — Production (Next.js 15)

Vite prototype remains at the repo root as the **migration reference**.

## Setup

```bash
cd production
cp .env.example .env.local
# fill DATABASE_URL (Neon), RESEND_API_KEY
# all email (from, reply-to, admin): sales@djii.eu
# DATA_MODE=production when ready
npm install
npm run dev
```

Apply the database schema once:

```bash
psql "$DATABASE_URL_UNPOOLED" -f ../neon/schema.sql
```

From repo root: `npm run dev:production`

## Stack

- **Database:** Neon Postgres (`DATABASE_URL`) — orders, users, email, metadata
- **File storage:** Supabase Storage when `STORAGE_BACKEND=supabase` (receipts, uploads). Catalog images use static `public/media/`.
- **Email:** Resend — single address `sales@djii.eu` (from, reply-to, admin)
- **Email templates:** React Email — 47 templates, 6 locales (en/de/fr/es/it/nl)

### Supabase Storage setup (Option A)

1. Create a Supabase project and a **public** Storage bucket named `assets` (or set `SUPABASE_STORAGE_BUCKET`).
2. Add to `production/.env.local` / hosting secrets:

```bash
STORAGE_BACKEND=supabase
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_STORAGE_BUCKET=assets
```

3. Apply the Neon metadata migration (allows `db_assets` rows without BYTEA):

```bash
psql "$DATABASE_URL_UNPOOLED" -f ../neon/migrations/001_supabase_storage_metadata.sql
```

Uploads go to Supabase; Neon only stores `storage_url` / `storage_path` plus order/attachment links. Legacy `/api/assets/[id]` redirects to the public Storage URL when present.

## Email system

Preview any template in dev:

```
http://localhost:3015/api/email/preview?template=order.confirmed&locale=de
```

Add header `Accept: text/html` for rendered HTML.

| API route | Emails sent |
|-----------|-------------|
| `POST /api/checkout` | order.confirmed / payment_pending + admin |
| `PATCH /api/admin/orders/[id]` | shipped, delivered, payment_confirmed |
| `POST /api/warranty` | warranty.registered + admin |
| `POST /api/rma` | rma.submitted + admin |
| `POST /api/care/claim` | care.claim_submitted + admin |
| `POST /api/reviews` | review.submitted + admin |
| `POST /api/b2b/quote` | b2b.quote_created + admin |
| `POST /api/newsletter` | newsletter.welcome + admin |
| `POST /api/referrals/invite` | referral.invite + admin |
| `POST /api/gdpr/export` | gdpr.export_ready + admin |
| `POST /api/gdpr/erasure` | gdpr.erasure_received + admin |
| `POST /api/loyalty/award` | loyalty.points_awarded + admin |
| `POST /api/alerts/subscribe` | restock/price alerts (on trigger via PUT) |
| `POST /api/cron/email` | marketing + lifecycle batch (Bearer CRON_SECRET) |
| `POST /api/assets/upload` | store files in Supabase Storage (or legacy Neon BYTEA); Neon keeps metadata |

Run email tests: `npm run test`

Ingest product images into Postgres (from repo root):

```bash
npm run media:ingest -- --slug=dji-mavic-3-pro
npm run media:ingest -- --limit=50
```

Writes `src/data/productDatabaseMediaCache.json` and serves images at `/api/assets/[id]`.

For **static Vite deploys** (djii.eu on Vercel without the Next.js API), export assets to `public/media/assets/`:

```bash
npm run media:export
```

This writes static files and `src/data/staticAssetManifest.json`. Run after `media:ingest`, then rebuild and redeploy the storefront.

## Rules

- No `DJI_PRODUCTS` import in production storefront when `DATA_MODE=production`
- Database credentials never `NEXT_PUBLIC_*`
- Product catalog images: static `public/media/` (prefer `media:ingest:static`)
- Runtime uploads (receipts): Supabase Storage when `STORAGE_BACKEND=supabase`; Neon stores metadata + order links only
- Offline/PWA rules from Wave 11 unchanged
- Shared business logic: `../src/lib/**` (KEEP)
