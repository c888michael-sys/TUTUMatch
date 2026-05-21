import Link from "next/link";
import { TopNav } from "@/components/nav/TopNav";

export const metadata = { title: "Not found · TUTUMatch" };

export default function NotFound() {
  return (
    <>
      <TopNav />
      <main className="page-shell error-shell">
        <p className="error-code">404</p>
        <h1>That page doesn&apos;t exist</h1>
        <p className="error-lede">
          The link might be old, mistyped, or pointing at a tutor whose listing isn&apos;t live. Try one of these:
        </p>
        <div className="error-links">
          <Link className="btn brand" href="/">Home</Link>
          <Link className="btn ghost" href="/browse">Browse tutors</Link>
          <Link className="btn ghost" href="/tutor/signup">For tutors</Link>
        </div>
        <p className="muted small">
          Still lost? Email{" "}
          <a className="mono-link" href="mailto:hello@tutumatch.com.au">hello@tutumatch.com.au</a>.
        </p>
      </main>
    </>
  );
}
