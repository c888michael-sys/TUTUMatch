// Schools, sample tutors, FAQs, comparison rows
// Same-format, different-colour pages per school

const SCHOOLS = [
  {
    id: "killara",
    name: "Killara High School",
    short: "Killara High",
    tagline: "Killara · Upper North Shore · comprehensive",
    brand: "#1B4332",      // forest green
    brandDeep: "#0F2D1F",
    brandSoft: "#E3EFE8",
  },
  {
    id: "masada",
    name: "Masada College",
    short: "Masada",
    tagline: "St Ives · K–12 independent Jewish day school",
    brand: "#1E3A5F",      // navy blue
    brandDeep: "#122747",
    brandSoft: "#E3EAF2",
  },
];

const SAMPLE_TUTORS = {
  killara: [
    { name: "Lachlan H.", suburb: "Killara", atar: "98.65", initials: "LH",
      subjects: [{ s: "Maths Ext 1", b: "E4" }, { s: "Physics", b: "94" }],
      rate: 60, mode: "Online · In-person" },
    { name: "Sophie X.", suburb: "Lindfield", atar: "99.10", initials: "SX",
      subjects: [{ s: "Biology", b: "95" }, { s: "Chemistry", b: "93" }],
      rate: 55, mode: "Online" },
    { name: "Aarav K.", suburb: "Gordon", atar: "99.40", initials: "AK",
      subjects: [{ s: "Maths Ext 2", b: "E4" }, { s: "Physics", b: "95" }],
      rate: 70, mode: "In-person" },
    { name: "Mia C.", suburb: "Killara", atar: "98.20", initials: "MC",
      subjects: [{ s: "English Adv", b: "93" }, { s: "Modern Hist", b: "92" }],
      rate: 50, mode: "Online · In-person" },
  ],
  masada: [
    { name: "Daniel L.", suburb: "St Ives", atar: "99.55", initials: "DL",
      subjects: [{ s: "Maths Ext 1", b: "E4" }, { s: "Chemistry", b: "95" }],
      rate: 65, mode: "Online · In-person" },
    { name: "Hannah B.", suburb: "Pymble", atar: "99.20", initials: "HB",
      subjects: [{ s: "English Adv", b: "94" }, { s: "Economics", b: "93" }],
      rate: 60, mode: "Online" },
    { name: "Noah J.", suburb: "St Ives", atar: "98.70", initials: "NJ",
      subjects: [{ s: "Biology", b: "93" }, { s: "Maths Adv", b: "92" }],
      rate: 55, mode: "In-person" },
    { name: "Tali R.", suburb: "Lindfield", atar: "99.75", initials: "TR",
      subjects: [{ s: "Maths Ext 2", b: "E4" }, { s: "Physics", b: "96" }],
      rate: 75, mode: "Online · In-person" },
  ],
};

const COMPARE_ROWS = [
  { label: "Per-lesson cut", centre: "40–60% commission, every lesson, forever", us: "$0. Ever." },
  { label: "Platform fee", centre: "Built into the centre's hourly rate", us: "$20 once, per match" },
  { label: "Who sets the rate", centre: "The centre", us: "The tutor" },
  { label: "Who picks the tutor", centre: "Assigned", us: "You do" },
  { label: "Lock-in", centre: "Term commitments", us: "None — book one lesson or twenty" },
  { label: "Pricing", centre: "Often opaque or bundled", us: "Listed on every tutor's profile" },
  { label: "Payment", centre: "Through the centre", us: "Tutor and parent, directly" },
];

const TRUST = [
  { t: "WWCC verified", d: "Working With Children Check on every tutor before they're listed.",
    p: "M9 12l2 2 4-4 M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
  { t: "Government ID", d: "Driver's licence or passport check against the name on the WWCC.",
    p: "M3 7h18v10H3z M3 11h18 M7 15h3" },
  { t: "HSC results reviewed", d: "Manual checks against NESA Results Notice scans. No self-reported ATARs.",
    p: "M6 4h9l5 5v11H6z M14 4v6h6 M9 14h6 M9 17h4" },
  { t: "18+ only", d: "Adult tutors only. No high-schoolers tutoring high-schoolers via the platform.",
    p: "M12 2l3 7h7l-5.5 4 2 7-6.5-4-6.5 4 2-7L2 9h7z" },
  { t: "Encrypted documents", d: "Verification scans stored encrypted at rest, deleted on request, never shared.",
    p: "M6 11V8a6 6 0 1112 0v3 M5 11h14v10H5z" },
  { t: "Privacy Act compliant", d: "We follow the Australian Privacy Principles. Your details aren't sold or shared.",
    p: "M12 3l9 4v6c0 5-4 8-9 9-5-1-9-4-9-9V7z" },
];

const FAQS = [
  { tag: "parents", q: "Why does the parent pay the $20 if it's the tutor's commission?",
    a: "Because escrow. If the tutor paid us after they got the introduction, plenty would simply take the parent's contact details and disappear. By collecting through the parent and having the tutor discount the first lesson by $20, we make the commission unavoidable — and net cost to the parent stays at zero." },
  { tag: "parents", q: "What if the tutor never gives me the $20 discount?",
    a: "Flag it in the app within 5 days of your first lesson. We refund you, charge the tutor directly, and warn them. Two strikes and they're removed from the platform." },
  { tag: "parents", q: "What if I unlock a tutor and they don't reply?",
    a: "Automatic refund after 5 days of silence, no questions asked. You don't have to chase us." },
  { tag: "parents", q: "Can I unlock multiple tutors?",
    a: "Yes. Each unlock is $20, and each gets you the $20-off-first-lesson reimbursement. Unlock as many as you want — only commit to lessons with the ones you actually like." },
  { tag: "parents", q: "How are tutors verified?",
    a: "WWCC check, government ID match, manual review of HSC/ATAR documents, 18+ only. We review every application by hand before a tutor goes live." },
  { tag: "tutors", q: "What stops tutors from sharing contact off-platform to dodge the $20?",
    a: "Honestly — not much technically, beyond chat monitoring on first contact. But our Terms make it grounds for permanent removal, and we encourage parents to report it. The flat $20 is small enough that gaming it isn't worth losing your listing over." },
  { tag: "parents", q: "When and how do tutors get paid?",
    a: "Directly by the parent, however you both arrange it. Bank transfer, cash, PayID — your call. We're not in the loop after the introduction." },
  { tag: "tutors", q: "GST and receipts?",
    a: "We issue you a tax invoice for the $20 commission. Lesson income between you and the parent is yours to declare as you would any tutoring work." },
  { tag: "parents", q: "Online or in-person?",
    a: "Both. Each tutor sets their own availability — most do both. Filter by mode when browsing." },
  { tag: "parents", q: "Is the platform responsible for the quality of lessons?",
    a: "No. We're an introduction service. We verify identity, credentials, and child-safety status. The lessons themselves are a private arrangement between you and the tutor." },
];

Object.assign(window, { SCHOOLS, SAMPLE_TUTORS, COMPARE_ROWS, TRUST, FAQS });
