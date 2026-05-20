"use client";

import { useState } from "react";

export function VisibilityToggle({
  initial,
  disabled = false,
  disabledReason,
}: {
  initial: boolean;
  disabled?: boolean;
  disabledReason?: string;
}) {
  const [visible, setVisible] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function toggle() {
    if (disabled || busy) return;
    setBusy(true);
    setErr(null);
    const next = !visible;
    setVisible(next); // optimistic
    try {
      const res = await fetch("/api/tutor/applications/visibility", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visibility: next }),
      });
      if (!res.ok) {
        setVisible(!next); // revert
        setErr("Couldn't update — try again.");
      }
    } catch {
      setVisible(!next);
      setErr("Network error.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="visibility-toggle">
      <button
        type="button"
        role="switch"
        aria-checked={visible}
        aria-disabled={disabled || busy}
        className={`switch ${visible ? "on" : "off"} ${disabled ? "is-disabled" : ""}`}
        onClick={toggle}
        title={disabled ? disabledReason : undefined}
      >
        <span className="switch-knob" />
      </button>
      <div className="visibility-text">
        <div className="visibility-label">
          {visible ? "Visible on browse" : "Hidden from browse"}
        </div>
        <div className="visibility-hint">
          {disabled
            ? disabledReason
            : visible
              ? "Parents can find you in /browse and on your school page (once approved)."
              : "Your profile is paused — no one will see it until you turn this back on."}
        </div>
        {err && <div className="visibility-error">{err}</div>}
      </div>
    </div>
  );
}
