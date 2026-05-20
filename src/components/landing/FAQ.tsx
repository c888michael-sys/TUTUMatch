"use client";

import { useMemo, useState } from "react";
import { SectionHead } from "./SectionHead";
import { FAQS, type Faq } from "@/lib/faqs";

type Tab = "all" | "parents" | "tutors";

export function FAQ() {
  const [tab, setTab] = useState<Tab>("all");
  const [open, setOpen] = useState(0);

  const filtered: Faq[] = useMemo(
    () => (tab === "all" ? FAQS : FAQS.filter((f) => f.tag === tab)),
    [tab]
  );

  const tabs: { id: Tab; l: string }[] = [
    { id: "all", l: "All" },
    { id: "parents", l: "For parents" },
    { id: "tutors", l: "For tutors" },
  ];

  return (
    <section className="section-pad">
      <SectionHead
        eyebrow="FAQ"
        heading="Common questions."
        brandWords={1}
        lede="Anything else? Email hello@tutmatch.com.au and we'll get back the same day."
      />
      <div className="faq-tabs reveal" role="tablist">
        {tabs.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            className={`faq-tab ${tab === t.id ? "active" : ""}`}
            onClick={() => {
              setTab(t.id);
              setOpen(-1);
            }}
          >
            {t.l}
          </button>
        ))}
      </div>
      <div className="faq-list reveal">
        {filtered.map((f, i) => (
          <div className={`faq-item ${open === i ? "open" : ""}`} key={`${tab}-${i}`}>
            <button className="faq-q" onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i}>
              <div className="qrow">
                <span className="tag">{f.tag === "parents" ? "For parents" : "For tutors"}</span>
                <span>{f.q}</span>
              </div>
              <span className="plus" aria-hidden="true" />
            </button>
            <div className="faq-a">
              <div className="faq-a-inner">{f.a}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
