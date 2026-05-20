import Link from "next/link";
import { redirect } from "next/navigation";
import { TopNav } from "@/components/nav/TopNav";
import {
  findApplicationById,
  findUserById,
  listMessages,
  listUnlocksForUser,
  processOverdueRefunds,
} from "@/lib/db";
import { getSession } from "@/lib/session";

export const metadata = { title: "Messages · TUTUMatch" };
export const dynamic = "force-dynamic";

export default async function MessagesPage() {
  const session = getSession();
  if (!session) redirect("/login?next=/messages");

  // Lazy cron: clear out overdue unlocks before showing the list.
  await processOverdueRefunds();

  const unlocks = await listUnlocksForUser(session.userId);

  type ThreadRow = {
    unlockId: string;
    viewerRole: "PARENT" | "TUTOR";
    otherName: string;
    lastBody: string | null;
    lastAt: string;
    isDev: boolean;
    awaitingTutorReply: boolean;
    daysLeft: number;
    status: string;
  };

  const threads: ThreadRow[] = await Promise.all(
    unlocks.map(async (u) => {
      const isParent = session.userId === u.parentUserId;
      const app = await findApplicationById(u.tutorApplicationId);
      const otherUser = isParent
        ? await findUserById(u.tutorUserId)
        : await findUserById(u.parentUserId);
      const messages = await listMessages(u.id);
      const last = messages[messages.length - 1];
      const tutorDisplay = app ? `${app.firstName} ${app.lastInitial}.` : "(tutor)";
      const msLeft = Date.parse(u.refundEligibleAt) - Date.now();
      return {
        unlockId: u.id,
        viewerRole: isParent ? "PARENT" : "TUTOR",
        otherName: isParent ? tutorDisplay : (otherUser?.email ?? "(parent)"),
        lastBody: last?.body ?? null,
        lastAt: last?.createdAt ?? u.paidAt,
        isDev: u.isDev === true,
        awaitingTutorReply: u.status === "PAID" && !u.tutorFirstReplyAt,
        daysLeft: Math.max(0, Math.ceil(msLeft / (1000 * 60 * 60 * 24))),
        status: u.status,
      };
    })
  );

  // Sort so threads needing the viewer's attention bubble to the top.
  threads.sort((a, b) => {
    const aNeeds = a.viewerRole === "TUTOR" && a.awaitingTutorReply ? 1 : 0;
    const bNeeds = b.viewerRole === "TUTOR" && b.awaitingTutorReply ? 1 : 0;
    if (aNeeds !== bNeeds) return bNeeds - aNeeds;
    return b.lastAt.localeCompare(a.lastAt);
  });

  return (
    <>
      <TopNav />
      <main className="page-shell">
        <h1>Messages</h1>
        <p>
          Conversations with tutors you&apos;ve unlocked (or parents who&apos;ve unlocked you).
        </p>
        {threads.length === 0 ? (
          <div className="stub-note">
            No conversations yet. {session.role === "PARENT" || session.role === "ADMIN" ? (
              <>Unlock a tutor from <Link href="/browse">browse</Link> to start one.</>
            ) : (
              <>You&apos;ll see a thread here when a parent unlocks your profile.</>
            )}
          </div>
        ) : (
          <ul className="thread-list">
            {threads.map((t) => {
              const needsTutorReply = t.viewerRole === "TUTOR" && t.awaitingTutorReply;
              return (
                <li key={t.unlockId}>
                  <Link
                    className={`thread-row ${needsTutorReply ? "needs-reply" : ""}`}
                    href={`/messages/${t.unlockId}`}
                  >
                    <div className="thread-row-head">
                      <span className="thread-other">{t.otherName}</span>
                      <span className="thread-meta">
                        {t.viewerRole === "PARENT" ? "Tutor" : "Parent"}
                        {t.isDev && <span className="dev-tag">DEV</span>}
                        {t.status === "REFUNDED" && <span className="auto-tag">REFUNDED</span>}
                        {needsTutorReply && <span className="urgent-tag">REPLY ASAP</span>}
                      </span>
                    </div>
                    <div className="thread-preview">
                      {t.lastBody ?? <em>No messages yet — say hi 👋</em>}
                    </div>
                    <div className="thread-time">
                      {new Date(t.lastAt).toLocaleString("en-AU")}
                      {needsTutorReply && (
                        <span className="thread-countdown">
                          {" · "}
                          {t.daysLeft} day{t.daysLeft === 1 ? "" : "s"} left before auto-refund + suspension
                        </span>
                      )}
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </main>
    </>
  );
}
