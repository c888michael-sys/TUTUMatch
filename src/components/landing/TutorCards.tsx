import Link from "next/link";
import { SectionHead } from "./SectionHead";
import { LockIcon } from "./icons";
import { SAMPLE_TUTORS } from "@/lib/sample-tutors";
import type { School } from "@/lib/schools";

export function TutorCards({ school }: { school: School }) {
  const tutors = SAMPLE_TUTORS[school.id] ?? SAMPLE_TUTORS.default;
  return (
    <section className="section-pad">
      <SectionHead
        eyebrow={`Sample listings · ${school.name}`}
        heading="What you'll see when you browse."
        brandWords={1}
        lede={`Example tutors for ${school.name}. Real listings show first name + last initial, photo, suburb, verified ATAR, HSC subjects with band results, and the tutor's hourly rate. Contact details are masked until unlock.`}
      />
      <div className="tutor-grid">
        {tutors.map((t, i) => (
          <div className="tcard reveal" key={i}>
            <span className="example">Example</span>
            <div className="top">
              <div className="ph">{t.initials}</div>
              <div>
                <div className="name">{t.name}</div>
                <div className="meta">
                  {t.suburb}
                  <span className="sep">·</span>
                  <span className="atar">ATAR {t.atar}</span>
                </div>
              </div>
            </div>
            <div className="subs">
              {t.subjects.map((s, j) => (
                <span className="sub" key={j}>
                  {s.s} <b>{s.b}</b>
                </span>
              ))}
            </div>
            <div className="mode">{t.mode}</div>
            <div className="row">
              <div className="rate">
                ${t.rate}
                <small>/hr</small>
              </div>
              <Link className="unlock" href={`/unlock/sample-${i}`}>
                <LockIcon /> Unlock — $20
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
