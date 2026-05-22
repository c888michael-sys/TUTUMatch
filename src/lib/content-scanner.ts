// Content scanner — flags obvious scam / spam / contact-info patterns in
// tutor-supplied text (bios). A flagged listing is sent to spam/abuse review
// instead of being auto-approved. Regex-based and deliberately conservative:
// it catches the obvious stuff, it is not a guarantee. ML can come later.

import { scanForContactInfo } from "./tutor-form";

const SCAM_PATTERNS: { label: string; re: RegExp }[] = [
  {
    label: "payment-bypass language",
    re: /\b(cash[- ]only|pay (me )?(directly|in cash)|off[- ]the[- ]books|bank transfer to me)\b/i,
  },
  {
    label: "outcome guarantee",
    re: /\b(guarantee[ds]?|100\s?%\s?(pass|results?)|band\s?6\s?guaranteed)\b/i,
  },
  {
    label: "crypto / gift-card request",
    re: /\b(bitcoin|cryptocurrency|wire transfer|gift cards?)\b/i,
  },
  {
    label: "off-platform messaging push",
    re: /\b(whats ?app|telegram|wechat|kik|snapchat) me\b/i,
  },
];

// Returns human-readable flags; an empty array means the text looks clean.
export function scanContent(text: string): string[] {
  const flags = [...scanForContactInfo(text)];
  for (const p of SCAM_PATTERNS) {
    if (p.re.test(text)) flags.push(p.label);
  }
  // Shouting is a common spam signal.
  const letters = text.replace(/[^a-zA-Z]/g, "");
  const caps = letters.replace(/[^A-Z]/g, "");
  if (letters.length >= 24 && caps.length / letters.length > 0.6) {
    flags.push("excessive capitals");
  }
  return [...new Set(flags)];
}
