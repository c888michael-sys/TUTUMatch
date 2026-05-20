import crypto from "node:crypto";
import { cookies } from "next/headers";
import type { Role } from "./db";

const COOKIE_NAME = "tm_session";
const TTL_MS = 1000 * 60 * 60 * 24 * 30; // 30 days

function secret(): string {
  const s = process.env.NEXTAUTH_SECRET;
  if (s && s.length >= 16) return s;
  // Dev fallback. Set NEXTAUTH_SECRET in .env.local for anything real.
  return "dev-only-not-secure-replace-me-in-env-local";
}

export type SessionData = {
  userId: string;
  email: string;
  role: Role;
  exp: number;
};

function sign(payload: string): string {
  return crypto.createHmac("sha256", secret()).update(payload).digest("base64url");
}

export function signSession(s: SessionData): string {
  const payload = Buffer.from(JSON.stringify(s)).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function verifySession(token: string | undefined): SessionData | null {
  if (!token) return null;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return null;
  const expected = sign(payload);
  // timingSafeEqual needs equal-length buffers — guard length first.
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return null;
  if (!crypto.timingSafeEqual(a, b)) return null;
  try {
    const s = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as SessionData;
    if (typeof s.exp !== "number" || s.exp < Date.now()) return null;
    return s;
  } catch {
    return null;
  }
}

export function newSession(opts: { userId: string; email: string; role: Role }): SessionData {
  return { ...opts, exp: Date.now() + TTL_MS };
}

export function setSessionCookie(s: SessionData) {
  cookies().set(COOKIE_NAME, signSession(s), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: Math.floor(TTL_MS / 1000),
    path: "/",
  });
}

export function getSession(): SessionData | null {
  const c = cookies().get(COOKIE_NAME);
  return verifySession(c?.value);
}

export function clearSession() {
  cookies().delete(COOKIE_NAME);
}

export function isAdminEmail(email: string): boolean {
  const list = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  return list.includes(email.toLowerCase());
}
