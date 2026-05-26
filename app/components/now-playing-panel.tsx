import type { NowPlayingContent } from "../../lib/content";
import { HudPanel, HudPanelHeader } from "./site-primitives";

type NowPlayingPanelProps = {
  content: NowPlayingContent;
};

export default function NowPlayingPanel({ content }: NowPlayingPanelProps) {
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
          <div className="flex gap-4">
            {/* Album art placeholder */}
            <div
              className="h-16 w-16 flex-shrink-0 border border-border-subtle bg-bg-elevated"
              aria-hidden="true"
            >
              {content.albumArt ? (
                <img src={content.albumArt} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <span className="text-2xl text-foreground-muted/20">♫</span>
                </div>
              )}
            </div>

            {/* Track info */}
            <div className="flex min-w-0 flex-col justify-center gap-1">
              <p className="truncate text-sm font-medium text-foreground">{content.track}</p>
              <p className="truncate font-mono text-xs text-foreground-muted/70">{content.artist}</p>
              {content.album && (
                <p className="truncate font-mono text-[10px] text-foreground-muted/40">{content.album}</p>
              )}
            </div>
          </div>

          {/* Progress bar (decorative) */}
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

          {/* Transport controls (decorative) */}
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

          {content.spotifyUrl && (
            <p className="mt-4 text-center">
              <a
                href={content.spotifyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="technical-label text-[10px] text-foreground-muted/40 transition-colors hover:text-accent-magenta"
              >
                &gt; OPEN IN SPOTIFY
              </a>
            </p>
          )}

          <p className="mt-3 text-center font-mono text-[10px] text-foreground-muted/30">
            SPOTIFY INTEGRATION — PHASE 5
          </p>
        </div>
      </HudPanel>
    </section>
  );
}
