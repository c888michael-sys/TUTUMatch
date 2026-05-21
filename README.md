# TUTUMatch

A flat-fee NSW tutor marketplace. Tutors list free; parents pay $20 once per match, refunded as the tutor's first-lesson discount. After the introduction, the platform is out of the loop.

---

## Status (as of latest commit)

What's working end-to-end right now:

- **Landing page** — full v3 design ported, all sections (Hero with For-parents/For-tutors split, Pitch, Mechanic, How, Comparison, Trust, Guarantee, sample tutor cards, Earnings, FAQ, Final CTA, Footer).
- **School-branded landing pages** at `/schools/[slug]` and an `Other Locations` route at `/schools/other`. Browse tabs switch between areas. Same layout, only the brand colour + content change per area.
- **Browse view** with filters (subject category chips: Math / English / Physics / Chemistry / Biology / Science K-10 — in that order; day-of-week availability chips with a "you might be limiting options" warning; min ATAR; max $/hr; mode) and sort (Oldest profiles first by default, Highest subject result alternative — bands map to marks: B6/E4 → 90, B5/E3 → 80, etc.). Reads **real approved tutor applications** from the JSON store (with `status=APPROVED` and `visibility=true`) and merges them with the demo samples — real first, deduped by name. Real cards have no "Example" badge and link to their actual `/tutors/[applicationId]` profile.
- **Tutor profile page** at `/tutors/[id]` with the refund policy laid out before any payment ask.
- **Unlock confirm page** at `/unlock/[tutorId]` with the same refund explainer — the actual $20 charge is a stub until Stripe is wired.
- **Auth** — sign up, log in, log out. HMAC-signed cookie sessions, `scrypt` password hashing, password show/hide toggle. Admin promotion via `ADMIN_EMAILS` env allowlist. Storage is a local JSON file (`data/users.json`).
- **Tutor signup form** with full validation:
  - 18+ age gate — under-18 submissions are **auto-rejected** at the API layer with reviewer notes recording the date of birth and computed age. The application row is stored (not silently dropped) so there's an audit trail, and the tutor sees an explicit rejection banner in their dashboard. Same logic applies on profile edit.
  - WWCC details, ATAR, HSC results
  - "High school attended" with conditional "Other school" free text
  - Per-subject year-level selection + "All years" toggle (subjects offered must be a subset of subjects sat)
  - Multi-slot weekly availability in 15-min increments
  - Tutoring-area dropdown (`Near Killara` / `Near Masada` / `Other location`) that drives which school tab the profile appears under
  - Bio scanned server-side for contact-info bypass (phone/email/social handles)
- **Admin** — list of applications with status pills and bio-scanner flags. Detail page with side-by-side fields, reviewer notes, approve / pause / reject / pending-back actions, and "Test unlock + chat" / "View public profile" shortcuts.
- **Tutor dashboard** — `/dashboard` shows status pill, reviewer notes, edit + view-public-profile buttons, visibility toggle, and conversation count. `/tutor/edit` reuses the signup form pre-filled with the existing submission; saving updates the application and resets status to Pending review (admin re-approves). Visibility toggle is a one-click switch independent of status.
- **Safety, suspension & auto-refund** — the tutor signup form has a prominent safety callout (public libraries recommended; TUTUMatch verifies identity but does not choose lesson locations or take responsibility for what happens at any lesson). The chat thread surfaces the same reminder to the tutor side. If a tutor doesn't reply to an unlocked parent within 5 days, the platform auto-refunds the parent's $20 AND suspends the tutor's account. Suspended users are signed out, can't log back in, and see an explicit appeal-by-email message (`appeals@tutumatch.com.au`). The refund/suspension processor runs lazily on dashboard + messages page loads (and will move to a Vercel cron once production hits). A dev-only "Skip the 5-day wait" button on the parent's side of the chat lets us demo the flow locally.
- **Platform chat** — `/messages` lists threads, `/messages/[unlockId]` is the chat. Post-unlock contact info is revealed inside the thread. Tutor reminder to apply the $20 first-lesson discount is surfaced on their side. First tutor reply records `tutorFirstReplyAt` (used by the 5-day refund auto-flag once Stripe is wired). Local-dev unlock shortcut at `POST /api/unlocks/dev-create` lets us exercise the full sign-up → approve → unlock → chat loop without Stripe.
- **Legal stubs** — Terms, Privacy (APP-aligned), Child Safety drafts at `/legal/*`.
- **Prisma schema** — full data model (users, tutor profiles, schools, HSC results, subjects, availability, verifications, unlocks, payments, refunds, messages, reports). Not yet connected to a real DB.

The original v3 prototype (HTML + JSX + screenshots) lives in `design-reference/` for visual diffing.

---

## Technical roadmap

Tick items off here as they ship. This list is the canonical source of truth for what's left.

### Critical for first paid launch

- [ ] **Database** — swap the local JSON store for real Postgres
  - [ ] Provision Postgres (Supabase recommended — see Hosting below)
  - [ ] Set `DATABASE_URL` + `DIRECT_URL` in `.env.local` and Vercel
  - [ ] Run `prisma:generate` + `prisma:migrate` against the existing `prisma/schema.prisma`
  - [ ] Replace `src/lib/db.ts` (JSON helpers) with Prisma client calls — keep the function names the same so callers don't change
  - [ ] Seed schools via `prisma/seed.ts`
- [ ] **Stripe payments**
  - [ ] Create Stripe account, verify business (ABN required), get test + live keys
  - [ ] Wire `POST /api/unlock` to create a $20 AUD PaymentIntent + an `Unlock` row
  - [ ] Wire `POST /api/stripe/webhook` to mark the Unlock `PAID`, set `refundEligibleAt = now + 5d`, fire the unlock notification email
  - [x] 5-day auto-refund processor + tutor suspension already wired against the JSON store. Lazy-fires on dashboard + messages page loads. `/api/cron/refund-flag` still needs to hook into the same `processOverdueRefunds()` helper once Stripe is live so production gets a scheduled trigger too.
  - [ ] Wire `POST /api/refund` to actually call Stripe for the money movement (the local processor only flips status + suspends; no real funds move yet)
  - [ ] Configure webhook endpoint in Stripe dashboard pointing at `https://<domain>/api/stripe/webhook`
- [~] **Identity & WWCC verification** (manual review is fine for v1)
  - [x] File-upload UI in `/tutor/signup` and `/tutor/edit` for: government ID, WWCC document, HSC Record of Achievement (PDF / JPG / PNG / HEIC / WEBP, 8 MB max each)
  - [x] Admin verification view shows the uploaded documents inline on `/admin/applications/[id]` — links open the original file in a new tab via the access-checked `/api/uploads/[id]` endpoint
  - [x] Tutor can view their own uploaded docs; admins can view any; everyone else gets 403
  - [ ] Real storage (Supabase Storage / S3) with at-rest encryption + short-lived signed URLs — current implementation is **local filesystem only** (`data/uploads/<userId>/`). DO NOT deploy to multi-user prod hosts yet.
  - [ ] Virus scan on upload (e.g. ClamAV or a SaaS scanner)
  - [ ] Manual WWCC lookup workflow against the NSW OCG public verification (paste number + DOB + name, record the outcome)
  - [ ] Document each verification with reviewer name + date + result on the `Verification` row
- [ ] **Transactional email** (Resend recommended — see Hosting)
  - [ ] Account creation — verify-your-email link (one-time token, 24h TTL)
  - [ ] Password reset — forgot-password link (one-time token, 30min TTL)
  - [ ] Tutor application submitted — confirmation to tutor
  - [ ] Tutor approved / rejected — notification with reviewer notes
  - [ ] Parent unlocks a tutor — notification to the tutor ("$20 collected, remember the first-lesson discount")
  - [ ] $20 unlock receipt — to the parent
  - [ ] First-lesson reminder + the $20 discount instruction — to the tutor
  - [ ] 5-day auto-refund processed — to the parent
  - [ ] Manual refund processed — to the parent + admin audit copy
  - [ ] New in-platform message — to the recipient
- [x] **Live profiles in browse** — `/browse` and `/schools/[slug]` now read approved + visible applications from the JSON store, merge them with the demo samples (real first, deduped), and render them through the same filter/sort pipeline. Cards link to the real `/tutors/[id]` for live tutors; the "Example" badge only renders for samples. A "X verified tutors live" counter sits under the filters.
  - [ ] Pagination + cursor-based loading (deferred — fine without it until a single school has 50+ tutors)
  - [x] Cards link to the real `/tutors/[id]` (not `sample-*`)
- [x] **Tutor dashboard**
  - [x] View profile status with status pill + reviewer notes
  - [x] Edit profile — reuses the same form. Any edit drops status back to PENDING_REVIEW for admin re-approval (child-safety policy).
  - [x] Visibility toggle (`/api/tutor/applications/visibility`) — independent of status; tutor can pause their listing without re-review
  - [x] View public profile shortcut (so the tutor can see what parents see)
  - [x] Inbox surface (count of parents who unlocked) — full chat lives at `/messages`
  - [x] Lifetime unlock stats (count of parents unlocked, replied-to, refunded) shown in a small stat row on the dashboard
  - [ ] Actual dollar earnings (waits on Stripe — once we have real unlock payment records the dashboard can sum those)
- [x] **In-platform messaging** (post-unlock)
  - [x] Chat UI between the parent and the unlocked tutor (`/messages`, `/messages/[unlockId]`)
  - [x] Stores threads + messages in the JSON store; first tutor reply stops the 5-day refund clock (`tutorFirstReplyAt`)
  - [x] Dev shortcut: `POST /api/unlocks/dev-create` creates a PAID Unlock without Stripe so the flow can be demoed end-to-end. Disabled when `NODE_ENV=production`.
  - [ ] Email notification on each new message (waiting on Resend wiring)
- [ ] **Tutor's own profile management** — `/tutor/me` route (or extend dashboard) so they can edit after approval

### Hosting recommendation

Tested combo that fits on free tiers for early launch:

| Service     | What for                       | Free tier covers                          |
|-------------|--------------------------------|-------------------------------------------|
| **Vercel**  | Hosting Next.js + Cron         | 100 GB/mo bandwidth, custom domains, Cron |
| **Supabase** (AU region) | Postgres + Storage (verification docs) | 500 MB DB + 1 GB storage |
| **Resend**  | Transactional email            | 3,000 emails/mo, 100/day                  |
| **Stripe**  | Payments + refunds             | 1.7% + $0.30 per AU card txn (no monthly fee) |
| **Sentry**  | Error monitoring (optional)    | 5k events/mo                              |
| **auDA registrar** | `tutumatch.com.au` domain | ~$15/year                                |

Pick Supabase over Neon because: same provider gives you Postgres + Storage (so verification docs and DB share one auth context) and it has Sydney region.

- [ ] Register `tutumatch.com.au` (or chosen domain)
- [ ] Create Vercel project, connect this GitHub repo
- [ ] Create Supabase project in `ap-southeast-2` (Sydney), grab connection string
- [ ] Create Resend account, add the domain, verify DNS
- [ ] Add all production env vars from `.env.example` to Vercel
- [ ] Configure Vercel Cron to hit `/api/cron/refund-flag` every 15 minutes
- [ ] Optional: Sentry project + DSN in env

### Nice-to-have (post first launch)

- [ ] Sign in with Google (OAuth) on `/login`
- [x] **Schools CRUD admin UI** — `/admin/schools` lets you add/edit/deactivate schools (slug, name, tagline, three brand colours, active toggle). Stored in `data/schools.json`. New schools become tabs on the public site instantly; their brand colour drives the theming via CSS variables.
- [x] **Refund queue UI** in `/admin/refunds` — buckets unlocks into auto-refunded (with tutor suspension status + one-click unsuspend), approaching the 5-day window, and active.
- [x] **Manual unsuspend** — admin button on the refunds page; clears suspension fields so the user can log in again.
- [x] **Reports / dispute resolution UI** — anyone signed in can report a tutor profile (from `/tutors/[id]`) or a chat thread (from `/messages/[unlockId]`) with a reason + description. Admin queue at `/admin/reports` shows open reports first, click to expand → resolve / dismiss with optional notes + action taken (Warned / Suspended user / Rejected application / Refunded parent). Suspending from the report applies the same `suspended` flag the auto-refund flow uses.
- [ ] Tutor photo upload with admin moderation (needs file storage — pair with the WWCC/ID/HSC upload work)
- [ ] Analytics (Plausible — privacy-friendly, cheap)
- [~] **Accessibility baseline** — visible focus rings on all interactive elements, skip-to-content link, `prefers-reduced-motion` respected globally, form errors announced via `role="alert" aria-live="polite"`, larger tap targets (44px min) on touch devices. Still TODO: a proper end-to-end keyboard nav audit, contrast checks against WCAG AA, and screen-reader testing.
- [~] **Mobile polish baseline** — TopNav wraps and truncates on small screens, browse hero / controls / tabs get tighter padding under 520px, admin tables scroll horizontally, tutor form grids collapse to single column under 900px. Still TODO: full mobile pass on /admin/applications/[id] and the chat thread on phones.

### Founder / legal (off-code work)

- [ ] Register an ABN
- [ ] Decide sole trader vs Pty Ltd — strongly consider Pty Ltd for liability cover given child-safety exposure
- [ ] Public liability + professional indemnity insurance quotes
- [ ] Have a lawyer review the Terms, Privacy, Child Safety drafts in `src/app/legal/`
- [ ] Business bank account
- [ ] GST registration reminder (mandatory once turnover ≥ $75k/yr)
- [ ] **Get written permission from each school** before activating their landing page — save the evidence and only then flip `School.active = true`
- [ ] Set up `safety@tutumatch.com.au` and route it to a real inbox; train admins on mandatory reporting
- [ ] OAIC data-breach response plan documented

---

## Local setup

```powershell
# 1. install
npm install

# 2. env
Copy-Item .env.example .env.local
# at minimum set NEXTAUTH_SECRET (32+ chars) and ADMIN_EMAILS

# 3. dev server
npm run dev
# → http://localhost:3000
```

Once you have a Postgres URL set in `.env.local`:

```powershell
npm run prisma:generate
npm run prisma:migrate     # creates the initial migration
npm run seed               # inserts the two demo schools
```

Type-check: `npm run typecheck`. Build: `npm run build`.

## Adding a new school (no code, once admin CRUD ships)

Until the admin CRUD form is built, add a school by editing `src/lib/schools.ts` (slug, name, tagline, brand colours). The CSS-variables theming means no recompile is needed at runtime — once the field is in the DB, a row insert is enough.

## Routes

| Path                                | What it is                                                                | State        |
|-------------------------------------|----------------------------------------------------------------------------|--------------|
| `/`                                 | Default landing page                                                       | ✅ Done      |
| `/schools/[slug]`                   | School-branded browse (Killara / Masada / Other)                          | ✅ Done      |
| `/browse`                           | All-tutors browse with filters                                            | ✅ Done (samples) |
| `/tutors/[id]`                      | Tutor profile + refund explainer + contact CTA                            | ✅ Done (samples) |
| `/unlock/[tutorId]`                 | $20 confirm page with refund policy                                       | ✅ UI done, payment stub |
| `/tutor/signup`                     | Multi-section tutor application form with all checks                      | ✅ Done      |
| `/dashboard`                        | Tutor + parent hub: status, edit, visibility toggle, conversations        | ✅ Done      |
| `/tutor/edit`                       | Edit tutor profile (resets status to Pending review on save)              | ✅ Done      |
| `/messages`                         | List of chat threads (parent ↔ tutor) for the current user                | ✅ Done      |
| `/messages/[unlockId]`              | Chat thread (post-unlock, with contact info revealed)                     | ✅ Done      |
| `/admin`                            | Admin: applications queue + approve/reject                                | ✅ Done      |
| `/admin/applications/[id]`          | Application detail + review actions + test-unlock shortcut                | ✅ Done      |
| `/login`                            | Email + password auth (signup tab on same page)                           | ✅ Done      |
| `/legal/terms`                      | Terms of Service                                                          | 📝 Draft     |
| `/legal/privacy`                    | Privacy Policy                                                            | 📝 Draft     |
| `/legal/child-safety`               | Child Safety Policy                                                       | 📝 Draft     |
| `/how-it-works`                     | Standalone explainer (parent + tutor flows + safety summary)              | ✅ Done      |
| `/contact`                          | Routed contact emails: general / safety / appeals / privacy               | ✅ Done      |
| `POST /api/auth/{signup,login,logout,me}` | Cookie-based auth                                                  | ✅ Done      |
| `POST /api/tutor/applications`      | Submit a tutor application                                                | ✅ Done      |
| `PUT  /api/tutor/applications`      | Update current user's application (sets status back to Pending review)    | ✅ Done      |
| `PATCH /api/tutor/applications/visibility` | Toggle profile visibility (no re-review)                          | ✅ Done      |
| `GET/PATCH /api/admin/applications` | List + approve/reject                                                     | ✅ Done      |
| `/admin/schools`                    | Admin: add / edit / deactivate schools                                    | ✅ Done      |
| `/admin/refunds`                    | Admin: refund queue + tutor suspension status + unsuspend                 | ✅ Done      |
| `/admin/reports`                    | Admin: reports queue — resolve / dismiss with action taken                | ✅ Done      |
| `POST /api/reports`                 | Submit a report (any signed-in user)                                      | ✅ Done      |
| `PATCH /api/admin/reports/[id]`     | Admin resolve / dismiss + optional suspend                                | ✅ Done      |
| `POST /api/uploads`                 | Upload a verification document (multipart, signed-in user)                | ✅ Done (local) |
| `GET  /api/uploads/[id]`            | Fetch a doc — owner or admin only                                         | ✅ Done (local) |
| `GET/POST /api/admin/schools`       | List + create school                                                      | ✅ Done      |
| `PATCH/DELETE /api/admin/schools/[id]` | Update / delete school                                                 | ✅ Done      |
| `POST /api/admin/users/[id]/unsuspend` | Admin: clear suspension                                                | ✅ Done      |
| `POST /api/unlocks/dev-create`      | Dev-only: create a PAID Unlock without Stripe                             | ✅ Done (dev) |
| `POST /api/unlocks/[id]/fast-forward` | Dev-only: skip the 5-day wait, trigger refund + tutor suspension          | ✅ Done (dev) |
| `GET /api/threads`                  | Current user's chat threads                                               | ✅ Done      |
| `GET/POST /api/threads/[unlockId]/messages` | Fetch + send messages in a thread                                 | ✅ Done      |
| `POST /api/unlock`                  | Create unlock + Stripe PaymentIntent                                      | 🚧 Stub      |
| `POST /api/stripe/webhook`          | Stripe webhook                                                            | 🚧 Stub      |
| `POST /api/refund`                  | Parent or admin refund                                                    | 🚧 Stub      |
| `GET  /api/cron/refund-flag`        | 5-day refund window flagger                                               | 🚧 Stub      |

## Tech

Next.js 14 (App Router) · TypeScript · Tailwind · CSS-variable theming · Prisma + Postgres (schema written) · `scrypt`-hashed passwords + HMAC cookie sessions · Stripe (planned) · Resend (planned) · Supabase Storage (planned).

---

## Design reference

`design-reference/` contains the original v3 HTML + JSX + screenshots that this codebase ports from. Useful for visual diffing if you tweak the landing layout.

## Contact

`hello@tutumatch.com.au` — change to whichever inbox the founder uses. Reflected in `src/components/landing/Footer.tsx` and the legal stubs.
