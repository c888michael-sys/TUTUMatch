import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TUTUMatch — Find a local NSW tutor",
  description:
    "A free NSW tutor directory. Parents browse and contact tutors for free. Tutors list free and pay only when a confirmed student comes through.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-AU">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <a href="#main-content" className="skip-link">Skip to main content</a>
        <div id="main-content">{children}</div>
      </body>
    </html>
  );
}
