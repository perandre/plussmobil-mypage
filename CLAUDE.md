# PlussMobil Min Side — Claude context

## Stack
Next.js 16 (App Router, Turbopack), TypeScript, Tailwind CSS v4, Sanity.io (read-only)

## What this is
Authenticated customer portal for PlussMobil subscribers. SMS OTP login via erate Selfcare API.
All API calls to erate proxied through Next.js API routes (x-api-key never exposed to browser).

## Deployment
Vercel. Required env vars:
- `ERATE_API_KEY` — erate API key (server-only)
- `SESSION_SECRET` — session encryption key
- `NEXT_PUBLIC_SANITY_PROJECT_ID=rynfsue0`
- `NEXT_PUBLIC_SANITY_DATASET=production`
- `SANITY_API_READ_TOKEN` — Sanity viewer token
- `NEXT_PUBLIC_SITE_URL` — http://localhost:3000 (dev) / https://minside.plussmobil.no (prod)

## Sanity
- Shared project with marketing site (read-only here, no Studio)
- Project ID: `rynfsue0`, dataset: `production`
- Reads: `plan`, `faqItem`, `siteSettings` schemas

## erate Selfcare API
- Base: `https://api.erate.no/selfcare`
- Swagger: `https://api.erate.no/selfcare/swagger/index.html`
- Auth: `x-api-key` header (server-side only)
- All browser requests go through `/api/selfcare/*` proxy routes

## Auth
- SMS OTP via erate id-check endpoint
- Session: encrypted httpOnly cookie (web) + Bearer token (mobile apps)
- proxy.ts protects all (portal) routes

## Key conventions
- All UI text in Norwegian (Bokmal)
- Tailwind custom colors via `@theme` in globals.css (no config file)
- `bg-navy`, `text-gold`, `bg-cream` etc.
- Fonts: Bricolage Grotesque (headings), Figtree (body)
- API routes serve both web (cookie auth) and mobile (bearer auth)

## Current state
- Frontend UI built with mock data in `lib/mock-data.ts`
- No API integration yet (no ERATE_API_KEY)
- Auth flow is mocked (login/OTP navigate directly)
- All pages functional: dashboard, subscription detail, plan change, invoices, settings, login, OTP
