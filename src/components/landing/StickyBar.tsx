"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export function StickyBar() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.85);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`stickybar ${show ? "show" : ""}`}>
      <div className="wordmark">
        <span className="tm-dot" />
        TutMatch
      </div>
      <div className="ctas">
        <a className="btn ghost" href="#how-20-works">
          How it works
        </a>
        <Link className="btn ink" href="/tutor/signup">
          List for free
        </Link>
        <Link className="btn brand" href="/browse">
          Find a tutor
        </Link>
      </div>
    </header>
  );
}
