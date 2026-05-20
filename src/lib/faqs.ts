export type Faq = { tag: "parents" | "tutors"; q: string; a: string };

export const FAQS: Faq[] = [
  {
    tag: "parents",
    q: "Why does the parent pay the $20 if it's the tutor's commission?",
    a: "Because escrow. If the tutor paid us after they got the introduction, plenty would simply take the parent's contact details and disappear. By collecting through the parent and having the tutor discount the first lesson by $20, we make the commission unavoidable — and net cost to the parent stays at zero.",
  },
  {
    tag: "parents",
    q: "What if the tutor never gives me the $20 discount?",
    a: "Flag it in the app within 5 days of your first lesson. We refund you, charge the tutor directly, and warn them. Two strikes and they're removed from the platform.",
  },
  {
    tag: "parents",
    q: "What if I unlock a tutor and they don't reply?",
    a: "Automatic refund after 5 days of silence, no questions asked. You don't have to chase us.",
  },
  {
    tag: "parents",
    q: "Can I unlock multiple tutors?",
    a: "Yes. Each unlock is $20, and each gets you the $20-off-first-lesson reimbursement. Unlock as many as you want — only commit to lessons with the ones you actually like.",
  },
  {
    tag: "parents",
    q: "How are tutors verified?",
    a: "WWCC check, government ID match, manual review of HSC/ATAR documents, 18+ only. We review every application by hand before a tutor goes live.",
  },
  {
    tag: "tutors",
    q: "What stops tutors from sharing contact off-platform to dodge the $20?",
    a: "Honestly — not much technically, beyond chat monitoring on first contact. But our Terms make it grounds for permanent removal, and we encourage parents to report it. The flat $20 is small enough that gaming it isn't worth losing your listing over.",
  },
  {
    tag: "parents",
    q: "When and how do tutors get paid?",
    a: "Directly by the parent, however you both arrange it. Bank transfer, cash, PayID — your call. We're not in the loop after the introduction.",
  },
  {
    tag: "tutors",
    q: "GST and receipts?",
    a: "We issue you a tax invoice for the $20 commission. Lesson income between you and the parent is yours to declare as you would any tutoring work.",
  },
  {
    tag: "parents",
    q: "Online or in-person?",
    a: "Both. Each tutor sets their own availability — most do both. Filter by mode when browsing.",
  },
  {
    tag: "parents",
    q: "Is the platform responsible for the quality of lessons?",
    a: "No. We're an introduction service. We verify identity, credentials, and child-safety status. The lessons themselves are a private arrangement between you and the tutor.",
  },
];
