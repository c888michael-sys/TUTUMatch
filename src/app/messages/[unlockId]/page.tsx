import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { TopNav } from "@/components/nav/TopNav";
import { Thread } from "@/components/messages/Thread";
import { ReportButton } from "@/components/report/ReportButton";
import { FastForwardRefund } from "@/components/messages/FastForwardRefund";
import {
  findApplicationById,
  findUnlockById,
  findUserById,
  listMessages,
  processOverdueRefunds,
} from "@/lib/db";
import { getSession } from "@/lib/session";

export const metadata = { title: "Chat · TUTUMatch" };
export const dynamic = "force-dynamic";

export default async function ThreadPage({ params }: { params: { unlockId: string } }) {
  const session = getSession();
  if (!session) redirect(`/login?next=/messages/${params.unlockId}`);

  // Process any overdue unlocks first — if this one was overdue, the next
  // findUnlockById will see it as REFUNDED.
  await processOverdueRefunds();

  const unlock = await findUnlockById(params.unlockId);
  if (!unlock) notFound();

  const isParent = session.userId === unlock.parentUserId;
  const isTutor = session.userId === unlock.tutorUserId;
  if (!isParent && !isTutor) {
    return (
      <>
        <TopNav />
        <main className="page-shell">
          <h1>Forbidden</h1>
          <p>You&apos;re not part of this conversation.</p>
        </main>
      </>
    );
  }

  const app = await findApplicationById(unlock.tutorApplicationId);
  const tutorUser = await findUserById(unlock.tutorUserId);
  const parentUser = await findUserById(unlock.parentUserId);
  const messages = await listMessages(unlock.id);

  const tutorDisplay = app ? `${app.firstName} ${app.lastInitial}.` : "(tutor)";
  const otherLabel = isParent ? tutorDisplay : parentUser?.email ?? "(parent)";

  // Post-unlock contact info shown to the parent
  const contactBlock = isParent && app ? {
    fullName: `${app.firstName} ${app.fullLastName}`,
    phone: app.phone,
    email: app.contactEmail,
    socials: app.socials ?? null,
  } : null;

  return (
    <>
      <TopNav />
      <main className="page-shell chat-shell">
        <div className="back-row">
          <Link className="link-like" href="/messages">← All messages</Link>
        </div>

        <header className="chat-head">
          <h1>{otherLabel}</h1>
          <div className="chat-meta">
            <span>{isParent ? "Tutor" : "Parent"}</span>
            <span className="sep">·</span>
            <span>Unlocked {new Date(unlock.paidAt).toLocaleString("en-AU")}</span>
            {unlock.isDev && <span className="dev-tag">DEV UNLOCK</span>}
          </div>
        </header>

        {contactBlock && (
          <section className="contact-card">
            <div className="contact-card-head">Contact details (unlocked)</div>
            <div className="contact-rows">
              <div><strong>Name:</strong> {contactBlock.fullName}</div>
              <div><strong>Phone:</strong> <a href={`tel:${contactBlock.phone}`} className="mono-link">{contactBlock.phone}</a></div>
              <div><strong>Email:</strong> <a href={`mailto:${contactBlock.email}`} className="mono-link">{contactBlock.email}</a></div>
              {contactBlock.socials && <div><strong>Socials:</strong> {contactBlock.socials}</div>}
            </div>
            <p className="contact-card-note">
              You can message in-platform here or contact directly — your call. Remember: the tutor applies a $20
              discount to your first lesson. If you don&apos;t reach an agreement, request a refund within 5 days.
            </p>
          </section>
        )}

        {!isParent && unlock.status === "PAID" && !unlock.tutorFirstReplyAt && (
          <section className="urgent-banner inline">
            <div className="urgent-banner-head">
              ⚠ Reply ASAP — {(() => {
                const ms = Date.parse(unlock.refundEligibleAt) - Date.now();
                const d = Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)));
                return `${d} day${d === 1 ? "" : "s"} left`;
              })()}
            </div>
            <p className="urgent-banner-note">
              {parentUser?.email ?? "This parent"} paid <strong>$20</strong> to message you and expects a fast
              response. If you don&apos;t reply within 5 days of their unlock, they&apos;re automatically refunded{" "}
              <strong>and your account is suspended</strong> until you appeal. Even a one-line reply stops the clock.
            </p>
          </section>
        )}

        {!isParent && (
          <section className="contact-card contact-card-tutor">
            <div className="contact-card-head">Reminder for you (tutor)</div>
            <p className="contact-card-note">
              Apply a <strong>$20 discount</strong> to {parentUser?.email ?? "this parent"}&apos;s first lesson
              invoice. That covers the unlock fee they paid TUTUMatch — keep them happy and you keep 100% of every
              lesson after that.
            </p>
            <p className="contact-card-note">
              <strong>Pick a safe meeting place.</strong> Public libraries are recommended. Whatever you pick,
              discuss it with the parent before the first lesson — TUTUMatch doesn&apos;t choose locations and
              isn&apos;t responsible for what happens at any lesson.
            </p>
          </section>
        )}

        {unlock.status === "REFUNDED" && (
          <section className="reject-banner">
            <strong>This unlock was refunded.</strong>{" "}
            {unlock.refundReason === "TUTOR_NO_REPLY_5_DAY"
              ? "The tutor didn't reply within 5 days, so the $20 was refunded automatically and the tutor's account was suspended."
              : "A refund was processed for this unlock."}
          </section>
        )}

        {isParent && unlock.status === "PAID" && !unlock.tutorFirstReplyAt && (
          <FastForwardRefund unlockId={unlock.id} refundEligibleAt={unlock.refundEligibleAt} />
        )}

        <Thread unlockId={unlock.id} viewerRole={isParent ? "PARENT" : "TUTOR"} initialMessages={messages} />

        <div className="report-row">
          <ReportButton
            subjectKind="MESSAGE"
            subjectId={isParent ? unlock.tutorUserId : unlock.parentUserId}
            subjectThreadId={unlock.id}
            subjectLabel={isParent ? tutorDisplay : "this parent"}
            variant="inline"
          />
          <span className="report-row-note">
            Use this if {isParent ? "the tutor" : "the parent"} is being abusive, sharing contact info
            inappropriately, or anything else worth flagging. For urgent child-safety issues, also email{" "}
            <a href="mailto:safety@tutumatch.com.au" className="mono-link">safety@tutumatch.com.au</a>
            {" "}or contact the police directly.
          </span>
        </div>
      </main>
    </>
  );
}
