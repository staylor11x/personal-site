import type { Metadata } from "next";
import { IBM_Plex_Mono, Inter } from "next/font/google";
import type { ReactNode } from "react";
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

export const metadata: Metadata = {
  title: "Personal Site",
  description: "Personal site scaffolded with Next.js, TypeScript, and Tailwind CSS.",
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={[bodyFont.variable, monoFont.variable, "font-sans", "antialiased"].join(" ")}>
        {children}
      </body>
    </html>
  );
}
