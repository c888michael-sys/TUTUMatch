import Link from "next/link";
import { TopNav } from "@/components/nav/TopNav";

export const metadata = { title: "Contact us · TUTUMatch" };

export default function ContactPage() {
  return (
    <>
      <TopNav />
      <main className="page-shell content-shell">
        <h1>Contact us</h1>
        <p className="content-lede">
          We&apos;re a small operation. Email us — we read everything and try to reply within one business day.
        </p>

        <div className="contact-grid">
          <div className="contact-card">
            <h2>General questions</h2>
            <p>
              Anything about the platform, billing, your account, or a question that doesn&apos;t fit the other
              categories.
            </p>
            <a className="btn brand" href="mailto:hello@tutumatch.com.au">
              hello@tutumatch.com.au
            </a>
          </div>

          <div className="contact-card">
            <h2>Child safety</h2>
            <p>
              Concerns about a tutor, an interaction with a child, or anything child-safety related. Reviewed
              urgently. If a child is in immediate danger, <strong>call 000</strong> or your local police first.
            </p>
            <a className="btn brand" href="mailto:safety@tutumatch.com.au">
              safety@tutumatch.com.au
            </a>
          </div>

          <div className="contact-card">
            <h2>Suspended? Appeal here</h2>
            <p>
              If your account was suspended (a report resolved against you, or a manual admin decision) and you
              think it was wrong, email us with your account email + what happened.
            </p>
            <a className="btn brand" href="mailto:appeals@tutumatch.com.au">
              appeals@tutumatch.com.au
            </a>
          </div>

          <div className="contact-card">
            <h2>Privacy / data</h2>
            <p>
              Privacy Act requests (access, correction, deletion), or anything about how we handle your data.
            </p>
            <a className="btn brand" href="mailto:privacy@tutumatch.com.au">
              privacy@tutumatch.com.au
            </a>
          </div>
        </div>

        <h2>Or report something specific</h2>
        <p>
          You don&apos;t need to email us to report a problem with a tutor. Use the{" "}
          <strong>Report</strong> button at the bottom of any{" "}
          <Link href="/browse">tutor profile</Link> — it goes straight into the admin queue.
        </p>
      </main>
    </>
  );
}
