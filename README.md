# PlussMobil Min Side

Customer self-service portal for PlussMobil mobile subscribers. View subscriptions, manage plans, download invoices, and update account settings — all in Norwegian.

## Stack

- **Next.js 16** (App Router, Turbopack)
- **TypeScript 5** (strict mode)
- **Tailwind CSS v4** with custom brand tokens
- **Sanity.io** for plan/FAQ data (read-only, shared with marketing site)
- **erate Selfcare API** for subscriber data (proxied through API routes)

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The app currently runs on **mock data** — no API keys required to preview.

## Pages

| Route | Description |
|---|---|
| `/` | Dashboard — subscription overview, data usage, spending chart |
| `/abonnement/[id]` | Subscription detail — plan info, services, SIM |
| `/bytt-abonnement/[id]` | Change plan — compare and switch plans |
| `/fakturaer` | Invoices — history, status, PDF download |
| `/innstillinger` | Settings — profile, invoice delivery, account info |
| `/logg-inn` | Login — phone number input |
| `/verifiser` | OTP verification — 6-digit code |

## Design

- **Fonts**: Bricolage Grotesque (headings) + Figtree (body)
- **Colors**: Navy (`#0f1d35`), Gold (`#f5c518`), Cream (`#faf7f2`)
- **Layout**: Sidebar navigation (desktop), bottom tabs + slide-out menu (mobile)
- **Animations**: Data usage rings, animated counters, staggered reveals

## Environment variables

Required for production (not needed for mock data preview):

```bash
ERATE_API_KEY=             # erate Selfcare API key (server-only)
SESSION_SECRET=            # Session encryption key
NEXT_PUBLIC_SANITY_PROJECT_ID=rynfsue0
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_READ_TOKEN=     # Sanity viewer token
NEXT_PUBLIC_SITE_URL=      # https://minside.plussmobil.no
```

## Deployment

Deployed on [Vercel](https://vercel.com). Pushes to `main` trigger automatic deployments.
