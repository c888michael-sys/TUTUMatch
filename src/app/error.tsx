"use client";

import Link from "next/link";
import { useEffect } from "react";

// Root error boundary. Catches anything thrown during a page render.

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // In production this would go to Sentry. Local dev: surface to the
    // browser console so the user can copy a useful trace.
    console.error("Unhandled app error:", error);
  }, [error]);

  return (
    <main className="page-shell error-shell">
      <p className="error-code">500</p>
      <h1>Something broke on our end</h1>
      <p className="error-lede">
        The page crashed while loading. This is a TUTUMatch bug — try again, and if it keeps happening tell us so we
        can fix it.
      </p>
      {error.digest && (
        <p className="muted small">
          Error reference: <code>{error.digest}</code>
        </p>
      )}
      <div className="error-links">
        <button type="button" className="btn brand" onClick={() => reset()}>
          Try again
        </button>
        <Link className="btn ghost" href="/">Home</Link>
      </div>
      <p className="muted small">
        Report it: <a className="mono-link" href="mailto:hello@tutumatch.com.au">hello@tutumatch.com.au</a>
      </p>
    </main>
  );
}
