# SETUP — external services walkthrough

This is the step-by-step guide for hooking TUTUMatch up to the external services it needs to run as a public, paid-up site. It's separate from the README because most of it is **not code** — it's signups, DNS, and verification waits.

The whole list is **under ~$30/year in technical costs** if you stay on free tiers. The bigger cost line is legal protection (Pty Ltd + insurance) — see the **Founder / legal** section of [README.md](./README.md) for the Phase 1 vs Phase 2 framing.

---

## The six services

| Service | What it does | Free tier | When you outgrow it |
|---|---|---|---|
| **ABN** | Australian Business Number | Free | Never |
| **Domain** | `tutumatch.com.au` (or `.au` / `.com`) | ~$15-25/yr | Never |
| **Vercel** | Hosts the Next.js app + cron jobs | Free tier | ~100k monthly visitors |
| **Supabase** | Postgres + verification doc storage (Sydney region) | Free tier | 500 MB DB / 1 GB storage |
| **Stripe** | $20 unlock charges + refunds | No monthly fee | 1.7% + $0.30 AUD per txn |
| **Resend** | Transactional email | 3,000/mo, 100/day free | $20/mo for 50k |
| _(optional)_ **Sentry** | Error monitoring | 5k events/mo free | More than that |

**Order matters.** Some things depend on others — do them in the order below.

---

## Step 1 — ABN (do this first, ~15 min)

Why: Stripe verification needs an ABN. The `.com.au` domain needs one. ATO needs one for taxes.

1. Go to **https://abr.gov.au/** → "Apply for an ABN"
2. Pick **Individual / Sole Trader** for now (you can upgrade to Pty Ltd later for Phase 2)
3. Fill in: TFN, contact, business activity ("online education marketplace" or similar)
4. ABN issued immediately in most cases; sometimes reviewed for 1-2 days
5. Save the ABN somewhere — every other service will ask for it

**Cost:** Free. **Send me:** nothing yet.

---

## Step 2 — Domain (~10 min)

Pick a registrar — **VentraIP** (https://ventraip.com.au/) is Australian, easy UI.

1. Search for `tutumatch.com.au` (needs ABN), or `tutumatch.au` (no eligibility hurdles, often cheaper), or `tutumatch.com` (~$10 first year on promos)
2. Register — they'll ask for your ABN if you go `.com.au` / `.au`
3. Keep the registrar login — you'll add DNS records for Resend and Vercel from there

**Cost:** $10-25/year. **Send me:** the chosen domain. (`tutumatch.com.au` is already wired into the codebase as the default — if you pick something else I'll update references.)

---

## Step 3 — Supabase (~20 min)

This replaces the local `data/*.json` files with a real Postgres database, and the local `data/uploads/` folder with proper encrypted document storage.

1. **https://supabase.com/** → "Start your project" → sign up (use GitHub for convenience)
2. Create a new project:
   - Name: `tutumatch`
   - Database password: **generate a strong one, save it in a password manager** (you can't recover it later)
   - **Region: Sydney (`ap-southeast-2`)** — important for AU users and privacy
   - Plan: Free
3. Wait ~2 minutes for provisioning
4. Once live, in the Supabase dashboard:
   - **Project Settings → Database** → copy the **"Connection string"** (URI mode). Replace `[YOUR-PASSWORD]` with the password from step 2 → this is your `DATABASE_URL`
   - **Project Settings → API** → copy the **"Project URL"**, the **`anon` public key**, and the **`service_role` key**
5. Set up Storage:
   - **Storage → Create a new bucket** named `verification-docs`
   - Set it to **Private** (NOT public — verification docs must not be openly accessible)

**Send me / set in Vercel later:**
```
DATABASE_URL = (connection string from step 4)
NEXT_PUBLIC_SUPABASE_URL = (project URL)
SUPABASE_SERVICE_ROLE_KEY = (service_role key — sensitive, treat like a password)
```

**Cost:** Free up to 500 MB DB + 1 GB storage. Roughly the first ~1000 users.

---

## Step 4 — Stripe (~20 min + 24-48h verification wait)

1. **https://stripe.com/au** → "Start now" → sign up with your real name + email
2. The dashboard opens in **test mode** by default — you can develop against test keys immediately
3. To take real money, **activate** the account:
   - Click "Activate payments" (top-right of dashboard)
   - Fill in: ABN, business name, address, what you sell ("online tutor marketplace, $20 introduction fee"), bank account for payouts, your ID
   - Stripe verifies in ~24-48 hours
4. Once you have both test + live keys:
   - **Developers → API keys** → copy the **publishable key** (`pk_…`) and the **secret key** (`sk_…`)
5. Set up a webhook so Stripe can tell our app when a payment succeeded:
   - **Developers → Webhooks → Add endpoint**
   - URL: `https://<your-domain>/api/stripe/webhook` (won't work until Vercel is deployed — set it up anyway)
   - Events: `payment_intent.succeeded`, `payment_intent.payment_failed`, `charge.refunded`
   - Copy the **webhook signing secret** (`whsec_…`)

**Send me / set in Vercel:**
```
STRIPE_PUBLISHABLE_KEY = pk_test_… (or pk_live_… once activated)
STRIPE_SECRET_KEY = sk_test_… (or sk_live_…)
STRIPE_WEBHOOK_SECRET = whsec_…
```

**Cost:** No monthly fee. 1.7% + $0.30 AUD per successful card payment. A $20 unlock costs you ~$0.64 in fees → you keep ~$19.36.

---

## Step 5 — Resend (transactional email, ~10 min)

1. **https://resend.com/** → sign up
2. Add your domain:
   - **Domains → Add Domain** → enter your registered domain
   - Resend will show 3 DNS records (SPF, DKIM, return-path) to add at your registrar
   - Go back to VentraIP → DNS management → add the 3 records
   - Click "Verify" on Resend (DNS takes ~10 min to propagate)
3. **API Keys → Create API Key** → name it "production"

**Send me / set in Vercel:**
```
RESEND_API_KEY = re_…
RESEND_FROM_EMAIL = TUTUMatch <hello@tutumatch.com.au>
```

**Cost:** Free up to 3,000 emails/month, 100/day. Plenty for early users.

---

## Step 6 — Vercel (deploy, ~15 min)

1. **https://vercel.com/** → sign up with GitHub
2. **Add New → Project** → select the **TUTUMatch repo**
3. Vercel auto-detects Next.js — leave defaults
4. **Environment Variables** — add each from steps 3, 4, 5 plus these:
   ```
   NEXTAUTH_SECRET = (generate a 32+ char random string)
   ADMIN_EMAILS = your.email@example.com
   ```
5. **Deploy** — first deploy ~2 minutes
6. **Add your domain:** Project → Settings → Domains → add `tutumatch.com.au`. Vercel gives you 2 DNS records to add at VentraIP. Add them.
7. **Cron job** for the 5-day auto-refund:
   - The codebase has the processor logic in `src/lib/db.ts` (`processOverdueRefunds`) and lazy-fires it on dashboard / messages page loads
   - For production reliability, add `vercel.json` with a cron config pointing at `/api/cron/refund-flag` every 15 minutes (I'll add this when wiring Stripe)

**Cost:** Free. You'd only pay if you exceed 100 GB bandwidth/month.

---

## Step 7 — Optional: Sentry (error monitoring, ~5 min)

1. **https://sentry.io/** → free plan → create project (Next.js)
2. Copy the **DSN**

**Set in Vercel:**
```
SENTRY_DSN = https://…@sentry.io/…
```

**Cost:** Free up to 5,000 events/month.

---

## What I'll do once you send keys

Each service is independent. Tell me what you've set up and I'll wire it:

- **Supabase keys ready?** → I migrate the JSON store to Prisma + Postgres, swap upload storage from local disk to Supabase Storage with signed URLs at-rest encrypted.
- **Stripe keys ready?** → I replace the dev unlock shortcut with the real PaymentIntent flow + wire the webhook for `paid` / `refunded` / `failed`. The 5-day auto-refund processor calls Stripe to actually move the money.
- **Resend ready?** → I wire all 9 transactional email templates (signup verification, password reset, application status, unlock receipt, tutor unlock notification, refund processed, suspension notice, new message alert, first-lesson reminder).
- **Deployed to Vercel?** → I add `vercel.json` with cron config + verify production env vars.

---

## Realistic timeline if doing solo in evenings

- **Day 1 (~1 hr):** ABN + domain
- **Day 2 (~1 hr):** Supabase + Resend signups + DNS records
- **Day 3 (~30 min):** Stripe signup (then wait 24-48h for verification)
- **Day 4 (~1 hr):** Vercel deploy with everything wired

**Technically live in 4-5 days.** Public launch depends on the Phase 2 legal stuff (Pty Ltd + insurance + lawyer review) being sorted in parallel — see the **Founder / legal** section in README.md.

---

## When you come back to this

- Read this file top-to-bottom — order matters
- Re-check **README.md → Status** for current state of the codebase
- Re-check **README.md → Technical roadmap** for what's still pending
- When you've completed a step, tell me which keys you have and I'll wire that service. They're independent.

Email: change `hello@tutumatch.com.au` in `src/components/landing/Footer.tsx`, `src/app/legal/*`, and the legal stubs once you have a real inbox.
