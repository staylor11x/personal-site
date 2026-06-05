import fs from "fs";
import path from "path";
import matter from "gray-matter";

const contentDir = path.join(process.cwd(), "content");

function readContent(filename: string) {
  const raw = fs.readFileSync(path.join(contentDir, filename), "utf8");
  return matter(raw);
}

// small runtime helpers
function assertShape(condition: boolean, message: string): asserts condition {
  if (!condition) throw new Error(message);
}
function isString(v: unknown): v is string {
  return typeof v === "string";
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
  const d: any = data ?? {};
  const missing: string[] = [];

  if (!isString(d.name)) missing.push("name");
  if (!isString(d.role)) missing.push("role");
  if (!isString(d.subheading)) missing.push("subheading");

  if (!Array.isArray(d.cta)) missing.push("cta");
  else {
    d.cta.forEach((c: any, idx: number) => {
      if (!isString(c?.label)) missing.push(`cta[${idx}].label`);
      if (!isString(c?.href)) missing.push(`cta[${idx}].href`);
      if (!(c?.variant === "primary" || c?.variant === "secondary")) missing.push(`cta[${idx}].variant`);
    });
  }

  assertShape(missing.length === 0, `Invalid hero.md frontmatter — missing/invalid: ${missing.join(", ")}`);
  return d as HeroContent;
}

// ── About ────────────────────────────────────────────────────────────────────

export type AboutContent = {
  eyebrow: string;
  heading: string;
  paragraphs: string[];
  contact?: { label: string; href: string };
};

export function getAboutContent(): AboutContent {
  const { data, content } = readContent("about.md");
  const paragraphs = content
    .replace(/\r\n/g, "\n")
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
  const d: any = data ?? {};
  const missing: string[] = [];

  if (!isString(d.eyebrow)) missing.push("eyebrow");
  if (!isString(d.heading)) missing.push("heading");
  if (!Array.isArray(d.items)) missing.push("items");
  else {
    d.items.forEach((it: any, idx: number) => {
      if (!isString(it?.title)) missing.push(`items[${idx}].title`);
      if (!isString(it?.description)) missing.push(`items[${idx}].description`);
      if (it?.href !== undefined && !isString(it.href)) missing.push(`items[${idx}].href`);
    });
  }

  assertShape(missing.length === 0, `Invalid featured-work.md frontmatter — missing/invalid: ${missing.join(", ")}`);
  return d as FeaturedWorkContent;
}

// ── Currently ─────────────────────────────────────────────────────────────────

export type CurrentlyContent = {
  learning: string[];
  listening: string[];
  building: string[];
};

export function getCurrentlyContent(): CurrentlyContent {
  const { data } = readContent("currently.md");
  const d: any = data ?? {};
  return {
    learning: Array.isArray(d.learning) ? d.learning : [],
    listening: Array.isArray(d.listening) ? d.listening : [],
    building: Array.isArray(d.building) ? d.building : [],
  };
}

// ── Now Playing ───────────────────────────────────────────────────────────────

export type NowPlayingContent = {
  track: string;
  artist: string;
  album: string;
  albumArt: string;
  spotifyUrl: string;
};

export function getNowPlayingContent(): NowPlayingContent {
  const { data } = readContent("now-playing.md");
  const d: any = data ?? {};
  return {
    track: isString(d.track) ? d.track : "Unknown Track",
    artist: isString(d.artist) ? d.artist : "Unknown Artist",
    album: isString(d.album) ? d.album : "",
    albumArt: isString(d.albumArt) ? d.albumArt : "",
    spotifyUrl: isString(d.spotifyUrl) ? d.spotifyUrl : "",
  };
}

// ── Travel ────────────────────────────────────────────────────────────────────

export type Location = {
  name: string;
  lat: number;
  lng: number;
};

export type Journey = {
  year: string;
  destination: string;
  lat: number;
  lng: number;
  locations?: Location[];
};

export type TravelContent = {
  countriesVisited: number;
  journeys: Journey[];
};

export function getTravelContent(): TravelContent {
  const { data } = readContent("travel.md");
  const d: any = data ?? {};
  return {
    countriesVisited: typeof d.countriesVisited === "number" ? d.countriesVisited : 0,
    journeys: Array.isArray(d.journeys)
      ? d.journeys.map((j: any) => ({
          year: isString(j?.year) ? j.year : "",
          destination: isString(j?.destination) ? j.destination : "",
          lat: typeof j?.lat === "number" ? j.lat : 0,
          lng: typeof j?.lng === "number" ? j.lng : 0,
          locations: Array.isArray(j?.locations)
            ? j.locations.map((l: any) => ({
                name: isString(l?.name) ? l.name : "",
                lat: typeof l?.lat === "number" ? l.lat : 0,
                lng: typeof l?.lng === "number" ? l.lng : 0,
              }))
            : undefined,
        }))
      : [],
  };
}



export type ContactLink = {
  label: string;
  href: string;
};

export type ContactContent = {
  tagline: string;
  links: ContactLink[];
};

// ── Contact ────────────────────────────────────────────────────────────────────

export function getContactContent(): ContactContent {
  const { data } = readContent("contact.md");
  const d: any = data ?? {};
  const missing: string[] = [];

  if (!isString(d.tagline)) missing.push("tagline");
  if (!Array.isArray(d.links)) missing.push("links");
  else {
    d.links.forEach((l: any, idx: number) => {
      if (!isString(l?.label)) missing.push(`links[${idx}].label`);
      if (!isString(l?.href)) missing.push(`links[${idx}].href`);
    });
  }

  assertShape(missing.length === 0, `Invalid contact.md frontmatter — missing/invalid: ${missing.join(", ")}`);
  return d as ContactContent;
}

// ── Terminal ──────────────────────────────────────────────────────────────────

export type TerminalContent = {
  now: string[];
  travel: string[];
  whoami: string[];
  contact: string[];
};

/** Returns pre-formatted plain-text lines for terminal commands. No HTML. */
export function getTerminalContent(): TerminalContent {
  const currently = getCurrentlyContent();
  const travelData = getTravelContent();
  const about = getAboutContent();
  const contactData = getContactContent();

  const now: string[] = [
    "── CURRENTLY ─────────────────────",
    ...(currently.learning.length
      ? ["learning:", ...currently.learning.map((x) => `  · ${x}`)]
      : []),
    ...(currently.listening.length
      ? ["listening:", ...currently.listening.map((x) => `  · ${x}`)]
      : []),
    ...(currently.building.length
      ? ["building:", ...currently.building.map((x) => `  · ${x}`)]
      : []),
  ];

  const travel: string[] = [
    `── TRAVEL ────────────────────────`,
    `countries visited: ${travelData.countriesVisited}`,
    "",
    "recent journeys:",
    ...travelData.journeys.map((j) => `  ${j.year}  ${j.destination}`),
  ];

  const whoami: string[] = [
    "── WHOAMI ────────────────────────",
    ...about.paragraphs.slice(0, 2),
  ];

  const contact: string[] = [
      `── Contact ────────────────────────`,
      `${contactData.tagline}`,
      "",
      ...contactData.links.map((j) => `  ${j.label} ${j.href}`),
  ];

  return { now, travel, whoami, contact };
}
