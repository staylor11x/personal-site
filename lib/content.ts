import fs from "fs";
import path from "path";
import matter from "gray-matter";

const contentDir = path.join(process.cwd(), "content");

function readContent(filename: string) {
  const raw = fs.readFileSync(path.join(contentDir, filename), "utf8");
  return matter(raw);
}

// ── Hero ────────────────────────────────────────────────────────────────────

export type CtaItem = {
  label: string;
  href: string;
  variant: "primary" | "secondary";
};

export type HeroContent = {
  name: string;
  role: string;
  subheading: string;
  cta: CtaItem[];
};

export function getHeroContent(): HeroContent {
  const { data } = readContent("hero.md");
  return data as HeroContent;
}

// ── About ────────────────────────────────────────────────────────────────────

export type AboutContent = {
  eyebrow: string;
  heading: string;
  paragraphs: string[];
  contact: { label: string; href: string };
};

export function getAboutContent(): AboutContent {
  const { data, content } = readContent("about.md");
  const paragraphs = content
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);
  return { ...(data as Omit<AboutContent, "paragraphs">), paragraphs };
}

// ── Featured work ────────────────────────────────────────────────────────────

export type FeaturedWorkItem = {
  title: string;
  description: string;
  href?: string;
};

export type FeaturedWorkContent = {
  eyebrow: string;
  heading: string;
  items: FeaturedWorkItem[];
};

export function getFeaturedWorkContent(): FeaturedWorkContent {
  const { data } = readContent("featured-work.md");
  return data as FeaturedWorkContent;
}
