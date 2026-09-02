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

- **Database:** Neon Postgres (`DATABASE_URL`) — not Supabase
- **Email:** Resend — single address `sales@djii.eu` (from, reply-to, admin)
- **Email templates:** React Email — 47 templates, 6 locales (en/de/fr/es/it/nl)
- **Assets:** Postgres `db_assets` table (BYTEA) — upload via `POST /api/assets/upload`, served at `/api/assets/[id]`

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
| `POST /api/assets/upload` | store images/PDFs in `db_assets` (multipart `file` field) |

Run email tests: `npm run test`

Ingest product images into Postgres (from repo root):

```bash
npm run media:ingest -- --slug=dji-mavic-3-pro
npm run media:ingest -- --limit=50
```

Writes `src/data/productDatabaseMediaCache.json` and serves images at `/api/assets/[id]`.

## Rules

- No `DJI_PRODUCTS` import in production storefront when `DATA_MODE=production`
- Database credentials never `NEXT_PUBLIC_*`
- Images and attachments stored in `db_assets`, not external object storage
- Offline/PWA rules from Wave 11 unchanged
- Shared business logic: `../src/lib/**` (KEEP)
