# TUTUMatch

A flat-fee NSW tutor marketplace. Tutors list free; parents pay $20 once per match, refunded as the tutor's first-lesson discount. After the introduction, the platform is out of the loop.

This repository is the **v1 scaffold** — the full v3 landing page is ported to Next.js with per-school theming, the data model is complete, and remaining flows (browse, profile, unlock, admin, messaging, refunds) are stubbed in code with the contracts they need to honour.

---

## What's here

- **Landing page** — full v3 design ported, all sections (Hero, Pitch, Mechanic, How, Comparison, Trust, Guarantee, Earnings, FAQ, Final CTA, Footer).
- **School-branded landing pages** at `/schools/[slug]` — same layout, only the brand colour changes via CSS variables. Two seed schools (Killara High, Masada College) demo the theming.
- **Prisma schema** (`prisma/schema.prisma`) covering: users, tutor profiles, schools, HSC results, subjects offered, availability slots, verifications, unlocks (the $20 fee), payments, refunds, messages, reports.
- **Seed script** (`prisma/seed.ts`) for the demo schools.
- **Stub pages** for browse, tutor profile, tutor signup, unlock, dashboard, admin, login.
- **Stub API routes** for unlock creation (`/api/unlock`), Stripe webhook (`/api/stripe/webhook`), refunds (`/api/refund`), and the 5-day refund-flagging cron (`/api/cron/refund-flag`).
- **Legal stubs**: Terms of Service, Privacy Policy (APP-aligned), Child Safety Policy.

The original v3 prototype files (HTML + JSX + screenshots) live in `design-reference/` for visual diffing.

## What's _not_ here yet

- Working auth (NextAuth wiring).
- Working Stripe integration (only the contracts are documented in the route stubs).
- Real DB connection (Prisma schema is written but no migration has been generated — needs a `DATABASE_URL`).
- In-platform messaging UI.
- Admin verification queue UI.
- Pre-publish content scanning (regex + admin review pipeline).
- Email transactional templates.

See `## Founder checklist` below for everything still needed to launch.

---

## Local setup

```bash
# 1. install
npm install        # or pnpm install / yarn

# 2. env
cp .env.example .env.local
# fill DATABASE_URL (Supabase or Neon Postgres), Stripe keys, etc.

# 3. dev server
npm run dev
# → http://localhost:3000
#   /schools/killara → green theme
#   /schools/masada  → navy theme
```

Once you have a Postgres URL:

```bash
npm run prisma:generate
npm run prisma:migrate      # creates the initial migration
npm run seed                # inserts the two demo schools
```

Type-check: `npm run typecheck`. Build: `npm run build`.

## Adding a new school (no code)

The intent: a new school landing page is admin-configurable in production. Today, until the admin CRUD is built, edit two files:

1. `src/lib/schools.ts` — add the slug, name, tagline, brand/deep/soft colours.
2. `prisma/seed.ts` will pick it up on the next seed.

Once the admin CRUD is built, the same fields will be a form in `/admin → Schools`, no code deploy needed. The CSS variable approach means colours are applied at render time, never compiled.

## Routes

| Path                                | What it is                                                                     | State    |
|-------------------------------------|--------------------------------------------------------------------------------|----------|
| `/`                                 | Default landing page (neutral teal)                                            | Done     |
| `/schools/[slug]`                   | School-branded landing page                                                    | Done     |
| `/browse`                           | Parent-side tutor browse + filters                                             | Stub     |
| `/tutors/[id]`                      | Tutor profile detail (contact masked pre-unlock)                               | Stub     |
| `/unlock/[tutorId]`                 | $20 Stripe checkout for unlock                                                 | Stub     |
| `/tutor/signup`                     | Multi-step tutor onboarding (form + uploads)                                   | Stub     |
| `/dashboard`                        | Tutor or parent dashboard (role-aware)                                         | Stub     |
| `/admin`                            | Admin: verification queue, refund queue, schools CRUD, users, reports          | Stub     |
| `/login`                            | Auth entry point                                                               | Stub     |
| `/legal/terms`                      | Terms of Service                                                               | Draft    |
| `/legal/privacy`                    | Privacy Policy (APP-aligned)                                                   | Draft    |
| `/legal/child-safety`               | Child Safety Policy                                                            | Draft    |
| `POST /api/unlock`                  | Create unlock + Stripe PaymentIntent                                           | Stub     |
| `POST /api/stripe/webhook`          | Stripe webhook → mark unlock paid / refund processed                           | Stub     |
| `POST /api/refund`                  | Parent or admin refund request                                                 | Stub     |
| `GET  /api/cron/refund-flag`        | 5-day refund window flagger (Vercel Cron)                                      | Stub     |

## Tech

Next.js 14 (App Router) · TypeScript · Tailwind · CSS variables for per-school theming · Prisma + Postgres · planned: NextAuth, Stripe, Resend, Supabase/S3 storage.

---

## Founder checklist

These are the things **the founder still needs to do manually** — they don't go into code:

### Legal / business setup

- [ ] Register an ABN.
- [ ] Decide sole trader vs Pty Ltd. Strongly consider **Pty Ltd** for liability protection given child-safety exposure.
- [ ] Get public liability + professional indemnity insurance quotes.
- [ ] Have a lawyer review the T&Cs, Privacy Policy, and Child Safety Policy stubs in `src/app/legal/`.
- [ ] Set up a business bank account.
- [ ] Set up a GST registration trigger reminder (mandatory if turnover ≥ $75k/yr).

### Payments

- [ ] Create a Stripe account, get keys, verify the business.
- [ ] Configure the Stripe webhook endpoint pointing to `https://<your-domain>/api/stripe/webhook`.
- [ ] Decide whether the $20 is GST-inclusive or GST-added (default in `.env.example` is inclusive).
- [ ] Set up tax invoice generation for the $20 commission (Stripe Tax or your accountant).

### Child safety

- [ ] Build the manual WWCC verification workflow against the NSW OCG public lookup. Document each verification with reviewer name, date, and outcome.
- [ ] Publish a child-safety contact (`safety@tutumatch.com.au`) and route it to a real inbox.
- [ ] Train any admins/reviewers on mandatory reporting.
- [ ] Align with the National Principles for Child Safe Organisations.

### Schools

- [ ] **Get written permission** from each school before activating their landing page (using their name/logo can require permission). Save the evidence file and link it on the `School` record's `permissionEvidenceUrl`.
- [ ] Only flip `School.active = true` after permission is on file.

### Data / privacy

- [ ] Privacy Policy reviewed by a lawyer + an OAIC-aware advisor.
- [ ] Data Breach response plan documented (who notifies, how, within what window).
- [ ] Verification documents (ID, WWCC, HSC) stored encrypted at rest with signed URLs only — confirm with whichever storage provider you pick (Supabase Storage or S3).

### Tech ops

- [ ] Set up production Postgres (Supabase or Neon).
- [ ] Set up Vercel project + add env vars from `.env.example`.
- [ ] Configure Vercel Cron for `/api/cron/refund-flag` (every 15 min).
- [ ] Add error monitoring (Sentry or similar).

### Marketing compliance

- [ ] Marketing emails: opt-in only, with working unsubscribe (Spam Act 2003).
- [ ] Keep transactional emails separate from marketing.

---

## Design reference

`design-reference/` contains the original v3 HTML + JSX + screenshots that this codebase ports from. Useful for visual diffing if you tweak the landing layout.

## Contact

Founder: see the email in `src/components/landing/Footer.tsx`.
