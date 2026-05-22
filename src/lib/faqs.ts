export type Faq = { tag: "parents" | "tutors"; q: string; a: string };

export const FAQS: Faq[] = [
  {
    tag: "parents",
    q: "Is it really free for parents?",
    a: "Yes — completely. No signup, no per-match fee, no commission. TUTUMatch is a directory. Browse, click 'I want this tutor' to see their contact details, and reach out directly. Whatever you arrange with the tutor (rate, schedule, payment) is between you two.",
  },
  {
    tag: "parents",
    q: "How are tutors checked?",
    a: "TUTUMatch is a directory, not a verification service. Listings are tutor-provided. Each tutor self-declares a Working With Children Check (WWCC) and ID, and the platform asks them to keep those details ready to share with you on request. Before any lesson, please verify the tutor's WWCC yourself — it takes 30 seconds and is free at the NSW Office of the Children's Guardian online lookup. We don't display a 'verified' badge, because we don't perform the check.",
  },
  {
    tag: "parents",
    q: "What happens after I contact a tutor?",
    a: "You and the tutor talk directly — email, phone, whatever you prefer. TUTUMatch isn't in the middle of that conversation. Arrange rate, schedule, lesson location yourselves. If you both go ahead with a lesson, the tutor reports the match to us so commission is settled — no work for you.",
  },
  {
    tag: "parents",
    q: "Can I contact multiple tutors?",
    a: "Yes. Every contact reveal is free. Talk to as many as you like and pick the one that fits.",
  },
  {
    tag: "parents",
    q: "Is the platform responsible for the quality of lessons?",
    a: "No. We're a classifieds directory. Listings are user-provided and the lesson itself is a private arrangement between you and the tutor. We don't verify, vet, or screen tutors and we don't sit in on lessons. Treat this like you'd treat any local directory — check the tutor, ask questions, verify their WWCC.",
  },
  {
    tag: "parents",
    q: "Online or in-person?",
    a: "Both. Each tutor sets their own availability — most do both. Filter by mode when browsing.",
  },
  {
    tag: "tutors",
    q: "What does it really cost to list?",
    a: "Listing is free, forever. Your first confirmed student is also free. From your second student onwards, we charge a flat $20 commission per confirmed match. That's the only money that ever moves between you and the platform.",
  },
  {
    tag: "tutors",
    q: "What's TUTUMatch Permanent?",
    a: "A $60 one-time upgrade that turns off per-match commission for good. Pays for itself at your 4th confirmed student. Refundable within 14 days, no questions asked.",
  },
  {
    tag: "tutors",
    q: "What stops tutors from hiding matches to dodge the commission?",
    a: "A few things. The parent gets a 'did you have a lesson with [tutor]?' email at the 48-hour mark; if they say yes and you said no, that's a strike. Three strikes and your profile is permanently hidden. And bank-transfer screenshots from the parent are easy evidence in any dispute.",
  },
  {
    tag: "tutors",
    q: "When and how do you and the parent settle payment?",
    a: "Directly between you, however you arrange it — bank transfer, cash, PayID, your call. TUTUMatch isn't in the loop after the introduction.",
  },
  {
    tag: "tutors",
    q: "GST and receipts?",
    a: "We issue you a tax invoice for each platform commission charge (or for Permanent). Your lesson income from parents is yours to declare as you would any tutoring work.",
  },
];
