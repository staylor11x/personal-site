import type { Metadata } from "next";
import { IBM_Plex_Mono, Inter } from "next/font/google";
import type { ReactNode } from "react";
import { getContactContent } from "../lib/content";
import { SiteContainer, SurfaceCard } from "./components/site-primitives";
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
  { href: "#hero", label: "Hero" },
  { href: "#about", label: "About" },
  { href: "#terminal", label: "Terminal" },
  { href: "#featured-work", label: "Featured work" },
  { href: "#contact", label: "Contact" },
] as const;

export default function RootLayout({ children }: RootLayoutProps) {
  const contact = getContactContent();
  return (
    <html lang="en">
      <body className={[bodyFont.variable, monoFont.variable, "font-sans", "antialiased"].join(" ")}>
        <a
          href="#main-content"
          className="absolute left-4 top-4 z-50 -translate-y-20 border border-border-strong bg-bg-elevated px-4 py-2 text-sm text-foreground transition-transform focus:translate-y-0"
        >
          Skip to content
        </a>
        <div className="flex min-h-screen flex-col">
          <header className="sticky top-0 z-40 py-4">
            <SiteContainer>
              <SurfaceCard className="flex flex-col gap-4 px-4 py-4 sm:px-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <a href="#hero" className="technical-label text-sm text-foreground">
                    Personal site
                  </a>
                  <nav aria-label="Primary" className="w-full sm:w-auto">
                    <ul className="flex flex-wrap gap-2">
                      {primaryNavItems.map((item) => (
                        <li key={item.href}>
                          <a
                            href={item.href}
                            className="inline-flex min-h-10 items-center border border-border-subtle bg-bg-elevated/70 px-4 py-2 text-sm text-foreground-muted transition-colors hover:border-accent-cyan/50 hover:text-foreground"
                          >
                            {item.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </nav>
                </div>
              </SurfaceCard>
            </SiteContainer>
          </header>
          <main id="main-content" className="flex-1 pb-12 pt-4">
            {children}
          </main>
          <footer id="contact" className="pb-8 pt-4">
            <SiteContainer>
              <SurfaceCard className="flex flex-col gap-5 px-5 py-6 sm:flex-row sm:items-end sm:justify-between">
                <div className="space-y-2">
                  <p className="technical-label text-xs text-accent-magenta">Contact</p>
                  <p className="max-w-2xl text-sm text-foreground-muted">{contact.tagline}</p>
                </div>
                <ul className="flex flex-wrap gap-2">
                  {contact.links.map((link) => (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        target={link.href.startsWith("http") ? "_blank" : undefined}
                        rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                        className="inline-flex min-h-10 items-center border border-border-subtle bg-bg-elevated/70 px-4 py-2 text-sm text-foreground-muted transition-colors hover:border-accent-cyan/50 hover:text-foreground"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </SurfaceCard>
            </SiteContainer>
          </footer>
        </div>
      </body>
    </html>
  );
}
