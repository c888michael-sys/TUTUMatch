const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

type IconProps = { s?: number; className?: string };

export const ArrowIcon = ({ s = 16, className = "arr" }: IconProps) => (
  <svg className={className} width={s} height={s} viewBox="0 0 24 24" {...stroke} aria-hidden="true">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export const LockIcon = ({ s = 12 }: IconProps) => (
  <svg width={s} height={s} viewBox="0 0 24 24" {...stroke} aria-hidden="true">
    <rect x="4" y="11" width="16" height="10" rx="1.5" />
    <path d="M8 11V8a4 4 0 018 0v3" />
  </svg>
);

export const UnlockIcon = ({ s = 28 }: IconProps) => (
  <svg width={s} height={s} viewBox="0 0 24 24" {...stroke} aria-hidden="true">
    <rect x="4" y="11" width="16" height="10" rx="1.5" />
    <path d="M8 11V8a4 4 0 017.5-1" />
  </svg>
);

export const DiscountIcon = ({ s = 28 }: IconProps) => (
  <svg width={s} height={s} viewBox="0 0 24 24" {...stroke} aria-hidden="true">
    <path d="M19 5L5 19" />
    <circle cx="8" cy="8" r="2" />
    <circle cx="16" cy="16" r="2" />
  </svg>
);

export const HandshakeIcon = ({ s = 28 }: IconProps) => (
  <svg width={s} height={s} viewBox="0 0 24 24" {...stroke} aria-hidden="true">
    <path d="M3 12l4-4 5 5-4 4z" />
    <path d="M12 13l3-3 5 5-3 3z" />
    <path d="M9 9l2-2" />
  </svg>
);

export const ShieldIcon = ({ s = 28 }: IconProps) => (
  <svg width={s} height={s} viewBox="0 0 24 24" {...stroke} aria-hidden="true">
    <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z" />
    <path d="M9 12l2 2 4-4" />
  </svg>
);

export const IdIcon = ({ s = 28 }: IconProps) => (
  <svg width={s} height={s} viewBox="0 0 24 24" {...stroke} aria-hidden="true">
    <rect x="3" y="6" width="18" height="13" rx="1.5" />
    <circle cx="9" cy="12" r="2.2" />
    <path d="M14 11h4M14 14h3" />
  </svg>
);

export const DocIcon = ({ s = 28 }: IconProps) => (
  <svg width={s} height={s} viewBox="0 0 24 24" {...stroke} aria-hidden="true">
    <path d="M6 4h9l5 5v11H6z" />
    <path d="M14 4v6h6" />
    <path d="M9 14h6M9 17h4" />
  </svg>
);

export const UserIcon = ({ s = 28 }: IconProps) => (
  <svg width={s} height={s} viewBox="0 0 24 24" {...stroke} aria-hidden="true">
    <circle cx="12" cy="9" r="3.2" />
    <path d="M5 20c1.5-3 4-4.5 7-4.5s5.5 1.5 7 4.5" />
  </svg>
);
