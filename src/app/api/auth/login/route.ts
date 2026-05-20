import { NextResponse } from "next/server";
import { z } from "zod";
import { findUserByEmail } from "@/lib/db";
import { verifyPassword } from "@/lib/password";
import { newSession, setSessionCookie } from "@/lib/session";

export const runtime = "nodejs";

const Body = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(req: Request) {
  const json = await req.json().catch(() => ({}));
  const parsed = Body.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }
  const { email, password } = parsed.data;
  const user = await findUserByEmail(email);
  if (!user || !verifyPassword(password, user.passwordHash)) {
    return NextResponse.json({ error: "invalid_credentials" }, { status: 401 });
  }

  if (user.suspended) {
    return NextResponse.json(
      {
        error: "account_suspended",
        reason: user.suspendedReason ?? "Account suspended.",
        appealEmail: "appeals@tutumatch.com.au",
      },
      { status: 403 }
    );
  }

  setSessionCookie(newSession({ userId: user.id, email: user.email, role: user.role }));
  return NextResponse.json({ ok: true, user: { id: user.id, email: user.email, role: user.role } });
}
