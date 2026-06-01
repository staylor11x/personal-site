"use client";

import { useEffect, useState } from "react";
import type { NowPlayingContent } from "../../lib/content";
import { HudPanel, HudPanelHeader } from "./site-primitives";

type NowPlayingPanelProps = {
  content?: NowPlayingContent;
};

type NowPlayingApiResponse = {
  playing: boolean;
  track?: string;
  artist?: string;
  album?: string;
  albumArt?: string;
  spotifyUrl?: string;
};

export default function NowPlayingPanel({ content }: NowPlayingPanelProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<NowPlayingApiResponse | null>(null);

  useEffect(() => {
    const base = process.env.NEXT_PUBLIC_API_URL;
    if (!base) {
      setError("API URL not configured");
      setLoading(false);
      return;
    }
    const url = `${base.replace(/\/+$/, "")}/api/now-playing`;

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((json: unknown) => {
        // Basic runtime shape checks
        if (typeof json === "object" && json !== null && "playing" in (json as any)) {
          setData(json as NowPlayingApiResponse);
        } else {
          throw new Error("Unexpected response shape");
        }
      })
      .catch((err) => {
        // Do not crash — show fallback
        // eslint-disable-next-line no-console
        console.error("NowPlaying fetch failed:", err);
        setError("Unable to load now playing");
      })
      .finally(() => setLoading(false));
  }, []);

  const effective =
    data ??
    (content
      ? {
          playing: true,
          track: content.track,
          artist: content.artist,
          album: content.album,
          albumArt: content.albumArt,
          spotifyUrl: content.spotifyUrl,
        }
      : null);

  return (
    <section id="music" aria-labelledby="music-title" className="scroll-mt-24">
      <HudPanel accentColor="pink">
        <HudPanelHeader
          label="// NOW PLAYING"
          accentColor="pink"
          right={
            <span className="flex items-center gap-1 text-accent-green">
              <span className="inline-block h-1.5 w-1.5 bg-accent-green" aria-hidden="true" />
              LIVE
            </span>
          }
        />
        <div className="p-5">
          <h2 id="music-title" className="sr-only">
            Now Playing
          </h2>

          <div className="flex gap-4 items-center">
            {/* Album art */}
            <div className="h-16 w-16 flex-shrink-0 border border-border-subtle bg-bg-elevated">
              {loading ? (
                <div
                  className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-200 to-gray-100 animate-pulse"
                  aria-hidden="true"
                >
                  <span className="text-2xl text-foreground-muted/20">—</span>
                </div>
              ) : error ? (
                <div className="flex h-full w-full items-center justify-center">
                  <span className="text-sm text-foreground-muted/60">?</span>
                </div>
              ) : effective && effective.playing && effective.albumArt ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={effective.albumArt} alt="Album art" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <span className="text-2xl text-foreground-muted/20">♫</span>
                </div>
              )}
            </div>

            {/* Track info */}
            <div className="flex min-w-0 flex-col justify-center gap-1">
              {loading ? (
                <p className="text-sm font-medium text-foreground">—</p>
              ) : error ? (
                <p className="text-sm font-medium text-foreground">Unavailable</p>
              ) : effective ? (
                effective.playing ? (
                  <>
                    <p className="truncate text-sm font-medium text-foreground">{effective.track}</p>
                    <p className="truncate font-mono text-xs text-foreground-muted/70">{effective.artist}</p>
                    {effective.album && (
                      <p className="truncate font-mono text-[10px] text-foreground-muted/40">{effective.album}</p>
                    )}
                  </>
                ) : (
                  <p className="text-sm font-medium text-foreground">Nothing playing</p>
                )
              ) : (
                <p className="text-sm font-medium text-foreground">Nothing playing</p>
              )}
            </div>
          </div>

          {/* Decorative progress + controls retained when playing */}
          {!loading && !error && effective && effective.playing && (
            <>
              <div className="mt-4 space-y-1">
                <div className="relative h-1 w-full bg-border-subtle">
                  <div
                    className="absolute left-0 top-0 h-full bg-accent-magenta/60"
                    style={{ width: "38%" }}
                    aria-hidden="true"
                  />
                </div>
                <div className="flex justify-between font-mono text-[10px] text-foreground-muted/40">
                  <span>02:14</span>
                  <span>04:48</span>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-center gap-5">
                <button
                  type="button"
                  aria-label="Previous"
                  className="text-foreground-muted/40 transition-colors hover:text-accent-magenta"
                  tabIndex={-1}
                >
                  ⏮
                </button>
                <button
                  type="button"
                  aria-label="Pause"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-accent-magenta/40 text-accent-magenta transition-all hover:border-accent-magenta hover:shadow-[0_0_10px_rgba(255,46,138,0.3)]"
                  tabIndex={-1}
                >
                  ⏸
                </button>
                <button
                  type="button"
                  aria-label="Next"
                  className="text-foreground-muted/40 transition-colors hover:text-accent-magenta"
                  tabIndex={-1}
                >
                  ⏭
                </button>
              </div>

              {effective.spotifyUrl && (
                <p className="mt-4 text-center">
                  <a
                    href={effective.spotifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="technical-label text-[10px] text-foreground-muted/40 transition-colors hover:text-accent-magenta"
                  >
                    &gt; OPEN IN SPOTIFY
                  </a>
                </p>
              )}
            </>
          )}

          {/* Fallback note */}
          <p className="mt-3 text-center font-mono text-[10px] text-foreground-muted/30">SPOTIFY INTEGRATION — PHASE 5</p>
        </div>
      </HudPanel>
    </section>
  );
}
