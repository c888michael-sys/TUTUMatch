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

type Result = { subject: string; bandOrMark: string };
type Slot = { startMinutes: number; endMinutes: number };

const EMPTY_DAYS: Record<Weekday, Slot[]> = {
  MON: [], TUE: [], WED: [], THU: [], FRI: [], SAT: [], SUN: [],
};

const TIME_OPTS = generateTimeOptions();

export function SignupForm() {
  const router = useRouter();

  // Personal
  const [firstName, setFirstName] = useState("");
  const [lastInitial, setLastInitial] = useState("");
  const [fullLastName, setFullLastName] = useState("");
  const [publicBio, setPublicBio] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");

  // Contact
  const [contactEmail, setContactEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [socials, setSocials] = useState("");

  // Identity
  const [dateOfBirth, setDateOfBirth] = useState("");

  // School attended
  const [schoolId, setSchoolId] = useState("");
  const [otherSchoolName, setOtherSchoolName] = useState("");

  // Tutoring area (drives the browse-view tabs)
  const [tutoringAreaSchoolId, setTutoringAreaSchoolId] = useState("");
  const [tutoringAreaOther, setTutoringAreaOther] = useState("");

  // Academic
  const [atar, setAtar] = useState<number | "">("");
  const [hscResults, setHscResults] = useState<Result[]>([{ subject: "", bandOrMark: "" }]);
  const [offeredSubjects, setOfferedSubjects] = useState<string[]>([]);
  const [yearLevels, setYearLevels] = useState<number[]>([]);

  // Pricing + location
  const [hourlyRate, setHourlyRate] = useState<number | "">("");
  const [suburb, setSuburb] = useState("");
  const [postcode, setPostcode] = useState("");
  const [mode, setMode] = useState<"IN_PERSON" | "ONLINE" | "EITHER">("EITHER");

  // Availability
  const [availability, setAvailability] = useState<Record<Weekday, Slot[]>>(EMPTY_DAYS);

  // Verification
  const [wwccNumber, setWwccNumber] = useState("");
  const [wwccFullName, setWwccFullName] = useState("");
  const [idDocumentNote, setIdDocumentNote] = useState("");
  const [hscDocumentNote, setHscDocumentNote] = useState("");

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
    setHscResults((rs) => (rs.length === 1 ? rs : rs.filter((_, j) => j !== i)));
    setOfferedSubjects((os) => os.filter((s) => s !== hscResults[i]?.subject));
  }

  function toggleOffered(s: string) {
    setOfferedSubjects((os) => (os.includes(s) ? os.filter((x) => x !== s) : [...os, s]));
  }
  function toggleYear(y: number) {
    setYearLevels((ys) => (ys.includes(y) ? ys.filter((x) => x !== y) : [...ys, y]));
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
      yearLevels,
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
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.error === "unauthenticated") {
          router.replace("/login?next=/tutor/signup");
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
        setTopError("Submission failed — please try again.");
        return;
      }
      router.replace("/dashboard?submitted=1");
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
        <Field label="Date of birth" error={errors.dateOfBirth} hint="Must be 18 or older.">
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

      <Section title="4 · What you teach" sub="Subjects offered must be a subset of subjects you sat.">
        <div className="full-row">
          <div className="repeat-head">
            <span>Subjects offered ({offeredSubjects.length})</span>
          </div>
          {subjectsTaken.length === 0 ? (
            <div className="hint-block">Add HSC results first — then you can pick subjects to teach.</div>
          ) : (
            <div className="chips">
              {subjectsTaken.map((s) => (
                <button
                  key={s}
                  type="button"
                  className={`chip ${offeredSubjects.includes(s) ? "active" : ""}`}
                  onClick={() => toggleOffered(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          )}
          {errors.offeredSubjects && <div className="field-error">{errors.offeredSubjects}</div>}
        </div>
        <div className="full-row">
          <div className="repeat-head">
            <span>Year levels</span>
          </div>
          <div className="chips">
            {YEAR_LEVELS.map((y) => (
              <button
                key={y}
                type="button"
                className={`chip ${yearLevels.includes(y) ? "active" : ""}`}
                onClick={() => toggleYear(y)}
              >
                Year {y}
              </button>
            ))}
          </div>
          {errors.yearLevels && <div className="field-error">{errors.yearLevels}</div>}
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
            <option value={OTHER_AREA_SCHOOL.id}>Other location (somewhere else in NSW)</option>
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
      </Section>

      <Section title="6 · Pricing & lesson mode">
        <Field label="Hourly rate (AUD)" error={errors.hourlyRateCents} hint="$20–$200/hr">
          <input
            type="number"
            min={20}
            max={200}
            step={5}
            value={hourlyRate}
            onChange={(e) => setHourlyRate(e.target.value === "" ? "" : parseFloat(e.target.value))}
            required
          />
        </Field>
        <Field label="Mode" error={errors.mode}>
          <select value={mode} onChange={(e) => setMode(e.target.value as typeof mode)}>
            <option value="EITHER">In-person or online</option>
            <option value="IN_PERSON">In-person only</option>
            <option value="ONLINE">Online only</option>
          </select>
        </Field>
        <Field
          label="Suburb (optional)"
          error={errors.suburb}
          hint="If you want to be more specific than the area above."
        >
          <input value={suburb} onChange={(e) => setSuburb(e.target.value)} maxLength={80} />
        </Field>
        <Field label="Postcode (optional)" error={errors.postcode}>
          <input value={postcode} onChange={(e) => setPostcode(e.target.value)} maxLength={4} />
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
          {busy ? "Submitting…" : "Submit for review"}
        </button>
        <p className="form-disclaimer">
          By submitting, you agree to TutMatch&apos;s Terms of Service and Child Safety Policy. Your profile won&apos;t
          be public until an admin reviews your ID, WWCC, and HSC documents.
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
