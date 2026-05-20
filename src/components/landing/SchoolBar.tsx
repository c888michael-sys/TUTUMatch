import Link from "next/link";
import { DEFAULT_SCHOOL, OTHER_AREA_SCHOOL, SCHOOLS, type School } from "@/lib/schools";

export function SchoolBar({ current }: { current: School }) {
  const all = [DEFAULT_SCHOOL, ...SCHOOLS, OTHER_AREA_SCHOOL];
  return (
    <div className="schoolbar">
      <div className="schoolbar-inner reveal">
        <div className="sb-l">
          <span className="sb-tag">Showing tutors for</span>
          <span className="sb-school">
            {current.name}
            <span className="m">/ {current.tagline}</span>
          </span>
        </div>
        <div className="sb-r" role="tablist" aria-label="Switch school">
          <span className="sb-tag">Switch</span>
          {all.map((s) => {
            const href = s.id === "default" ? "/" : `/schools/${s.id}`;
            const isActive = s.id === current.id;
            return (
              <Link
                key={s.id}
                role="tab"
                aria-selected={isActive}
                className={`sb-chip ${isActive ? "active" : ""}`}
                href={href}
              >
                {s.short}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
