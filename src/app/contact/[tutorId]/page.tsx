import Link from "next/link";
import { notFound } from "next/navigation";
import { TopNav } from "@/components/nav/TopNav";
import { RequestContactForm } from "@/components/contact/RequestContactForm";
import { findApplicationById } from "@/lib/db";

export const metadata = { title: "Contact a tutor · TUTUMatch" };
export const dynamic = "force-dynamic";

function yearsLabel(years: number[]): string {
  if (years.length === 0) return "—";
  if (years.length === 6) return "Years 7–12";
  return "Y" + [...years].sort((a, b) => a - b).join(", Y");
}

export default async function ContactTutorPage({ params }: { params: { tutorId: string } }) {
  const app = await findApplicationById(params.tutorId);
  if (!app || app.status !== "APPROVED") notFound();

  const firstName = app.firstName;
  const name = `${app.firstName} ${app.lastInitial}.`;
  const rate = Math.round(app.hourlyRateCents / 100);
  const suburb = app.suburb ?? app.tutoringAreaOther ?? "—";

  return (
    <>
      <TopNav />
      <main className="page-shell content-shell">
        <div className="back-row">
          <Link className="link-like" href={`/tutors/${params.tutorId}`}>
            ← Back to {firstName}&apos;s profile
          </Link>
        </div>

        <h1>Contact {firstName}</h1>
        <p className="content-lede">
          Getting in touch is <strong>free</strong> — TUTUMatch never charges parents. Enter your email below and
          we&apos;ll show you {firstName}&apos;s contact details so you can reach out directly.
        </p>

        <section className="profile-section">
          <h2>{name}</h2>
          <div className="profile-meta">
            {suburb}
            <span className="sep">·</span>
            <span className="atar">ATAR {app.atar.toFixed(2)}</span>
            <span className="sep">·</span>
            <span>${rate}/hr</span>
          </div>
          <div className="subs" style={{ marginTop: 12 }}>
            {app.offeredSubjects.map((o, i) => (
              <span className="sub" key={i}>
                {o.subject} <b>{yearsLabel(o.yearLevels)}</b>
              </span>
            ))}
          </div>
        </section>

        <section className="profile-section">
          <h2>What happens next</h2>
          <ol className="how-list">
            <li>
              <strong>You see {firstName}&apos;s contact details</strong> — full name, phone, and email — straight
              away. Reach out however you prefer.
            </li>
            <li>
              <strong>You arrange everything directly</strong> with {firstName}: rate, schedule, and lesson
              location. TUTUMatch is not part of that conversation.
            </li>
            <li>
              <strong>{firstName}&apos;s listing is paused for 48 hours</strong> while you two talk, so you&apos;re
              not competing with other enquiries.
            </li>
          </ol>
          <p>
            TUTUMatch is a directory and does not verify tutors. Before any lesson, verify {firstName}&apos;s
            Working With Children Check yourself — see the{" "}
            <Link href="/legal/child-safety">Child Safety Policy</Link>.
          </p>
        </section>

        <RequestContactForm tutorApplicationId={app.id} tutorFirstName={firstName} />
      </main>
    </>
  );
}
