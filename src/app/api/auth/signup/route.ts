import { NextResponse } from "next/server";
import { z } from "zod";
import { createUser, findUserByEmail, newId } from "@/lib/db";
import { hashPassword } from "@/lib/password";
import { isAdminEmail, newSession, setSessionCookie } from "@/lib/session";

export const runtime = "nodejs";

const Body = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Min 8 characters").max(200),
  role: z.enum(["PARENT", "TUTOR"]).default("PARENT"),
});

export async function POST(req: Request) {
  const json = await req.json().catch(() => ({}));
  const parsed = Body.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_body", details: parsed.error.flatten() }, { status: 400 });
  }
  const { email, password } = parsed.data;
  let { role } = parsed.data;

  const existing = await findUserByEmail(email);
  if (existing) {
    return NextResponse.json({ error: "email_taken" }, { status: 409 });
  }

  // ADMIN_EMAILS allowlist promotes signups to admin automatically.
  if (isAdminEmail(email)) role = "ADMIN" as never;

  const user = {
    id: newId("u"),
    email: email.toLowerCase(),
    passwordHash: hashPassword(password),
    role: role as "PARENT" | "TUTOR" | "ADMIN",
    createdAt: new Date().toISOString(),
  };
  await createUser(user);
  setSessionCookie(newSession({ userId: user.id, email: user.email, role: user.role }));

  return NextResponse.json({ ok: true, user: { id: user.id, email: user.email, role: user.role } });
}
