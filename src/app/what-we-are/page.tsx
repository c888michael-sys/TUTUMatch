import Link from "next/link";
import { TopNav } from "@/components/nav/TopNav";

export const metadata = {
  title: "What TUTUMatch is (and isn't) · TUTUMatch",
  description:
    "TUTUMatch is a classifieds directory for NSW tutors. Listings are tutor-provided. We do not verify tutors — parents verify directly.",
};

export default function WhatWeArePage() {
  return (
    <>
      <TopNav />
      <main className="page-shell content-shell">
        <h1>What TUTUMatch is — and isn&apos;t</h1>
        <p className="content-lede">
          TUTUMatch is a classifieds directory. We publish listings that tutors write about
          themselves so parents can find a local tutor. That&apos;s the whole service. This page
          spells out exactly what that does — and does not — mean.
        </p>

        <h2>What TUTUMatch is</h2>
        <ul className="content-link-list">
          <li>
            <strong>A directory.</strong> Think of the trades or jobs classifieds you already use — a
            place where tutors list themselves and parents browse. A directory for tutors, not a
            tutoring company.
          </li>
          <li>
            <strong>Free for parents.</strong> Browsing, filtering, reading profiles, and contacting
            a tutor cost nothing. There is no parent-side payment anywhere on TUTUMatch.
          </li>
          <li>
            <strong>Free for tutors to list.</strong> Tutors pay only a flat $20 commission when a
            real student is confirmed — and their first matched student is free.
          </li>
          <li>
            <strong>Out of the loop after the introduction.</strong> Once a parent and tutor are in
            contact, the lesson, the schedule, the location, and the payment for tutoring are
            entirely between them.
          </li>
        </ul>

        <h2>What TUTUMatch is not</h2>
        <ul className="what-we-arent">
          <li>
            <strong>Not a verifier.</strong> We do not verify, vet, screen, or background-check
            tutors. We run no Working With Children Check, no ID check, and no credential check. We
            display no &ldquo;verified&rdquo; badge or trust mark, because we do not perform the
            underlying check.
          </li>
          <li>
            <strong>Not the author of any listing.</strong> Every profile is written and supplied by
            the individual tutor. Subjects, results, rates, and availability are the tutor&apos;s own
            claims, and we do not confirm them.
          </li>
          <li>
            <strong>Not a tutoring provider.</strong> TUTUMatch does not employ tutors, set lesson
            content, or deliver tutoring. We are not the tutor&apos;s employer, agent, or partner.
          </li>
          <li>
            <strong>Not a party to any lesson.</strong> Lessons are private arrangements between a
            parent and a tutor. We do not host, supervise, or monitor them, and we do not choose
            where they happen.
          </li>
          <li>
            <strong>Not a guarantor of outcomes.</strong> We make no promise about any ATAR, mark,
            university admission, or other academic result.
          </li>
        </ul>

        <h2>What this means for parents</h2>
        <p>
          Because we don&apos;t verify anyone, the checks are yours to do — and they&apos;re quick:
        </p>
        <ol className="how-list">
          <li>
            <strong>Verify the WWCC yourself.</strong> Ask the tutor for their Working With Children
            Check number and the name and date of birth registered against it, then use the free
            public lookup at the{" "}
            <a
              href="https://www.kidsguardian.nsw.gov.au/working-with-children/check-an-employee-or-volunteer"
              target="_blank"
              rel="noopener noreferrer"
            >
              NSW Office of the Children&apos;s Guardian
            </a>
            . It takes about 30 seconds. Don&apos;t accept a screenshot in place of a live lookup.
          </li>
          <li>
            <strong>Confirm the tutor&apos;s claims directly.</strong> Ask to see HSC results, ID, or
            anything else that matters to you. A genuine tutor will be happy to show you.
          </li>
          <li>
            <strong>Meet somewhere safe.</strong> Public libraries are ideal. See the{" "}
            <Link href="/legal/child-safety">Child Safety Policy</Link> for the full safety guidance.
          </li>
        </ol>

        <h2>Why we&apos;re built this way</h2>
        <p>
          A directory that stays out of the verification business keeps parents in control of the
          checks that matter — and keeps the platform honest about what it can and can&apos;t
          promise. We&apos;d rather tell you plainly to verify a tutor yourself than hand you a badge
          that means less than it looks like it does.
        </p>

        <h2>Read more</h2>
        <ul className="content-link-list">
          <li>
            <Link href="/how-it-works">How TUTUMatch works</Link>
          </li>
          <li>
            <Link href="/legal/terms">Terms of Service</Link>
          </li>
          <li>
            <Link href="/legal/child-safety">Child Safety Policy</Link>
          </li>
          <li>
            <Link href="/legal/privacy">Privacy Policy</Link>
          </li>
        </ul>
      </main>
    </>
  );
}
