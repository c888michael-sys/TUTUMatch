"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { HSC_SUBJECTS } from "@/lib/hsc-subjects";
import { SCHOOLS, OTHER_AREA_SCHOOL } from "@/lib/schools";
import {
  OTHER_SCHOOL_SENTINEL,
  WEEKDAYS,
  YEAR_LEVELS,
  generateTimeOptions,
  minutesToLabel,
  scanForContactInfo,
  type Weekday,
} from "@/lib/tutor-form";
import type { TutorApplication } from "@/lib/db";

type Result = { subject: string; bandOrMark: string };
type Slot = { startMinutes: number; endMinutes: number };
type FormMode = "create" | "edit";

const EMPTY_DAYS: Record<Weekday, Slot[]> = {
  MON: [], TUE: [], WED: [], THU: [], FRI: [], SAT: [], SUN: [],
};

const TIME_OPTS = generateTimeOptions();

export function SignupForm({
  mode: formMode = "create",
  initial,
}: {
  mode?: FormMode;
  initial?: TutorApplication;
}) {
  const router = useRouter();
  const isEdit = formMode === "edit";

  // Personal
  const [firstName, setFirstName] = useState(initial?.firstName ?? "");
  const [lastInitial, setLastInitial] = useState(initial?.lastInitial ?? "");
  const [fullLastName, setFullLastName] = useState(initial?.fullLastName ?? "");
  const [publicBio, setPublicBio] = useState(initial?.publicBio ?? "");
  const [photoUrl, setPhotoUrl] = useState(initial?.photoUrl ?? "");

  // Contact
  const [contactEmail, setContactEmail] = useState(initial?.contactEmail ?? "");
  const [phone, setPhone] = useState(initial?.phone ?? "");
  const [socials, setSocials] = useState(initial?.socials ?? "");

  // Identity
  const [dateOfBirth, setDateOfBirth] = useState(initial?.dateOfBirth ?? "");

  // School attended — if otherSchoolName is set without schoolId, the form
  // representation uses the OTHER_SCHOOL_SENTINEL value in the select.
  const initialSchoolId =
    initial?.schoolId ?? (initial?.otherSchoolName ? OTHER_SCHOOL_SENTINEL : "");
  const [schoolId, setSchoolId] = useState(initialSchoolId);
  const [otherSchoolName, setOtherSchoolName] = useState(initial?.otherSchoolName ?? "");

  // Tutoring area (drives the browse-view tabs)
  const [tutoringAreaSchoolId, setTutoringAreaSchoolId] = useState(initial?.tutoringAreaSchoolId ?? "");
  const [tutoringAreaOther, setTutoringAreaOther] = useState(initial?.tutoringAreaOther ?? "");

  // Academic
  const [atar, setAtar] = useState<number | "">(initial?.atar ?? "");
  const [hscResults, setHscResults] = useState<Result[]>(
    initial && initial.hscResults.length > 0 ? initial.hscResults : [{ subject: "", bandOrMark: "" }]
  );
  // Per-subject year selection.
  const initialOffers: Record<string, number[]> = (initial?.offeredSubjects ?? []).reduce(
    (acc, o) => {
      acc[o.subject] = o.yearLevels;
      return acc;
    },
    {} as Record<string, number[]>
  );
  const [offers, setOffers] = useState<Record<string, number[]>>(initialOffers);

  // Pricing + location
  const [hourlyRate, setHourlyRate] = useState<number | "">(
    initial ? Math.round(initial.hourlyRateCents / 100) : ""
  );
  const [suburb, setSuburb] = useState(initial?.suburb ?? "");
  const [postcode, setPostcode] = useState(initial?.postcode ?? "");
  const [mode, setMode] = useState<"IN_PERSON" | "ONLINE" | "EITHER">(initial?.mode ?? "EITHER");

  // Availability
  const [availability, setAvailability] = useState<Record<Weekday, Slot[]>>({
    ...EMPTY_DAYS,
    ...(initial?.availability ?? {}),
  });

  // Verification
  const [wwccNumber, setWwccNumber] = useState(initial?.wwccNumber ?? "");
  const [wwccFullName, setWwccFullName] = useState(initial?.wwccFullName ?? "");
  const [idDocumentNote, setIdDocumentNote] = useState(initial?.idDocumentNote ?? "");
  const [hscDocumentNote, setHscDocumentNote] = useState(initial?.hscDocumentNote ?? "");

  // UX
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [topError, setTopError] = useState<string | null>(null);

  const subjectsTaken = useMemo(
    () => hscResults.map((r) => r.subject).filter(Boolean),
    [hscResults]
  );

  const bioFlags = useMemo(() => (publicBio.trim() ? scanForContactInfo(publicBio) : []), [publicBio]);

  function setHsc(i: number, patch: Partial<Result>) {
    setHscResults((rs) => rs.map((r, j) => (j === i ? { ...r, ...patch } : r)));
  }
  function addHsc() {
    setHscResults((rs) => [...rs, { subject: "", bandOrMark: "" }]);
  }
  function removeHsc(i: number) {
    const removedSubject = hscResults[i]?.subject;
    setHscResults((rs) => (rs.length === 1 ? rs : rs.filter((_, j) => j !== i)));
    if (removedSubject) {
      setOffers((o) => {
        if (!(removedSubject in o)) return o;
        const next = { ...o };
        delete next[removedSubject];
        return next;
      });
    }
  }

  function toggleOffered(subject: string) {
    setOffers((o) => {
      if (subject in o) {
        const next = { ...o };
        delete next[subject];
        return next;
      }
      // Default new offers to all years — most tutors take all year levels and
      // can untick the ones they don't want.
      return { ...o, [subject]: [...YEAR_LEVELS] };
    });
  }

  function toggleYearFor(subject: string, year: number) {
    setOffers((o) => {
      if (!(subject in o)) return o;
      const cur = o[subject];
      const next = cur.includes(year) ? cur.filter((y) => y !== year) : [...cur, year];
      return { ...o, [subject]: next };
    });
  }

  function setAllYearsFor(subject: string, all: boolean) {
    setOffers((o) => {
      if (!(subject in o)) return o;
      return { ...o, [subject]: all ? [...YEAR_LEVELS] : [] };
    });
  }

  function addSlot(day: Weekday) {
    setAvailability((a) => ({
      ...a,
      [day]: [...a[day], { startMinutes: 16 * 60, endMinutes: 17 * 60 }],
    }));
  }
  function removeSlot(day: Weekday, idx: number) {
    setAvailability((a) => ({ ...a, [day]: a[day].filter((_, i) => i !== idx) }));
  }
  function setSlot(day: Weekday, idx: number, patch: Partial<Slot>) {
    setAvailability((a) => ({
      ...a,
      [day]: a[day].map((s, i) => (i === idx ? { ...s, ...patch } : s)),
    }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErrors({});
    setTopError(null);

    const cleanedHsc = hscResults.filter((r) => r.subject && r.bandOrMark);
    const offeredSubjects = Object.entries(offers).map(([subject, yearLevels]) => ({
      subject,
      yearLevels,
    }));

    // If user picked the "Other school" sentinel for high-school-attended,
    // store the school as undefined and rely on otherSchoolName instead.
    const submittedSchoolId =
      schoolId === OTHER_SCHOOL_SENTINEL ? undefined : (schoolId || undefined);
    const submittedOtherSchool =
      schoolId === OTHER_SCHOOL_SENTINEL ? otherSchoolName.trim() || undefined : undefined;

    const body = {
      firstName: firstName.trim(),
      lastInitial: lastInitial.trim(),
      fullLastName: fullLastName.trim(),
      publicBio: publicBio.trim(),
      photoUrl: photoUrl.trim() || undefined,
      contactEmail: contactEmail.trim(),
      phone: phone.trim(),
      socials: socials.trim() || undefined,
      dateOfBirth,
      schoolId: submittedSchoolId,
      otherSchoolName: submittedOtherSchool,
      tutoringAreaSchoolId,
      tutoringAreaOther:
        tutoringAreaSchoolId === OTHER_AREA_SCHOOL.id ? tutoringAreaOther.trim() || undefined : undefined,
      atar: typeof atar === "number" ? atar : undefined,
      hscResults: cleanedHsc,
      offeredSubjects,
      hourlyRateCents: typeof hourlyRate === "number" ? Math.round(hourlyRate * 100) : undefined,
      suburb: suburb.trim() || undefined,
      postcode: postcode.trim() || undefined,
      mode,
      availability,
      wwccNumber: wwccNumber.trim(),
      wwccFullName: wwccFullName.trim(),
      wwccDob: dateOfBirth, // form enforces equality
      idDocumentNote: idDocumentNote.trim() || undefined,
      hscDocumentNote: hscDocumentNote.trim() || undefined,
    };

    try {
      const res = await fetch("/api/tutor/applications", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.error === "unauthenticated") {
          router.replace(`/login?next=${isEdit ? "/tutor/edit" : "/tutor/signup"}`);
          return;
        }
        if (data.error === "validation" && data.fieldErrors) {
          const flat: Record<string, string> = {};
          for (const [k, v] of Object.entries(data.fieldErrors as Record<string, string[]>)) {
            if (v && v.length) flat[k] = v[0];
          }
          setErrors(flat);
          setTopError("Check the highlighted fields and try again.");
          return;
        }
        if (data.error === "already_submitted") {
          setTopError("You've already submitted an application. Check your dashboard for status.");
          return;
        }
        if (data.error === "not_found") {
          setTopError("Couldn't find your application to update. Go back to the dashboard.");
          return;
        }
        setTopError("Submission failed — please try again.");
        return;
      }
      if (data.autoRejected) {
        router.replace("/dashboard?rejected=auto");
      } else {
        router.replace(isEdit ? "/dashboard?updated=1" : "/dashboard?submitted=1");
      }
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="tform" onSubmit={onSubmit} noValidate>
      <Section title="1 · Your details" sub="Only the first name + last initial appear publicly until a parent unlocks you.">
        <Field label="First name" error={errors.firstName}>
          <input value={firstName} onChange={(e) => setFirstName(e.target.value)} required maxLength={50} />
        </Field>
        <Field label="Last initial (one letter)" error={errors.lastInitial}>
          <input
            value={lastInitial}
            onChange={(e) => setLastInitial(e.target.value.toUpperCase().slice(0, 1))}
            required
            maxLength={1}
          />
        </Field>
        <Field label="Full last name (private)" error={errors.fullLastName} hint="Not shown publicly. Used for verification only.">
          <input value={fullLastName} onChange={(e) => setFullLastName(e.target.value)} required maxLength={80} />
        </Field>
        <Field
          label="Date of birth"
          error={errors.dateOfBirth}
          hint="Tutors must be 18 or older. Applications from under-18s are automatically rejected on submission."
        >
          <input type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} required />
        </Field>
        <Field label="Profile photo URL (optional)" error={errors.photoUrl} hint="Paste a URL for now — file upload comes later.">
          <input type="url" value={photoUrl} onChange={(e) => setPhotoUrl(e.target.value)} placeholder="https://…" />
        </Field>
        <Field
          label="Public bio"
          error={errors.publicBio}
          hint={
            bioFlags.length
              ? `⚠ Contact info detected (${bioFlags.join(", ")}). Remove before submitting — your bio will be rejected if any of phone numbers, emails, or social handles are detected.`
              : "20–800 characters. Don't include phone numbers, emails, or social handles — they're auto-blocked."
          }
          full
        >
          <textarea value={publicBio} onChange={(e) => setPublicBio(e.target.value)} rows={5} maxLength={800} required />
          <small className="counter">{publicBio.length}/800</small>
        </Field>
      </Section>

      <Section title="2 · Contact (private)" sub="Revealed only to parents who pay the $20 unlock fee.">
        <Field label="Email" error={errors.contactEmail}>
          <input type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} required />
        </Field>
        <Field label="Phone" error={errors.phone}>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+61 4xx xxx xxx" required />
        </Field>
        <Field label="Socials (optional)" error={errors.socials} full>
          <input value={socials} onChange={(e) => setSocials(e.target.value)} placeholder="@you on Instagram, etc." />
        </Field>
      </Section>

      <Section title="3 · High school & academic record" sub="Subjects you can teach are limited to subjects you sat.">
        <Field label="High school attended" error={errors.schoolId}>
          <select value={schoolId} onChange={(e) => setSchoolId(e.target.value)} required>
            <option value="">— select —</option>
            {SCHOOLS.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
            <option value={OTHER_SCHOOL_SENTINEL}>Other school…</option>
          </select>
        </Field>
        {schoolId === OTHER_SCHOOL_SENTINEL && (
          <Field
            label="Other school name"
            error={errors.otherSchoolName}
            hint="Type the school's full name."
          >
            <input
              value={otherSchoolName}
              onChange={(e) => setOtherSchoolName(e.target.value)}
              maxLength={120}
              required
              autoFocus
            />
          </Field>
        )}
        <Field label="ATAR" error={errors.atar} hint="0.00 to 99.95">
          <input
            type="number"
            min={0}
            max={99.95}
            step={0.05}
            value={atar}
            onChange={(e) => setAtar(e.target.value === "" ? "" : parseFloat(e.target.value))}
            required
          />
        </Field>
        <div className="full-row">
          <div className="repeat-head">
            <span>HSC subject results</span>
            <button type="button" className="btn ghost sm" onClick={addHsc}>+ Add row</button>
          </div>
          <div className="repeat-list">
            {hscResults.map((r, i) => (
              <div key={i} className="repeat-row">
                <select value={r.subject} onChange={(e) => setHsc(i, { subject: e.target.value })} required>
                  <option value="">— subject —</option>
                  {HSC_SUBJECTS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <input
                  placeholder="Band 6 / E4 / 94"
                  value={r.bandOrMark}
                  onChange={(e) => setHsc(i, { bandOrMark: e.target.value })}
                  required
                />
                <button type="button" className="btn ghost sm" onClick={() => removeHsc(i)} aria-label="Remove">
                  ✕
                </button>
              </div>
            ))}
          </div>
          {errors.hscResults && <div className="field-error">{errors.hscResults}</div>}
        </div>
      </Section>

      <Section
        title="4 · What you teach"
        sub="Tick each subject you'll tutor. For each one, pick the year levels you're confident teaching it to. 'All years' selects 7–12."
      >
        <div className="full-row">
          {subjectsTaken.length === 0 ? (
            <div className="hint-block">Add HSC results first — then you can pick subjects to teach.</div>
          ) : (
            <div className="offer-list">
              {subjectsTaken.map((subject) => {
                const isOffered = subject in offers;
                const years = offers[subject] ?? [];
                const isAll = years.length === YEAR_LEVELS.length;
                return (
                  <div key={subject} className={`offer-row ${isOffered ? "active" : ""}`}>
                    <label className="offer-row-head">
                      <input
                        type="checkbox"
                        checked={isOffered}
                        onChange={() => toggleOffered(subject)}
                      />
                      <span className="offer-subject">{subject}</span>
                    </label>
                    {isOffered && (
                      <div className="offer-years">
                        <span className="offer-years-label">Year levels:</span>
                        <div className="offer-year-chips">
                          {YEAR_LEVELS.map((y) => (
                            <button
                              key={y}
                              type="button"
                              className={`chip ${years.includes(y) ? "active" : ""}`}
                              onClick={() => toggleYearFor(subject, y)}
                            >
                              Year {y}
                            </button>
                          ))}
                        </div>
                        <label className="offer-all">
                          <input
                            type="checkbox"
                            checked={isAll}
                            onChange={(e) => setAllYearsFor(subject, e.target.checked)}
                          />
                          <span>All years</span>
                        </label>
                        {years.length === 0 && (
                          <div className="field-error">Pick at least one year for this subject.</div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
          {errors.offeredSubjects && <div className="field-error">{errors.offeredSubjects}</div>}
        </div>
      </Section>

      <Section
        title="5 · Where you'd tutor"
        sub="This is the area you're happy to tutor in — not necessarily where you live. If you don't mind travelling further, pick the school area that suits you."
      >
        <Field
          label="Area"
          error={errors.tutoringAreaSchoolId}
          full
          hint="Students browsing a school's page will see tutors who picked that area. 'Other' goes into the Other Locations tab."
        >
          <select
            value={tutoringAreaSchoolId}
            onChange={(e) => setTutoringAreaSchoolId(e.target.value)}
            required
          >
            <option value="">— select —</option>
            {SCHOOLS.map((s) => (
              <option key={s.id} value={s.id}>Near {s.name}</option>
            ))}
            <option value={OTHER_AREA_SCHOOL.id}>Other location (somewhere else in Sydney)</option>
          </select>
        </Field>
        {tutoringAreaSchoolId === OTHER_AREA_SCHOOL.id && (
          <Field
            label="Suburb / area you'd tutor in"
            error={errors.tutoringAreaOther}
            hint="A suburb or general area is enough. We don't need a street address."
            full
          >
            <input
              value={tutoringAreaOther}
              onChange={(e) => setTutoringAreaOther(e.target.value)}
              maxLength={120}
              required
              autoFocus
              placeholder="e.g. Inner West, Parramatta, Bondi"
            />
          </Field>
        )}

        <div className="safety-callout full-row">
          <div className="safety-callout-head">⚠ Where you actually meet matters</div>
          <p>
            Once a parent unlocks you, agree on a specific meeting place before the first lesson.{" "}
            <strong>Public libraries are strongly recommended</strong> — safe, quiet, well-lit and free. Other
            sensible options: school libraries, council community centres, or the student&apos;s home with a parent
            present.
          </p>
          <p>
            TUTUMatch verifies tutor identity, WWCC, and HSC results, but{" "}
            <strong>we do not choose lesson locations</strong> and are not responsible for what happens at any
            individual lesson. Choosing a safe meeting place is your responsibility. Pick somewhere public.
          </p>
        </div>
      </Section>

      <Section title="6 · Pricing & lesson mode">
        <Field label="Hourly rate" error={errors.hourlyRateCents} hint="Whole dollars, between $20 and $200.">
          <div className="rate-input">
            <span className="rate-prefix" aria-hidden="true">$</span>
            <input
              type="number"
              inputMode="numeric"
              min={20}
              max={200}
              value={hourlyRate}
              onChange={(e) => setHourlyRate(e.target.value === "" ? "" : parseFloat(e.target.value))}
              placeholder="60"
              required
            />
            <span className="rate-suffix" aria-hidden="true">/hr</span>
          </div>
        </Field>
        <div className={`field ${errors.mode ? "has-error" : ""}`}>
          <span className="field-label">Lesson mode</span>
          <div className="chips" role="radiogroup" aria-label="Lesson mode">
            {([
              { v: "EITHER", l: "In-person or online" },
              { v: "IN_PERSON", l: "In-person only" },
              { v: "ONLINE", l: "Online only" },
            ] as const).map((opt) => (
              <button
                key={opt.v}
                type="button"
                role="radio"
                aria-checked={mode === opt.v}
                className={`chip ${mode === opt.v ? "active" : ""}`}
                onClick={() => setMode(opt.v)}
              >
                {opt.l}
              </button>
            ))}
          </div>
          {errors.mode && <small className="field-error">{errors.mode}</small>}
        </div>
        <Field
          label="Suburb (optional)"
          error={errors.suburb}
          hint="More specific than your tutoring area — leave blank if not."
        >
          <input value={suburb} onChange={(e) => setSuburb(e.target.value)} maxLength={80} placeholder="Killara" />
        </Field>
        <Field label="Postcode (optional)" error={errors.postcode}>
          <input
            value={postcode}
            onChange={(e) => setPostcode(e.target.value.replace(/\D/g, "").slice(0, 4))}
            maxLength={4}
            inputMode="numeric"
            placeholder="2071"
          />
        </Field>
      </Section>

      <Section title="7 · Availability" sub="When are you free? Add multiple slots per day if needed (e.g. Mon 9–11am AND 4–6pm).">
        <div className="full-row">
          {WEEKDAYS.map((day) => (
            <div key={day} className="avail-day">
              <div className="avail-day-head">
                <strong>{day}</strong>
                <button type="button" className="btn ghost sm" onClick={() => addSlot(day)}>
                  + Add time slot
                </button>
              </div>
              {availability[day].length === 0 ? (
                <div className="hint-block tight">Not available</div>
              ) : (
                <div className="avail-slots">
                  {availability[day].map((slot, i) => (
                    <div key={i} className="avail-slot">
                      <select
                        value={slot.startMinutes}
                        onChange={(e) => setSlot(day, i, { startMinutes: parseInt(e.target.value, 10) })}
                      >
                        {TIME_OPTS.filter((t) => t.value < 60 * 24).map((t) => (
                          <option key={t.value} value={t.value}>{t.label}</option>
                        ))}
                      </select>
                      <span className="dash">to</span>
                      <select
                        value={slot.endMinutes}
                        onChange={(e) => setSlot(day, i, { endMinutes: parseInt(e.target.value, 10) })}
                      >
                        {TIME_OPTS.filter((t) => t.value > slot.startMinutes).map((t) => (
                          <option key={t.value} value={t.value}>{t.label}</option>
                        ))}
                      </select>
                      <span className="slot-summary">
                        {minutesToLabel(slot.startMinutes)}–{minutesToLabel(slot.endMinutes)}
                      </span>
                      <button type="button" className="btn ghost sm" onClick={() => removeSlot(day, i)} aria-label="Remove">
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
          {errors.availability && <div className="field-error">{errors.availability}</div>}
        </div>
      </Section>

      <Section title="8 · Verification" sub="Required by NSW law for anyone working with children. Manual review takes ~48 hours.">
        <Field label="WWCC number" error={errors.wwccNumber} hint="The number from your Working With Children Check.">
          <input value={wwccNumber} onChange={(e) => setWwccNumber(e.target.value)} required />
        </Field>
        <Field label="Full name on the WWCC" error={errors.wwccFullName}>
          <input value={wwccFullName} onChange={(e) => setWwccFullName(e.target.value)} required />
        </Field>
        <Field label="Government ID — note" error={errors.idDocumentNote} hint="Until file uploads ship, write where admin can request the scan (e.g. 'email on request')." full>
          <input value={idDocumentNote} onChange={(e) => setIdDocumentNote(e.target.value)} placeholder="email on request" />
        </Field>
        <Field label="HSC Record of Achievement — note" error={errors.hscDocumentNote} hint="Same — write how admin can get the scan." full>
          <input value={hscDocumentNote} onChange={(e) => setHscDocumentNote(e.target.value)} placeholder="email on request" />
        </Field>
      </Section>

      {topError && <div className="form-toperror">{topError}</div>}

      <div className="form-submit-row">
        <button className="btn brand lg" type="submit" disabled={busy}>
          {busy
            ? (isEdit ? "Saving…" : "Submitting…")
            : (isEdit ? "Save changes (re-submits for review)" : "Submit for review")}
        </button>
        <p className="form-disclaimer">
          {isEdit ? (
            <>
              Any change to a tutor profile drops the listing back to <strong>Pending review</strong> until an admin
              re-approves it. This is intentional — child-safety information needs a fresh look on every change.
            </>
          ) : (
            <>
              By submitting, you agree to TUTUMatch&apos;s Terms of Service and Child Safety Policy. Your profile
              won&apos;t be public until an admin reviews your ID, WWCC, and HSC documents.
            </>
          )}
        </p>
      </div>
    </form>
  );
}

function Section({
  title,
  sub,
  children,
}: {
  title: string;
  sub?: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="tform-section">
      <legend>
        <span className="section-title">{title}</span>
        {sub && <span className="section-sub">{sub}</span>}
      </legend>
      <div className="tform-grid">{children}</div>
    </fieldset>
  );
}

function Field({
  label,
  error,
  hint,
  full,
  children,
}: {
  label: string;
  error?: string;
  hint?: string;
  full?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className={`field ${full ? "full-row" : ""} ${error ? "has-error" : ""}`}>
      <span className="field-label">{label}</span>
      {children}
      {hint && !error && <small className="hint">{hint}</small>}
      {error && <small className="field-error">{error}</small>}
    </label>
  );
}
