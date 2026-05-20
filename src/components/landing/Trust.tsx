import { SectionHead } from "./SectionHead";
import { DocIcon, IdIcon, ShieldIcon, UserIcon } from "./icons";

const TRUST = [
  { t: "WWCC verified", d: "Working With Children Check on every tutor before they're listed.", Ico: ShieldIcon },
  { t: "Government ID checked", d: "Driver's licence or passport against the name on the WWCC.", Ico: IdIcon },
  {
    t: "HSC/ATAR results verified",
    d: "Manual review of NESA Results Notice scans. No self-reported ATARs.",
    Ico: DocIcon,
  },
  {
    t: "18+ tutors only",
    d: "Adult tutors only. No high-schoolers tutoring high-schoolers via the platform.",
    Ico: UserIcon,
  },
];

export function Trust() {
  return (
    <section className="section-pad">
      <SectionHead
        eyebrow="Trust & safety"
        heading="How we vet every tutor."
        brandWords={2}
        lede="Every tutor clears the same checks before going live. No exceptions for high ATAR. No exceptions for the founder's mate."
      />
      <div className="trust-grid">
        {TRUST.map((t, i) => (
          <div className="trust-cell reveal" key={i} style={{ animationDelay: `${i * 40}ms` }}>
            <div className="ico">
              <t.Ico />
            </div>
            <h3>{t.t}</h3>
            <p>{t.d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
