import { NextResponse } from "next/server";
import { z } from "zod";
import {
  createMessage,
  findUnlockById,
  listMessages,
  newId,
  patchUnlock,
  type Message,
} from "@/lib/db";
import { getSession } from "@/lib/session";

export const runtime = "nodejs";

const Body = z.object({
  body: z.string().trim().min(1, "Type a message").max(2000),
});

async function authorize(unlockId: string) {
  const session = getSession();
  if (!session) return { error: "unauthenticated" as const, status: 401 };
  const unlock = await findUnlockById(unlockId);
  if (!unlock) return { error: "not_found" as const, status: 404 };
  const isParent = session.userId === unlock.parentUserId;
  const isTutor = session.userId === unlock.tutorUserId;
  if (!isParent && !isTutor) return { error: "forbidden" as const, status: 403 };
  return { session, unlock, role: isParent ? ("PARENT" as const) : ("TUTOR" as const) };
}

// GET /api/threads/[unlockId]/messages — all messages in the thread.
export async function GET(_req: Request, { params }: { params: { unlockId: string } }) {
  const auth = await authorize(params.unlockId);
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const messages = await listMessages(params.unlockId);
  return NextResponse.json({
    messages,
    unlock: auth.unlock,
    viewerRole: auth.role,
  });
}

// POST /api/threads/[unlockId]/messages — send a message.
export async function POST(req: Request, { params }: { params: { unlockId: string } }) {
  const auth = await authorize(params.unlockId);
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const json = await req.json().catch(() => ({}));
  const parsed = Body.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_body", details: parsed.error.flatten() }, { status: 400 });
  }

  const msg: Message = {
    id: newId("msg"),
    unlockId: params.unlockId,
    senderId: auth.session.userId,
    senderRole: auth.role,
    body: parsed.data.body,
    createdAt: new Date().toISOString(),
  };
  await createMessage(msg);

  // First tutor reply stops the 5-day auto-refund clock. Once we have the
  // refund cron live, this is what unblocks the unlock from auto-refunding.
  if (auth.role === "TUTOR" && !auth.unlock.tutorFirstReplyAt) {
    await patchUnlock(params.unlockId, { tutorFirstReplyAt: msg.createdAt });
  }

  return NextResponse.json({ message: msg });
}
