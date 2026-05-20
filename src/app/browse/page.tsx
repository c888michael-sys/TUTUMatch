import Link from "next/link";

export const metadata = { title: "Browse tutors · TutMatch" };

export default function BrowsePage() {
  return (
    <main className="page-shell">
      <h1>Browse tutors</h1>
      <div className="stub-note">
        STUB · This page is the parent-side browse experience. Filters: subject, year level, ATAR range, suburb,
        in-person/online, price range, day/time availability, alma mater school. Tutor cards link to{" "}
        <code>/tutors/[id]</code> for the full profile detail, with the Unlock CTA leading to{" "}
        <code>/unlock/[tutorId]</code>.
      </div>
      <p>
        For now, sample tutor cards live on the landing pages. See <Link href="/">/</Link> or{" "}
        <Link href="/schools/killara">/schools/killara</Link> for the design.
      </p>
      <h2>What this page will do</h2>
      <ul>
        <li>Render server-side from <code>TutorProfile</code> where <code>status = APPROVED</code> and <code>visibility = true</code>.</li>
        <li>Default-filter by school slug when entered via a school landing page (with a &ldquo;show all tutors&rdquo; toggle).</li>
        <li>Hide full names + contact info — only first name + last initial, photo, suburb, subjects, year levels, rate, ATAR, HSC results, availability summary, bio.</li>
        <li>No login required to browse. Login + payment required to unlock a tutor.</li>
      </ul>
    </main>
  );
}
