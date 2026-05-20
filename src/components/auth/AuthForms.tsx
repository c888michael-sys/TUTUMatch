"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type Mode = "login" | "signup";

export function AuthForms({ defaultMode = "login" as Mode }) {
  const [mode, setMode] = useState<Mode>(defaultMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<"PARENT" | "TUTOR">("PARENT");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const router = useRouter();
  const search = useSearchParams();
  const next = search.get("next") ?? "/";

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    try {
      const url = mode === "login" ? "/api/auth/login" : "/api/auth/signup";
      const body = mode === "login" ? { email, password } : { email, password, role };
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.error === "account_suspended") {
          setErr(
            `${data.reason ?? "Account suspended."} To appeal, email ${data.appealEmail ?? "appeals@tutumatch.com.au"}.`
          );
          return;
        }
        setErr(humanError(data.error));
        return;
      }
      // Force a server reload so the session cookie is picked up by RSC.
      router.replace(next);
      router.refresh();
    } catch {
      setErr("Network error — try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="auth-card">
      <div className="auth-toggle" role="tablist">
        <button
          role="tab"
          aria-selected={mode === "login"}
          className={`auth-toggle-btn ${mode === "login" ? "active" : ""}`}
          onClick={() => setMode("login")}
        >
          Log in
        </button>
        <button
          role="tab"
          aria-selected={mode === "signup"}
          className={`auth-toggle-btn ${mode === "signup" ? "active" : ""}`}
          onClick={() => setMode("signup")}
        >
          Sign up
        </button>
      </div>

      <form onSubmit={submit} className="auth-form">
        <label className="field">
          <span>Email</span>
          <input
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label className="field">
          <span>Password</span>
          <div className="password-wrap">
            <input
              type={showPassword ? "text" : "password"}
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              required
              minLength={mode === "signup" ? 8 : undefined}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword((s) => !s)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
              tabIndex={-1}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          {mode === "signup" && <small className="hint">Minimum 8 characters.</small>}
        </label>
        {mode === "signup" && (
          <fieldset className="field role-group">
            <legend>I&apos;m a…</legend>
            <label>
              <input
                type="radio"
                name="role"
                value="PARENT"
                checked={role === "PARENT"}
                onChange={() => setRole("PARENT")}
              />
              Parent / student
            </label>
            <label>
              <input
                type="radio"
                name="role"
                value="TUTOR"
                checked={role === "TUTOR"}
                onChange={() => setRole("TUTOR")}
              />
              Tutor (you&apos;ll be asked to verify next)
            </label>
          </fieldset>
        )}

        {err && <div className="auth-error">{err}</div>}

        <button className="btn brand lg" type="submit" disabled={busy}>
          {busy ? "Working…" : mode === "login" ? "Log in" : "Create account"}
        </button>
      </form>
    </div>
  );
}

function humanError(code: string | undefined): string {
  switch (code) {
    case "email_taken":
      return "That email already has an account — try logging in.";
    case "invalid_credentials":
      return "Email or password is wrong.";
    case "invalid_body":
      return "Check the form — something is missing or invalid.";
    default:
      return "Something went wrong. Try again.";
  }
}
