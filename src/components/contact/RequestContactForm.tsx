"use client";

import { useState } from "react";

type TutorContact = {
  firstName: string;
  fullName: string;
  phone: string;
  email: string;
};

export function RequestContactForm({
  tutorApplicationId,
  tutorFirstName,
}: {
  tutorApplicationId: string;
  tutorFirstName: string;
}) {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [revealed, setRevealed] = useState<TutorContact | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    try {
      const res = await fetch("/api/matches/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tutorApplicationId, parentEmail: email.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        const fieldErr =
          data?.details?.fieldErrors &&
          Object.values(data.details.fieldErrors as Record<string, string[]>).flat()[0];
        setErr(fieldErr ?? "Something went wrong — please try again.");
        return;
      }
      setRevealed(data.tutor as TutorContact);
    } catch {
      setErr("Couldn't reach the server — please try again.");
    } finally {
      setBusy(false);
    }
  }

  if (revealed) {
    return (
      <section className="success-banner" aria-live="polite">
        <h2 style={{ marginTop: 0 }}>Here&apos;s how to reach {revealed.firstName}</h2>
        <ul className="content-link-list">
          <li><strong>Name:</strong> {revealed.fullName}</li>
          <li>
            <strong>Phone:</strong> <a href={`tel:${revealed.phone}`}>{revealed.phone}</a>
          </li>
          <li>
            <strong>Email:</strong> <a href={`mailto:${revealed.email}`}>{revealed.email}</a>
          </li>
        </ul>
        <p>
          Reach out directly to arrange your lesson. Before the first lesson, verify {revealed.firstName}&apos;s
          Working With Children Check yourself with the NSW Office of the Children&apos;s Guardian — it&apos;s free
          and takes about 30 seconds.
        </p>
      </section>
    );
  }

  return (
    <form onSubmit={submit} className="contact-request-form">
      <label className="field">
        <span>Your email</span>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
        />
        <small className="hint">
          So {tutorFirstName} knows who enquired. TUTUMatch never charges parents.
        </small>
      </label>
      {err && <div className="auth-error">{err}</div>}
      <div className="form-submit-row">
        <button type="submit" className="btn brand lg" disabled={busy || !email.trim()}>
          {busy ? "Connecting…" : `I want this tutor — see contact details`}
        </button>
      </div>
    </form>
  );
}
