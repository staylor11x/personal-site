import type { Metadata } from "next";
import { IBM_Plex_Mono, Inter, Orbitron, Rajdhani } from "next/font/google";
import type { ReactNode } from "react";
import { getContactContent } from "../lib/content";
import MobileNav from "./components/mobile-nav";
import { SiteContainer } from "./components/site-primitives";
import StatusBar from "./components/status-bar";
import "./globals.css";

const bodyFont = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
});

const monoFont = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-ui-mono",
});

const headingFont = Orbitron({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
  variable: "--font-heading",
});

const labelFont = Rajdhani({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-label",
});

const _siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_SITE_TITLE ?? "Personal Site",
  description:
    process.env.NEXT_PUBLIC_SITE_DESCRIPTION ??
    "Phase 1 shell for a personal site built with Next.js, TypeScript, and Tailwind CSS.",
  metadataBase: typeof process !== 'undefined' && _siteUrl ? new URL(_siteUrl) : undefined,
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: process.env.NEXT_PUBLIC_SITE_TITLE ?? "Personal Site",
    description:
      process.env.NEXT_PUBLIC_SITE_DESCRIPTION ??
      "Phase 1 shell for a personal site built with Next.js, TypeScript, and Tailwind CSS.",
    url: _siteUrl,
    siteName: process.env.NEXT_PUBLIC_SITE_TITLE ?? "Personal Site",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Personal site social preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: process.env.NEXT_PUBLIC_SITE_TITLE ?? "Personal Site",
    description:
      process.env.NEXT_PUBLIC_SITE_DESCRIPTION ??
      "Phase 1 shell for a personal site built with Next.js, TypeScript, and Tailwind CSS.",
    images: ["/og-image.png"],
  },
};

type RootLayoutProps = {
  children: ReactNode;
};

const primaryNavItems = [
  { href: "#hero", label: "HOME", num: "01" },
  { href: "#about", label: "ABOUT", num: "02" },
  { href: "#now", label: "NOW", num: "03" },
  { href: "#travel", label: "TRAVEL", num: "04" },
  { href: "#music", label: "MUSIC", num: "05" },
  { href: "#terminal", label: "TERMINAL", num: "06" },
] as const;

export default function RootLayout({ children }: RootLayoutProps) {
  const contact = getContactContent();
  return (
    <html lang="en">
      <body
        className={[
          bodyFont.variable,
          monoFont.variable,
          headingFont.variable,
          labelFont.variable,
          "font-sans",
          "antialiased",
        ].join(" ")}
      >
        <a
          href="#main-content"
          className="absolute left-4 top-4 z-50 -translate-y-20 border border-border-strong bg-bg-elevated px-4 py-2 text-sm text-foreground transition-transform focus:translate-y-0"
        >
          Skip to content
        </a>
        <div className="flex min-h-screen flex-col">
          {/* ── Header ─────────────────────────────────────────────── */}
          <header className="sticky top-0 z-40">
            {/* Hot pink top-edge accent line */}
            <div className="h-px w-full bg-gradient-to-r from-transparent via-accent-magenta to-transparent opacity-70" />
            <div className="border-b border-border-subtle bg-bg-elevated/90 backdrop-blur-md">
              <SiteContainer>
                <div className="flex items-center justify-between gap-4 py-3">
                  {/* Branding */}
                  <a href="#hero" className="flex items-baseline gap-2 whitespace-nowrap">
                    <span
                      className="text-sm font-bold tracking-widest text-accent-magenta"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      SCOTT TAYLOR
                    </span>
                    <span className="technical-label text-xs text-foreground-muted/50">
                      // PERSONAL NODE
                    </span>
                  </a>
                  {/* Nav — desktop (md+) */}
                  <nav aria-label="Primary" className="hidden md:block">
                    <ul className="flex flex-wrap gap-1">
                      {primaryNavItems.map((item) => (
                        <li key={item.href}>
                          <a
                            href={item.href}
                            className="inline-flex min-h-8 items-center gap-1 border border-border-subtle bg-bg-elevated/50 px-3 py-1.5 text-xs text-foreground-muted transition-colors hover:border-accent-cyan/50 hover:text-accent-cyan"
                            style={{ fontFamily: "var(--font-label)" }}
                          >
                            <span className="text-accent-cyan/40">{item.num}_</span>
                            {item.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </nav>
                  {/* Nav — mobile (< md) */}
                  <MobileNav items={[...primaryNavItems]} />
                  {/* Contact links */}
                  <ul className="hidden items-center gap-2 lg:flex">
                    {contact.links.map((link) => (
                      <li key={link.href}>
                        <a
                          href={link.href}
                          target={link.href.startsWith("http") ? "_blank" : undefined}
                          rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                          className="technical-label text-xs text-foreground-muted/50 transition-colors hover:text-accent-cyan"
                        >
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </SiteContainer>
            </div>
          </header>

          <main id="main-content" className="flex-1 pb-8 pt-4">
            {children}
          </main>

          {/* ── Status bar replaces old footer ─────────────────────── */}
          <StatusBar />
        </div>
      </body>
    </html>
  );
}
