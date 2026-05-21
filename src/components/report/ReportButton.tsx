"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const REASONS: { value: string; label: string }[] = [
  { value: "contact_info_bypass", label: "Off-platform contact to dodge the match commission" },
  { value: "harassment", label: "Harassment or abusive language" },
  { value: "inappropriate_content", label: "Inappropriate or offensive content" },
  { value: "safety_concern", label: "Child-safety concern" },
  { value: "qualifications_misrepresented", label: "Misrepresenting qualifications / ATAR" },
  { value: "no_show", label: "Tutor didn't show up to a booked lesson" },
  { value: "spam", label: "Spam or scam" },
  { value: "other", label: "Something else" },
];

export function ReportButton({
  subjectKind,
  subjectId,
  subjectLabel,
  variant = "default",
}: {
  subjectKind: "USER" | "APPLICATION";
  subjectId: string;
  subjectLabel: string; // e.g. "Lachlan H."
  variant?: "default" | "inline";
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState<string>("");
  const [description, setDescription] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  function close() {
    setOpen(false);
    setReason("");
    setDescription("");
    setErr(null);
    setSubmitted(false);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subjectKind,
          subjectId,
          reason,
          description: description.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.error === "unauthenticated") {
          router.replace("/login");
          return;
        }
        const first =
          data?.details?.fieldErrors &&
          Object.values(data.details.fieldErrors as Record<string, string[]>).flat()[0];
        setErr(first ?? "Couldn't submit — try again.");
        return;
      }
      setSubmitted(true);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <button
        type="button"
        className={variant === "inline" ? "link-like report-link" : "btn ghost sm"}
        onClick={() => setOpen(true)}
      >
        ⚠ Report {subjectLabel}
      </button>

      {open && (
        <div
          className="report-overlay"
          role="dialog"
          aria-modal="true"
          aria-label={`Report ${subjectLabel}`}
          onClick={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <div className="report-dialog">
            <button type="button" className="report-close" aria-label="Close" onClick={close}>
              ✕
            </button>
            {submitted ? (
              <div className="report-success">
                <h2>Report received</h2>
                <p>
                  Thanks for flagging this. An admin will review it within ~24 hours. If this is an urgent
                  child-safety issue, also email{" "}
                  <a href="mailto:safety@tutumatch.com.au" className="mono-link">safety@tutumatch.com.au</a>
                  {" "}or contact the police directly.
                </p>
                <div className="form-submit-row">
                  <button type="button" className="btn brand" onClick={close}>
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={submit} className="report-form">
                <h2>Report {subjectLabel}</h2>
                <p className="report-sub">
                  Reports are reviewed by a human admin. False reports may get your account suspended.
                </p>

                <label className="field">
                  <span>What happened?</span>
                  <select value={reason} onChange={(e) => setReason(e.target.value)} required>
                    <option value="">— pick a reason —</option>
                    {REASONS.map((r) => (
                      <option key={r.value} value={r.value}>{r.label}</option>
                    ))}
                  </select>
                </label>

                <label className="field">
                  <span>Tell us more (at least a sentence — what, when, who&apos;s affected)</span>
                  <textarea
                    rows={4}
                    minLength={10}
                    maxLength={2000}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="e.g. Their listing claims a 99+ ATAR but they couldn't answer basic questions about the subject."
                    required
                  />
                  <small className="hint">{description.length} / 2000</small>
                </label>

                {err && <div className="auth-error">{err}</div>}

                <div className="form-submit-row">
                  <button type="submit" className="btn brand" disabled={busy || !reason || description.trim().length < 10}>
                    {busy ? "Sending…" : "Submit report"}
                  </button>
                  <button type="button" className="btn ghost" onClick={close} disabled={busy}>
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
