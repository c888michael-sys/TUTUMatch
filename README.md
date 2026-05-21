# TUTUMatch

A flat-fee NSW tutor marketplace. Tutors list free; parents pay $20 once per match, refunded as the tutor's first-lesson discount. After the introduction, the platform is out of the loop.

> ## 🔄 Direction: pivoting to pure-directory model (decided 2026-05-21)
>
> After working through the legal-exposure analysis with parents-paying versus tutors-paying-commission models, the chosen direction is **a pure directory** (Hipages / Indeed style) where:
>
> - Parents browse, contact, and use everything completely **free** (no platform transaction at all)
> - Tutors are charged a **commission per confirmed match** ($20, or $15 with the honesty discount)
> - The first matched student is **free for the tutor** — commission kicks in for the second matched student onwards (marketing framing: "first student free")
> - The platform makes **no verification claims** about tutors anywhere — listings are tutor-provided, parents verify directly
>
> This drops the legal risk profile from "verified marketplace facilitator" (high exposure, needs Pty Ltd + ~$1,400/yr insurance) down to "classifieds directory" (Hipages-tier exposure, ~$500/yr media liability is enough). Total realistic ongoing cost lands around **$500–1,000/yr** rather than $2,000+.
>
> **Current code state:** stable verified-marketplace checkpoint (commit [`60005ef`](https://github.com/c888michael-sys/TUTUMatch/commit/60005ef)). The pivot work is planned in this README but not yet started — start of next session.
>
> The **New model** section below has every design parameter (timings, fees, strike system, appeal flow, WWCC framing). The **Pivot work plan** breaks the code refactor into ~4 sessions of focused work. The original verified-marketplace **Status** section is kept further down for reference until the pivot lands.

---

## The new model — directory + confirmed-match commission

### Money flow (the key change)

- Parent pays **$0** to the platform — ever, in any flow
- Tutor pays **$20** when a parent confirms a match with them (or **$15** if the tutor self-reports the match honestly before the parent confirmation prompt arrives)
- **First matched student for any new tutor is free** — commission starts on second confirmed match onwards. This is the headline marketing pitch for tutors
- Future possibility (not now): bump base commission to **$25 ($20 with honesty discount)** for *new* tutors only, if the model proves out

### The match flow, end to end

1. **Tutor lists for free.** Profile shows their info, subjects, rate, area, etc. Submits WWCC details (see WWCC framing below). Profile goes live after a light spam/abuse-only check by admin — **no credential verification**.
2. **Parent browses for free.** No signup needed to browse. Filter by subject, area, rate.
3. **Parent clicks "I want this tutor".** Free click; reveals the tutor's contact details (email + phone) so the parent can reach out directly. Account creation may be needed at this point for tracking, but no money changes hands.
4. **The 48-hour conversation window opens.** As soon as the parent clicks, the tutor's listing is **temporarily hidden** from public browse (other parents can't simultaneously "claim" them). The tutor is notified immediately: "[Parent name] selected you — self-report within 48 hours if you book a lesson for the $15 honesty rate AND to keep your listing visible."
5. **Tutor either self-reports OR waits.**
   - **Self-reports a confirmed match** within 48h → charged **$15**, listing immediately returns to public browse. Done.
   - **Self-reports no match** within 48h → no charge, listing returns to browse.
   - **Doesn't respond** → goes to step 6 after 48h.
6. **Confirmation prompt sent to parent after 48 hours.** "Did you have a lesson with [tutor]? Yes / No / Not yet." Single-click email links. Multiple reminders at 7, 14, 30 days if no reply.
7. **Resolution paths:**
   - Parent says **Yes** → tutor charged **$20** (no honesty discount; they missed the self-report window). Listing returns to browse.
   - Parent says **No** → no charge. Listing returns to browse.
   - Parent doesn't reply within 30 days → platform asks the tutor directly. If tutor says yes → charged $15 (treated as late self-report). If tutor says no → no charge but logged for audit (random spot-checks happen — see below).
8. **Listing returns to public browse** in all resolved cases.

### The strike system (for tutors who lie about no match when there was one)

A "strike" is triggered when:
- Parent confirms a match happened, AND
- Tutor previously said no, AND
- (After appeal process if used — see below)

| Strike | Penalty | Reinstatement |
|---|---|---|
| **1** | Profile hidden 7 days | Pay the missed $20 to reappear |
| **2** | Profile hidden 30 days | Pay the missed $20 to reappear (no penalty fee) |
| **3** | Profile permanently hidden | Pay $20 to unlock. **All future matches cost $20** (no honesty discount, perpetual) |
| 4+ | Same as 3 — pay $20 per unlock each time | |

The user's explicit reasoning here: keep the strike penalties moderate so honest mistakes can be recovered from, but make a third strike permanently sticky on the $20 rate so consistently dishonest tutors are effectively gating themselves out of the discount.

### Appeal flow (for genuine disputes)

When the parent says no but the tutor insists a match happened, the tutor can **appeal** before the strike is recorded:

- Tutor uploads evidence (bank transfer screenshot, lesson notes, parent's reply mentioning the lesson, etc.)
- Admin manually reviews. Bank transfer with name match = automatic pass.
- If admin agrees → tutor's claim wins, $20 charged, no strike.
- If admin disagrees → strike applied as normal.

This protects honest tutors against parents who lie to avoid the platform seeing the match (which could happen if the tutor and parent took everything off-platform and the parent thinks the tutor should eat the cost).

### WWCC handling — the careful framing

This is the most delicate part of the directory positioning. We need WWCC for child-safety reasons but we **cannot frame ourselves as verifying it** — that's what made the verified-marketplace model legally exposed.

**The platform's framing to tutors at signup:**
> "We ask for your WWCC details so you have them ready to give directly to parents who ask. Parents have the right (and the responsibility) to verify your WWCC directly with the [NSW Office of the Children's Guardian](https://www.kidsguardian.nsw.gov.au/working-with-children/employer-or-agency/how-to-verify-a-wwcc) before any lesson. We don't perform that verification for them and we don't display a 'verified' badge — but having your WWCC ready means a parent can do their own check in 30 seconds."

**The platform's framing to parents:**
> "Tutors on TUTUMatch self-declare a WWCC. **TUTUMatch does not verify WWCCs.** Before booking a lesson, please verify the tutor's WWCC directly at the NSW OCG public lookup [link]. It takes 30 seconds and is free."

**What we collect (same as today):** WWCC number, WWCC full name, WWCC date of birth. These are stored on the application and **shown to the tutor on their own dashboard** so they can copy them when a parent asks. They are **not displayed publicly** and not used to grant any platform-side badge.

**What we DON'T do:** check WWCCs ourselves, display verification badges, claim the tutor is "screened" or "vetted" or "safe", show any platform-stamped trust signal anywhere on the site.

This gives the safety benefit (tutors have WWCCs, parents can verify) without the legal exposure (no verification representation by the platform).

### Free-for-the-first-student framing

This is a real positioning advantage and should be on the landing page front and centre:

> **List free. Your first matched student costs you nothing. From your second student onwards, TUTUMatch charges a flat $20 commission per match — refundable as a $15 rate if you self-report honestly. No subscription. No per-lesson cut. Only pay when a real student commits.**

This is the genuine differentiator vs. tutoring centres (40-60% per lesson, forever) and pay-to-list directories (upfront cost with no guaranteed return).

---

## Pivot work plan — what changes in the code

Realistic estimate: **3–4 focused sessions of work**. Below is the session breakdown.

### Session 1 — Content audit + remove all verification claims

Goal: strip the verified-marketplace language site-wide so the directory framing is consistent.

| File / location | Change |
|---|---|
| `src/components/landing/Hero.tsx` | Remove "verified tutor" framing; reframe as "find a local tutor" |
| `src/components/landing/Trust.tsx` | **Delete** the whole Trust section ("WWCC verified", "Government ID checked", etc.) |
| `src/components/landing/Comparison.tsx` | Remove rows that hinge on verification; replace with "listed locally" angle |
| `src/components/landing/FAQ.tsx` | Rewrite verification-related FAQs into "you verify yourself" answers |
| `src/components/landing/LandingPage.tsx` | Remove Trust from the section order |
| `src/components/school/SchoolBrowse.tsx` | Remove "X verified tutors live" counter; replace with "X tutors listed" |
| `src/app/tutors/[id]/page.tsx` | Remove anything implying TUTUMatch vouches for the tutor |
| `src/app/legal/terms/page.tsx` | Rewrite Sections 1, 5, 7 to reflect directory positioning — no verification claims, no consumer relationship with parents |
| `src/app/legal/child-safety/page.tsx` | Reframe as "what we ask tutors to have" rather than "what we verify" |
| `src/components/landing/Footer.tsx` | Disclaimer block already mostly aligned — small tweaks |
| `src/app/how-it-works/page.tsx` | Rewrite both flows for the new model |
| `src/components/landing/Earnings.tsx` | Reframe "$50 in your pocket" with the "first student free, $20 thereafter" framing |
| New: prominent **"What TUTUMatch is and isn't"** page or banner | "We're a classifieds directory. Listings are tutor-provided. We don't verify anything. Parents verify tutors directly." |

### Session 2 — Remove parent payment flow + introduce "I want this tutor" intent capture

Goal: rip out the unlock-fee transaction; introduce the free-intent-button flow that triggers the 48h hidden window.

| Change | Files |
|---|---|
| **Delete** the unlock confirm page in favour of an "I want this tutor — see contact details" page (no payment, just reveals contact) | `src/app/unlock/[tutorId]/page.tsx` → replace with `src/app/contact/[tutorId]/page.tsx` (or rename route) |
| **Delete** the `ConfirmUnlockButton` payment wiring | `src/components/unlock/ConfirmUnlockButton.tsx` |
| **Delete** parent-side dev unlock shortcut | `src/app/api/unlocks/dev-create/route.ts` |
| **Rewrite** the Unlock data type → `Match` (no money on parent side; tracks the 48h window + later commission flow) | `src/lib/db.ts` |
| **Add** "request contact" API that creates a Match record, hides tutor profile temporarily, notifies tutor | New `src/app/api/matches/request/route.ts` |
| **Add** tutor notification flow ("[Parent] selected you — self-report for $15 + faster profile reappear") | New page + email template stub |
| **Strip** all of `/legal/terms` references to the $20 unlock fee + 5-day parent refund mechanic | `src/app/legal/terms/page.tsx` |
| **Strip** parent-facing refund language site-wide | Multiple files |
| **Remove** the in-platform chat thread feature entirely | Delete `src/app/messages/`, `src/components/messages/Thread.tsx`, related APIs |
| **Remove** the refund + auto-suspension flow (replaced by the strike system in session 3) | Multiple files |

### Session 3 — Confirmation flow + strike system + tutor commission

Goal: build the post-match resolution flow (self-report, parent confirmation, strike system, payment).

| Change | Notes |
|---|---|
| **Add** tutor self-report endpoint + dashboard button ("I had a lesson with this parent — confirm match for $15") | Triggers Stripe charge of $15 |
| **Add** scheduled parent-confirmation prompt at 48h after the match request | Email + on-site banner. Single-click "Yes / No / Not yet" buttons. |
| **Add** parent-confirmation API | Triggers $20 charge to tutor on yes; no charge on no. |
| **Add** retry schedule for unresponsive parents | 7 days, 14 days, 30 days. Then auto-ask tutor. |
| **Add** strike system tracking on user record | New fields: `strikeCount`, `strikeHistory`, etc. |
| **Add** strike actions: hide profile for 7 days (strike 1) → 30 days (strike 2) → permanent + $20-per-match perpetual (strike 3+) | Includes a "pay the missed $20 to reappear" mechanism for strike 1/2 |
| **Add** Stripe Connect integration so tutors have a saved payment method (required to list once past their first free match) | Replaces the current Stripe-stub |
| **Add** appeal endpoint for tutors who dispute a no-match parent reply | Upload evidence → admin review |
| **Add** admin view: pending appeals queue with evidence images | Extends `/admin` |

### Session 4 — WWCC reframe + admin pivot + polish

| Change | Notes |
|---|---|
| **Reframe** tutor signup WWCC section as "we ask so you have it ready for parents" | `src/components/tutor/SignupForm.tsx` |
| **Reframe** WWCC display on the tutor's own dashboard (visible to them, not the public) | New dashboard widget |
| **Remove** WWCC from public profile display (parents see "ask the tutor for their WWCC" prompt instead) | `src/app/tutors/[id]/page.tsx` |
| **Reframe** admin approval queue as **spam/abuse moderation only**, NOT credential check | Admin pages |
| **Remove** the "auto-reject under 18" auto-mechanism in favour of "you must self-declare 18+ to list" tickbox (we don't verify DOB ourselves) | `src/app/api/tutor/applications/route.ts` |
| **Remove** the document upload + admin verification block from the signup form | These become tutor-private optional uploads, not part of verification |
| **Update** the indemnity clause in Terms to reflect new model (lower platform exposure, narrower indemnity scope) | `src/app/legal/terms/page.tsx` |
| **Update** Privacy Policy to reflect the data we now collect (less, mostly tutor-side) | `src/app/legal/privacy/page.tsx` |
| **Update** `/how-it-works` to match the new flow with diagrams | `src/app/how-it-works/page.tsx` |
| Re-test all the disclaimers, footer copy, and the "What TUTUMatch is and isn't" page | All-pages pass |

---

## Risk profile under the new model

For comparison:

| Model | Legal positioning | Typical defence cost if sued | Insurance | Pty Ltd needed? |
|---|---|---|---|---|
| Original verified-marketplace (current code) | Platform as verifier + payment facilitator | $50k–200k | $1,000–1,400/yr (PI + PL) | Yes |
| Parent-pays + no verification claims | Directory + consumer transaction | $20k–50k | $500–800/yr | Strongly suggested |
| **Pure directory + confirmed-match commission (chosen)** | **Hipages / classifieds tier** | **$10k–30k** | **$300–600/yr (basic media liability)** | **Optional but cheap insurance recommended** |

Realistic ongoing cost in the new model: **~$500–1,000/yr** (insurance + domain + Stripe fees + optional Pty Ltd). Achievable on a small budget.

The bigger one-time Phase 2 cost (lawyer review of Terms ~$1,000–2,000) is still recommended before opening to the general public, but **not the same kind of must-have as it was for the original marketplace model** — directories can credibly launch with carefully-written self-drafted terms and a lawyer review later, once revenue justifies it.

---



---

## Status (verified-marketplace checkpoint — pre-pivot)

⚠️ Below describes the **current code** which is being pivoted away from. Treat as reference for what exists today; the **Pivot work plan** above is the forward direction.

What's working end-to-end right now in the pre-pivot code:

- **Landing page** — full v3 design ported, all sections (Hero with For-parents/For-tutors split, Pitch, Mechanic, How, Comparison, Trust, Guarantee, Earnings, FAQ, Final CTA, Footer + site-wide disclaimer block).
- **School-branded landing pages** at `/schools/[slug]` and an `Other Locations` route at `/schools/other`. Browse tabs switch between areas. Same layout, only the brand colour + content change per area.
- **Browse view** with filters (subject category chips: Math / English / Physics / Chemistry / Biology / Science K-10 — in that order; day-of-week availability chips with a "you might be limiting options" warning; min ATAR; max $/hr; mode) and sort (Oldest profiles first by default, Highest subject result alternative — bands map to marks: B6/E4 → 90, B5/E3 → 80, etc.). Reads **real approved tutor applications** from the JSON store (with `status=APPROVED` and `visibility=true`) and shows them as proper cards linking to `/tutors/[applicationId]`. The "X verified tutors live" counter sits under the filters. Sample tutors have been removed — browse is real-only.
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
- **Disclaimer layer** — visible at every decision point: a `BETA` tag in the TopNav, a permanent footer block ("we're an introduction service, not a tutoring provider; lesson locations are not chosen by us; liability is capped at the $20 unlock fee"), an explicit warning card on `/unlock/[tutorId]` right before the pay button, a 7-bullet acknowledgement list on tutor signup, and a "What we are and aren't" section on `/how-it-works`.
- **Tutor indemnity** — a properly drafted Section 13 of the Terms with 10 enumerated triggers (acts/omissions, lesson incidents, misrepresentation, IP claims, $20-discount failure, tax/super, child-safety law breaches, defamation, false statements). Mirror parent clause in Section 14 with full ACL carve-outs preserved. A required checkbox in signup form Section 9 ("I have read and accept the tutor indemnity clause") blocks submission until ticked. Submit button reads "Submit & accept indemnity — list me as a tutor". Server stamps `termsAcceptedVersion` + `termsAcceptedAt` on every application; the admin detail page surfaces this as evidence on file. Bumping `TERMS_VERSION` in `src/lib/legal.ts` re-records acceptance on the next edit.
- **Legal docs** — Terms (with the indemnity, version-stamped), Privacy (APP-aligned), Child Safety drafts at `/legal/*`. All still draft — lawyer review required before public launch.
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

After the **pure-directory pivot** (see top of README), the legal posture is dramatically simpler than the verified-marketplace model. The protections you still want exist mainly as cheap insurance against the residual operational risk of running any platform that connects strangers — not as essential prerequisites without which you can't launch.

#### Phase 1 — Soft launch in your personal network (~$30 outlay, safe to do this week)

Defensible for testing the directory model with people who know you. No insurance, no Pty Ltd, no lawyer review yet. The whole point is small-scale validation.

- [ ] **ABN** as sole trader (~15 min, free, https://abr.gov.au/)
- [ ] **Domain** (~$15-20/yr — `tutumatch.com.au` if you have an ABN, otherwise `.au` is fine)
- [ ] Set up `hello@tutumatch.com.au` and `appeals@tutumatch.com.au` routed to a real inbox you check daily (safety@ is less critical in the directory model — we're not making safety promises — but worth setting up still)
- [ ] **Only promote within your personal network** — friends, family, school alumni. Don't publicly advertise. The directory framing protects you legally, but Phase 1 caution is still about ensuring problems surface to people who'll talk to you directly rather than sue.
- [ ] Keep volume modest (under ~30 tutors, under ~50 matches)
- [ ] The codebase makes clear we don't verify anything — keep the "What TUTUMatch is and isn't" page (to be built in session 1) prominent

#### Phase 2 — Public launch (~$300-1,000 upfront, ~$500-1,000/yr ongoing)

The pure-directory model makes this **dramatically cheaper** than the original marketplace model required. Order of priority:

- [ ] **Media liability / classifieds insurance** — ~$300-600/yr. Quote from **BizCover** or **Insurance House**. Specify "online classifieds directory for tutoring services, no verification of advertisers". This covers the residual risks (someone sues you anyway, defending against frivolous claims, hosting-related claims). Much cheaper than the PI + PL combo needed for verified marketplaces.
- [ ] **Optional: Pty Ltd** — ~$700 setup, ~$300/yr ongoing. Less urgent for a directory than a marketplace because the exposure is bounded, but the liability shield is cheap insurance for the cost. Set up via **EasyCompanies** or **Lawpath**. **You can defer this until revenue justifies it** — many directory founders operate as sole traders for years without issue.
- [ ] **Lawyer review of Terms** — ~$500-1,000 one-time, less than the marketplace version because the terms are simpler (no consumer relationship with parents, narrower scope of platform service). Useful before public marketing but not blocking for friends-of-friends growth.
- [ ] **Business bank account** (sole trader → eventually a company if you upgrade)
- [ ] **GST registration** trigger reminder (mandatory once turnover ≥ $75k/yr; the directory model with $20 commissions means this kicks in at ~3,750 confirmed matches/yr — that's a real business at that point)
- [ ] **Written permission from each school** before activating their landing page in `/admin/schools` — save the evidence. The directory framing doesn't change school name/logo trademark and defamation exposure.
- [ ] **OAIC data-breach response plan** documented (lighter than the original — we collect less personal info per user in the directory model)

#### Why the directory model lowers the threshold

In the original verified-marketplace model, a child-harm incident triggered an expensive lawsuit that argued "you said you'd verify and you didn't" — that's the high-cost case ($50k-$200k defence, real risk of judgment). 

In the pure-directory model, the same incident still produces a lawsuit attempt, but the defence is structurally cleaner: "We're a classifieds platform. We made no representations about this tutor's safety. The parent had the same access to the tutor's information that anyone in NSW does — the parent had the responsibility to verify WWCC directly. The harm happened in a private arrangement the parent and tutor made without our involvement."

That defence wins most of the time, and even when it doesn't go to verdict the case settles cheaply. The realistic worst case in the directory model is **~$10k-30k in defence costs over 3-6 months** — well within what a $300-600 insurance policy covers.

**Bankruptcy-level outcomes that loomed in the marketplace model are unlikely under the directory model.** That's the actual reason this pivot matters: not just lower probability of getting sued, but bounded downside even if you are.

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

For the **production setup** (Stripe, Supabase, Resend, domain, Vercel), see **[SETUP.md](./SETUP.md)** — a step-by-step walkthrough of every external service signup, what to copy where, and what costs what.

## Adding a new school

Sign in as an admin (email in `ADMIN_EMAILS`) and go to **`/admin/schools`**. Fill the form: slug auto-generates from the name, three brand colours drive the theming via CSS variables, and the `active` toggle controls whether the school appears publicly. **Get written permission from the school first** before flipping `active` to true — using their name and colours without consent risks defamation and trademark issues.

Schools are stored in `data/schools.json` (will move to Postgres once Supabase is wired). The two seeded schools (Killara, Masada) live in `src/lib/schools.ts` as `SEED_SCHOOLS` — used to bootstrap the JSON store on first run.

## Routes

State legend: ✅ Done · 🚧 Stub · 📝 Draft · ♻ Refactor in pivot · ❌ Remove in pivot · ✨ New in pivot

| Path                                | What it is                                                                | State        |
|-------------------------------------|----------------------------------------------------------------------------|--------------|
| `/`                                 | Default landing page                                                       | ♻ Refactor — strip verification claims, reframe Earnings/Comparison/Hero |
| `/schools/[slug]`                   | School-branded browse (Killara / Masada / Other)                          | ♻ Refactor — remove "X verified" counter, reframe |
| `/browse`                           | All-tutors browse with filters                                            | ♻ Refactor — same |
| `/tutors/[id]`                      | Tutor profile page                                                        | ♻ Refactor — remove verification badges, refund explainer, contact-CTA framing |
| `/unlock/[tutorId]`                 | $20 confirm page                                                          | ❌ Remove — replaced by free `/contact/[tutorId]` reveal page |
| `/contact/[tutorId]`                | NEW: free intent capture + contact reveal + 48h hidden window trigger     | ✨ Build in session 2 |
| `/tutor/signup`                     | Tutor application form                                                    | ♻ Refactor — reframe WWCC as "have it ready", remove platform-verification language |
| `/dashboard`                        | Tutor hub                                                                 | ♻ Refactor — replace unlock stats with match stats, add self-report buttons, show pending matches |
| `/tutor/edit`                       | Edit tutor profile                                                        | ♻ Refactor — minor copy updates |
| `/messages`                         | Chat thread list                                                          | ❌ Remove — no platform-mediated chat in directory model |
| `/messages/[unlockId]`              | Chat thread                                                               | ❌ Remove — same |
| `/admin`                            | Admin: applications queue                                                 | ♻ Refactor — repurpose as spam/abuse moderation only, no credential check |
| `/admin/applications/[id]`          | Application detail                                                        | ♻ Refactor — same |
| `/admin/matches`                    | NEW: matches queue with pending self-reports, parent confirmations        | ✨ Build in session 3 |
| `/admin/appeals`                    | NEW: tutor appeals queue (when parent says no but tutor disputes)         | ✨ Build in session 3 |
| `/admin/strikes`                    | NEW: strike audit log + override controls                                 | ✨ Build in session 3 |
| `/login`                            | Email + password auth                                                     | ✅ Keep (minor copy tweaks) |
| `/legal/terms`                      | Terms of Service                                                          | ♻ Rewrite — narrower scope, directory framing, lighter indemnity |
| `/legal/privacy`                    | Privacy Policy                                                            | ♻ Update — less data collected per user under new model |
| `/legal/child-safety`               | Child Safety Policy                                                       | ♻ Reframe — "what we ask tutors to have" not "what we verify" |
| `/how-it-works`                     | Explainer                                                                 | ♻ Rewrite — new model end-to-end |
| `/contact`                          | Routed contact emails                                                     | ✅ Keep |
| `/what-we-are`                      | NEW: prominent "we don't verify anything" statement page                  | ✨ Build in session 1 |
| `POST /api/auth/{signup,login,logout,me}` | Cookie-based auth                                                  | ✅ Keep |
| `POST /api/tutor/applications`      | Submit application                                                        | ♻ Refactor — strip indemnity acceptance (different shape), remove document review |
| `PUT  /api/tutor/applications`      | Update application                                                        | ♻ Refactor — same |
| `PATCH /api/tutor/applications/visibility` | Toggle profile visibility                                          | ✅ Keep |
| `GET/PATCH /api/admin/applications` | List + approve/reject                                                     | ♻ Refactor — approve = spam-check only |
| `/admin/schools`                    | Schools CRUD                                                              | ✅ Keep |
| `/admin/refunds`                    | Refund queue                                                              | ❌ Remove — no parent refunds in new model |
| `/admin/reports`                    | Reports queue                                                             | ✅ Keep |
| `POST /api/reports`                 | Submit a report                                                           | ✅ Keep |
| `PATCH /api/admin/reports/[id]`     | Admin resolve / dismiss + optional suspend                                | ✅ Keep |
| `POST /api/uploads`                 | Upload a doc                                                              | ♻ Refactor — uploads become tutor-private (not for verification) |
| `GET  /api/uploads/[id]`            | Fetch a doc                                                               | ♻ Refactor — only owner can fetch (no admin verification view) |
| `GET/POST /api/admin/schools`       | List + create school                                                      | ✅ Keep |
| `PATCH/DELETE /api/admin/schools/[id]` | Update / delete school                                                 | ✅ Keep |
| `POST /api/admin/users/[id]/unsuspend` | Admin: clear suspension                                                | ♻ Refactor — applies to strike-suspended users not refund-suspended |
| `POST /api/unlocks/dev-create`      | Dev-only: create a PAID Unlock                                            | ❌ Remove — no Unlock entity in new model |
| `POST /api/unlocks/[id]/fast-forward` | Dev-only fast-forward                                                   | ❌ Remove — same |
| `GET /api/threads`                  | Chat threads                                                              | ❌ Remove — no chat |
| `GET/POST /api/threads/[unlockId]/messages` | Chat messages                                                     | ❌ Remove — no chat |
| `POST /api/matches/request`         | NEW: parent expresses interest, triggers 48h tutor-hidden window          | ✨ Build in session 2 |
| `POST /api/matches/[id]/self-report` | NEW: tutor self-reports match (charges $15)                              | ✨ Build in session 3 |
| `POST /api/matches/[id]/parent-confirm` | NEW: parent confirms via email link                                  | ✨ Build in session 3 |
| `POST /api/matches/[id]/appeal`     | NEW: tutor disputes a "no" with evidence upload                          | ✨ Build in session 3 |
| `POST /api/stripe/webhook`          | Stripe webhook                                                            | 🚧 Stub — to be wired in session 3 |
| `GET  /api/cron/match-checkin`      | NEW: cron to send parent confirmation prompts at 2 days / 7 / 14 / 30    | ✨ Build in session 3 |
| `POST /api/unlock`                  | Original parent-pays unlock                                               | ❌ Remove |
| `POST /api/refund`                  | Original refund flow                                                      | ❌ Remove |
| `GET  /api/cron/refund-flag`        | Original 5-day refund flagger                                             | ❌ Remove |

## Tech

Next.js 14 (App Router) · TypeScript · Tailwind · CSS-variable theming · Prisma + Postgres (schema written) · `scrypt`-hashed passwords + HMAC cookie sessions · Stripe (planned) · Resend (planned) · Supabase Storage (planned).

---

## Design reference

`design-reference/` contains the original v3 HTML + JSX + screenshots that this codebase ports from. Useful for visual diffing if you tweak the landing layout.

## Contact

`hello@tutumatch.com.au` — change to whichever inbox the founder uses. Reflected in `src/components/landing/Footer.tsx` and the legal stubs.
