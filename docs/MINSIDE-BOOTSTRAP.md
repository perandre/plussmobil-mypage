# PlussMobil Min Side — New Repo Bootstrap

> This document gives an AI-assisted developer everything needed to build the PlussMobil customer portal ("Min Side") from scratch. It captures domain knowledge, API contracts, design language, and architectural decisions from the existing marketing/ordering repo at `plussmobil.no`.

---

## 1. What is Min Side?

Min Side ("My Page") is an authenticated self-service portal for PlussMobil mobile subscribers. It lets customers manage their subscriptions, view invoices, change plans, and handle account settings — without calling customer service.

**Clients:**
- **Next.js web app** (this repo) — desktop + mobile responsive
- **Native iOS app** (separate repo, future)
- **Native Android app** (separate repo, future)

All three clients share the same backend API layer, which lives in this repo as Next.js API routes proxying the erate Selfcare API.

---

## 2. Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| Framework | Next.js 16 (App Router, Turbopack) | Same as marketing site |
| Language | TypeScript 5 | Strict mode |
| Styling | Tailwind CSS v4 | `@theme` block in `globals.css`, no config file |
| Fonts | Bricolage Grotesque (headings) + Figtree (body) | Google Fonts via `next/font` |
| CMS | Sanity.io | Shared project `rynfsue0`, dataset `production` — read-only for plan data |
| Auth | SMS OTP via erate Selfcare API | No third-party auth provider needed |
| Backend API | erate Selfcare (`https://api.erate.no/selfcare`) | Proxied through Next.js API routes |
| Deployment | Vercel | Separate project from marketing site |

---

## 3. Relationship to Marketing Site

The marketing site (`plussmobil.no`) and Min Side are **separate Vercel projects** in separate repos.

**Shared:**
- Design tokens (colors, fonts, spacing — copy `globals.css` theme block)
- Sanity project (`rynfsue0`) for reading plan names/prices (read-only)
- erate API key (same provider, different API surface)
- Brand identity and visual language

**Not shared:**
- Authentication (marketing site has none)
- API routes (Min Side uses Selfcare API; marketing site uses Signup API)
- Components (no shared component library — copy what's useful)
- Deployment (separate Vercel projects, separate domains)

**Domain plan:**
- Marketing: `www.plussmobil.no`
- Min Side: `minside.plussmobil.no` (or `www.plussmobil.no/minside` via rewrites — TBD)

---

## 4. Design Tokens

Copy these exactly from the marketing site. They define the PlussMobil brand.

```css
@import "tailwindcss";

@theme {
  --color-navy: #0f1d35;
  --color-navy-600: #1a2b4a;
  --color-navy-500: #2a3f5f;
  --color-navy-400: #3d5a80;
  --color-gold: #f5c518;
  --color-gold-dark: #d4a810;
  --color-gold-light: #fef9e7;
  --color-cream: #faf7f2;
  --color-cream-dark: #f0ebe3;
  --color-page: #faf7f2;
  --color-surface: #ffffff;
  --color-text: #1a1a2e;
  --color-text-muted: #6b7280;
  --color-border: #e5e2dc;
}

body {
  font-family: var(--font-figtree), system-ui, sans-serif;
  color: #1a1a2e;
  background-color: #faf7f2;
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-bricolage), system-ui, sans-serif;
  text-wrap: balance;
}
```

**Usage patterns:**
- `bg-navy` for dark sections/headers
- `text-gold` / `bg-gold` for accent/CTAs
- `bg-cream` / `bg-page` for page backgrounds
- `bg-surface` for cards
- `border-border` for card/section borders
- Plus-pattern SVG backgrounds on dark sections (see marketing site `globals.css`)

---

## 5. Authentication Flow

Min Side uses **SMS OTP** via the erate Selfcare API. No Clerk, Auth0, or external auth provider.

### Flow:
```
1. User enters phone number (8-digit Norwegian mobile)
2. POST /api/auth/request-otp → calls erate ID check, sends SMS
3. User enters 6-digit OTP code
4. POST /api/auth/verify-otp → validates code, returns session
5. Session stored as httpOnly cookie (JWT or encrypted session token)
6. All subsequent API calls include session → proxy extracts customer ID
```

### erate endpoints for auth:
```
POST /selfcare/v1/id-check
  → Sends SMS verification to the phone number
  → Returns verification token/session

POST /selfcare/v1/id-check/verify  (exact endpoint TBD — check Swagger)
  → Validates the OTP code
  → Returns customer/account identification
```

### Session management:
- **httpOnly, secure, sameSite=strict cookie** — never expose tokens to client JS
- Session contains: `accountId`, `phone`, `expiresAt`
- Session TTL: 30 minutes, refreshed on activity
- Logout: clear cookie
- `proxy.ts` (Next.js 16 middleware replacement) protects all `/minside/*` routes, redirects to `/logg-inn` if no valid session

### Important:
- The same phone number links to an erate account — one account may have multiple subscriptions
- Check Swagger at `https://api.erate.no/selfcare/swagger/index.html` for exact request/response shapes
- The marketing site has no auth at all — this is entirely new infrastructure

---

## 6. erate Selfcare API Reference

**Base URL:** `https://api.erate.no/selfcare`
**Auth:** `x-api-key` header (server-side only, never exposed to browser)
**Swagger:** `https://api.erate.no/selfcare/swagger/index.html`

### Core endpoints:

| Feature | Method | Endpoint | Notes |
|---------|--------|----------|-------|
| ID verification (send SMS) | POST | `/v1/id-check` | Triggers SMS OTP |
| List subscriptions | GET | `/v1/accounts/{accountId}/subscriptions` | All SIMs under account |
| Subscription details | GET | `/v1/subscriptions/{subscriptionId}` | Single subscription |
| List invoices | GET | `/v1/billing-groups/{billingGroupId}/invoices` | Invoice history |
| Download invoice PDF | GET | `/v1/invoices/{invoiceId}/pdf-stream` | Returns PDF binary |
| Terminate subscription | POST | `/v1/subscriptions/{subscriptionId}/termination` | Cancel a line |
| Change plan | TBD | Via subscription product options | Exact endpoint TBD |
| Usage/data balance | TBD | Check Swagger | May be available |

### Key IDs:
- `accountId` — the customer account (one per person/fødselsnummer)
- `billingGroupId` — billing group (family plans share one)
- `subscriptionId` — individual phone line/SIM

### API proxy pattern:
All erate calls go through Next.js API routes. Never call erate from the browser.

```
Browser → /api/selfcare/subscriptions → Next.js Route Handler → erate API
                                         ↑ adds x-api-key header
                                         ↑ extracts accountId from session cookie
```

---

## 7. Pages & Routes

```
app/
├── (auth)/
│   ├── logg-inn/page.tsx              # Phone number input
│   └── verifiser/page.tsx             # OTP code input
│
├── (portal)/                          # Auth-protected layout group
│   ├── layout.tsx                     # Portal shell: sidebar/nav + session check
│   ├── page.tsx                       # Dashboard: subscription overview
│   ├── abonnement/
│   │   └── [id]/page.tsx              # Single subscription detail
│   ├── fakturaer/page.tsx             # Invoice list
│   ├── fakturaer/[id]/page.tsx        # Single invoice + PDF download
│   ├── bytt-abonnement/
│   │   └── [id]/page.tsx              # Change plan for a subscription
│   ├── innstillinger/page.tsx         # Account settings (contact info)
│   └── hjelp/page.tsx                 # Help/FAQ (can pull from Sanity)
│
├── api/
│   ├── auth/
│   │   ├── request-otp/route.ts       # Send SMS verification
│   │   ├── verify-otp/route.ts        # Validate OTP, create session
│   │   └── logout/route.ts            # Clear session
│   └── selfcare/
│       ├── subscriptions/route.ts     # List subscriptions
│       ├── subscriptions/[id]/route.ts
│       ├── invoices/route.ts          # List invoices
│       ├── invoices/[id]/pdf/route.ts # Download PDF
│       └── change-plan/route.ts       # Plan change
│
├── layout.tsx                         # Root layout (fonts, metadata)
├── proxy.ts                           # Auth middleware (Next.js 16)
└── globals.css                        # Theme + animations
```

---

## 8. Key Features (MVP)

### 8.1 Dashboard (landing page after login)
- Overview of all subscriptions under the account
- Each subscription shows: phone number, plan name, data balance (if available), price
- Quick actions: "Bytt abonnement", "Se fakturaer"
- Account holder name + phone at top

### 8.2 Subscription Detail
- Full plan details: name, price, data allowance, speed, features
- Current usage/data balance (if erate provides this)
- SIM type (physical/eSIM)
- Option to change plan → navigates to plan change flow
- Option to terminate (with confirmation dialog)

### 8.3 Invoice History
- List of invoices sorted by date (newest first)
- Each shows: date, amount, status (paid/unpaid)
- Download PDF button per invoice
- Billing group info for family plans

### 8.4 Change Plan
- Shows current plan highlighted
- Lists available plans (fetched from Sanity for display, erate for execution)
- Price comparison (current vs. new)
- Confirmation step before submitting
- Calls erate API to execute the change

### 8.5 Account Settings
- View/edit contact email
- View/edit contact phone
- Invoice delivery preference (paper vs. electronic)

### 8.6 Help / FAQ
- Pull FAQ items from Sanity (same `faqItem` schema as marketing site)
- Link to customer service contact info

---

## 9. Sanity Integration (Read-Only)

Min Side reads from the same Sanity project as the marketing site — it does NOT write.

**Project ID:** `rynfsue0`
**Dataset:** `production`

### What to read from Sanity:
- **Plan details** for display (name, price, data label, speed, highlights) — `plan` schema
- **FAQ items** for help page — `faqItem` schema
- **Site settings** for contact info, footer — `siteSettings` schema

### GROQ query examples:
```groq
// All active plans (for plan change page)
*[_type == "plan" && active == true] | order(order asc) {
  _id, name, "slug": slug.current, price, group,
  displayName, dataLabel, speedLabel, highlights,
  variantId, dataPrice, membershipPrice
}

// FAQ items
*[_type == "faqItem"] | order(category asc) {
  _id, question, answer, category
}
```

### Environment variables needed:
```
NEXT_PUBLIC_SANITY_PROJECT_ID=rynfsue0
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_READ_TOKEN=<viewer token>
```

No Sanity Studio in this repo — content is managed from the marketing site's `/studio`.

---

## 10. Environment Variables

```bash
# erate API
ERATE_API_KEY=<from erate onboarding>

# Session encryption
SESSION_SECRET=<random 64-char hex — generate with: openssl rand -hex 32>

# Sanity (read-only)
NEXT_PUBLIC_SANITY_PROJECT_ID=rynfsue0
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_READ_TOKEN=<viewer token>

# App
NEXT_PUBLIC_SITE_URL=http://localhost:3000   # production: https://minside.plussmobil.no

# Vercel (auto-set on Vercel)
VERCEL_URL=<auto>
```

---

## 11. Norwegian Language & Locale

The entire UI is in Norwegian (Bokmål). All user-facing text is in Norwegian.

### Key terms:
| Norwegian | English | Context |
|-----------|---------|---------|
| Min Side | My Page | Portal name |
| Abonnement | Subscription | Mobile plan |
| Faktura | Invoice | Billing |
| Bytt abonnement | Change plan | Plan switch |
| Logg inn | Log in | Auth |
| Logg ut | Log out | Auth |
| Verifiser | Verify | OTP step |
| Innstillinger | Settings | Account settings |
| Hjelp | Help | Support page |
| Kontoeier | Account holder | Primary account person |
| Fødselsnummer | National ID number | 11-digit personal ID |
| Mobilnummer | Mobile number | Phone number |
| Datapakke | Data package | Data allowance |
| Ubegrenset | Unlimited | Unlimited data |

### Validation messages (Norwegian):
```typescript
'Mobilnummer er påkrevd'
'Ugyldig norsk mobilnummer'    // Must match /^[49]\d{7}$/
'Koden er påkrevd'
'Ugyldig kode'
'Noe gikk galt, prøv igjen'
```

---

## 12. Plan Data Reference

These are the current PlussMobil plans. They live in Sanity but here's the reference:

### Individual plans (9):
| Name | Price/mo | Variant ID | Data |
|------|----------|-----------|------|
| 0GB Fri Tale | 99 kr | 202504250939078501 | Pay per use |
| 1GB Standard | 119 kr | 202106101521451301 | 1 GB |
| 10GB Standard | 198 kr | 202106101521451305 | 10 GB |
| 15GB Standard | 248 kr | 202106101521451304 | 15 GB |
| 30GB Standard | 298 kr | 202108051409115987 | 30 GB |
| Fri Data Start | 298 kr | 202502111055144903 | Unlimited (10 Mbit/s) |
| Fri Data Smart | 348 kr | 202502111055205720 | Unlimited (20 Mbit/s) |
| Fri Data Standard | 398 kr | 202108041536494096 | Unlimited (150 Mbit/s) |
| Fri Data Maks | 499 kr | 202111091314000395 | Unlimited (1000 Mbit/s) |

### Family plans (6):
| Name | Price/mo | Member fee | Variant ID |
|------|----------|-----------|-----------|
| Familiepakke 2GB | 218 kr | 109 kr | 202404260819320338 |
| Familiepakke 5GB | 318 kr | 109 kr | 202404260819350714 |
| Familiepakke 10GB | 418 kr | 109 kr | 202404260819381058 |
| Familiepakke 25GB | 518 kr | 109 kr | 202404260819411234 |
| Familiepakke 50GB | 668 kr | 109 kr | 202404260819441643 |
| Familiepakke 80GB | 768 kr | 109 kr | 202404260820482239 |

---

## 13. Mobile App API Contract

The Next.js API routes in `/api/selfcare/*` and `/api/auth/*` serve double duty:
1. Called by the Next.js frontend (via `fetch` or Server Actions)
2. Called by native iOS/Android apps (as a REST API)

### Design for mobile compatibility:
- All API routes return JSON (never HTML or redirects for API paths)
- Auth endpoints return a session token that mobile apps store locally
- Session token is passed as `Authorization: Bearer <token>` header by mobile apps
- Session token is passed as httpOnly cookie by the web app
- API routes accept both auth methods (cookie OR bearer token)
- Error responses follow a consistent shape:
  ```json
  { "error": "INVALID_OTP", "message": "Koden er ugyldig eller utløpt" }
  ```

### Auth differences by client:
| Concern | Web (Next.js) | Mobile (native) |
|---------|--------------|-----------------|
| Token storage | httpOnly cookie | Secure storage (Keychain/Keystore) |
| Token delivery | `Set-Cookie` header | JSON response body `{ token }` |
| Token sending | Automatic (cookie) | `Authorization: Bearer` header |
| Session refresh | Cookie refresh on response | Explicit refresh endpoint |

---

## 14. Project Setup Checklist

```bash
# 1. Create the repo
npx create-next-app@latest plussmobil-minside \
  --typescript --tailwind --app --turbopack --no-src-dir

# 2. Install dependencies
npm install next-sanity @sanity/client @sanity/image-url

# 3. Set up environment
cp .env.example .env.local
# Fill in: ERATE_API_KEY, SESSION_SECRET, Sanity tokens

# 4. Copy design tokens
# Copy the @theme block and font setup from marketing site

# 5. Create proxy.ts for auth middleware
# Protect (portal) routes, allow (auth) routes

# 6. Link to Vercel
vercel link
vercel env pull
```

---

## 15. Open Questions (Carry-Forward)

These are unresolved from the erate integration analysis. They apply to Min Side:

1. **Exact id-check/OTP endpoints** — Check Selfcare Swagger for exact request/response shapes for SMS verification
2. **Usage/data balance endpoint** — Does erate expose current data usage per subscription?
3. **Plan change mechanism** — Exact endpoint and request body for switching plans via Selfcare API
4. **Account settings update** — Can contact info (email, phone) be updated via Selfcare API?
5. **Family plan view** — How does `billingGroupId` map to showing "family overview" vs individual member views?
6. **Invoice payment status** — Does erate return paid/unpaid status on invoices?
7. **Session/token format from id-check** — What does erate return after successful OTP? Customer ID? JWT? Session key?

---

## 16. Security Considerations

- **Never expose `ERATE_API_KEY`** — all erate calls through server-side API routes
- **httpOnly cookies** — session tokens never accessible to client JavaScript
- **CSRF protection** — use `sameSite=strict` on session cookie; for mobile API, rely on bearer token
- **Rate limiting** — limit OTP requests (e.g., max 3 per phone per 10 minutes)
- **Input validation** — validate phone numbers server-side (`/^[49]\d{7}$/`)
- **Fødselsnummer** — never store or log full national ID numbers; use only for erate API calls
- **PDF proxy** — stream invoice PDFs through API route; don't expose erate URLs
- **Session expiry** — 30-minute sliding window; force re-auth on sensitive actions (termination)

---

## 17. File Structure Convention

Follow the same patterns as the marketing site:

```
lib/
├── erate/
│   ├── client.ts          # erate API client (fetch wrapper with x-api-key)
│   ├── types.ts           # erate API request/response types
│   └── selfcare.ts        # Selfcare endpoint wrappers
├── sanity/
│   ├── client.ts          # Sanity client (read-only, CDN)
│   └── queries.ts         # GROQ queries with defineQuery
├── session.ts             # Session create/verify/refresh helpers
├── validation.ts          # Input validation (phone, OTP code)
└── dates.ts               # Norwegian date formatting

types/
├── subscription.ts        # Subscription, Plan, Usage types
├── invoice.ts             # Invoice types
└── account.ts             # Account, Session types

components/
├── portal/                # Portal-specific components
│   ├── SubscriptionCard.tsx
│   ├── InvoiceRow.tsx
│   ├── PlanCompare.tsx
│   └── PortalNav.tsx
├── auth/                  # Login/OTP components
│   ├── PhoneInput.tsx
│   └── OtpInput.tsx
└── ui/                    # Shared UI primitives
    ├── TextInput.tsx       # Copy from marketing site
    ├── Button.tsx
    ├── Card.tsx
    └── InfoBox.tsx
```

---

## 18. CLAUDE.md Template for New Repo

Use this as the `CLAUDE.md` in the new repo:

```markdown
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
- All UI text in Norwegian (Bokmål)
- Tailwind custom colors via `@theme` in globals.css (no config file)
- `bg-navy`, `text-gold`, `bg-cream` etc.
- Fonts: Bricolage Grotesque (headings), Figtree (body)
- API routes serve both web (cookie auth) and mobile (bearer auth)
```
