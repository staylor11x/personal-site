import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

type ClassValue = string | undefined;

function cx(...classes: ClassValue[]) {
  return classes.filter(Boolean).join(" ");
}

type SiteContainerProps = {
  children: ReactNode;
  className?: string;
};

export function SiteContainer({ children, className }: SiteContainerProps) {
  return <div className={cx("mx-auto w-full max-w-6xl px-[var(--site-space-gutter)]", className)}>{children}</div>;
}

type SurfaceCardProps = {
  as?: ElementType;
  children: ReactNode;
  className?: string;
} & ComponentPropsWithoutRef<"div">;

export function SurfaceCard({ as: Component = "div", children, className, ...props }: SurfaceCardProps) {
  return (
    <Component className={cx("panel-surface", className)} {...props}>
      {children}
    </Component>
  );
}

type HudPanelProps = {
  children: ReactNode;
  className?: string;
  accentColor?: "cyan" | "pink" | "green";
};

/** Panel with HUD-style corner bracket accents. */
export function HudPanel({ children, className, accentColor = "cyan" }: HudPanelProps) {
  const corner =
    accentColor === "pink"
      ? "border-accent-magenta/60"
      : accentColor === "green"
        ? "border-accent-green/60"
        : "border-accent-cyan/50";

  return (
    <div className={cx("hud-panel overflow-hidden", className)}>
      {/* Corner brackets */}
      <span className={cx("pointer-events-none absolute left-0 top-0 h-4 w-4 border-l border-t", corner)} aria-hidden="true" />
      <span className={cx("pointer-events-none absolute right-0 top-0 h-4 w-4 border-r border-t", corner)} aria-hidden="true" />
      <span className={cx("pointer-events-none absolute bottom-0 left-0 h-4 w-4 border-b border-l", corner)} aria-hidden="true" />
      <span className={cx("pointer-events-none absolute bottom-0 right-0 h-4 w-4 border-b border-r", corner)} aria-hidden="true" />
      {children}
    </div>
  );
}

type HudPanelHeaderProps = {
  label: string;
  right?: ReactNode;
  accentColor?: "cyan" | "pink" | "green";
};

export function HudPanelHeader({ label, right, accentColor = "cyan" }: HudPanelHeaderProps) {
  const labelColor =
    accentColor === "pink"
      ? "text-accent-magenta"
      : accentColor === "green"
        ? "text-accent-green"
        : "text-accent-cyan";

  return (
    <div className="flex items-center justify-between border-b border-border-subtle bg-bg-elevated/40 px-4 py-2.5">
      <span className={cx("technical-label text-xs", labelColor)}>{label}</span>
      {right && <div className="technical-label text-xs text-foreground-muted/50">{right}</div>}
    </div>
  );
}

type SiteSectionProps = {
  id: string;
  eyebrow: string;
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
};

export function SiteSection({ id, eyebrow, title, description, children, className }: SiteSectionProps) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-28">
      <HudPanel>
        <HudPanelHeader label={eyebrow} right="▸" />
        <div className={cx("space-y-6 p-6 sm:p-8", className)}>
          <div className="space-y-2">
            <h2
              id={`${id}-title`}
              className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {title}
            </h2>
            {description && (
              <p className="max-w-3xl text-sm leading-7 text-foreground-muted sm:text-base">{description}</p>
            )}
          </div>
          {children}
        </div>
      </HudPanel>
    </section>
  );
}
