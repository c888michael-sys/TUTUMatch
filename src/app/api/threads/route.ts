import { NextResponse } from "next/server";
import {
  findApplicationById,
  findUserById,
  listMessages,
  listUnlocksForUser,
} from "@/lib/db";
import { getSession } from "@/lib/session";

export const runtime = "nodejs";

// GET /api/threads — returns the current user's chat threads (parent or tutor).
//
// Each thread carries:
//   - unlockId
//   - the OTHER party's display name + role
//   - last message preview + timestamp (or null if empty)

export async function GET() {
  const session = getSession();
  if (!session) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });

  const unlocks = await listUnlocksForUser(session.userId);
  const threads = await Promise.all(
    unlocks.map(async (u) => {
      const isParent = session.userId === u.parentUserId;
      const otherUser = isParent
        ? await findUserById(u.tutorUserId)
        : await findUserById(u.parentUserId);
      const app = await findApplicationById(u.tutorApplicationId);
      const tutorDisplay = app ? `${app.firstName} ${app.lastInitial}.` : "(tutor)";
      const messages = await listMessages(u.id);
      const last = messages[messages.length - 1];

      return {
        unlockId: u.id,
        viewerRole: isParent ? "PARENT" : "TUTOR",
        otherName: isParent ? tutorDisplay : (otherUser?.email ?? "(parent)"),
        otherEmail: otherUser?.email ?? null,
        status: u.status,
        paidAt: u.paidAt,
        refundEligibleAt: u.refundEligibleAt,
        lastMessage: last ? { body: last.body, createdAt: last.createdAt, senderRole: last.senderRole } : null,
      };
    })
  );

  // newest activity first
  threads.sort((a, b) => {
    const at = a.lastMessage?.createdAt ?? a.paidAt;
    const bt = b.lastMessage?.createdAt ?? b.paidAt;
    return bt.localeCompare(at);
  });

  return NextResponse.json({ threads });
}
