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
      <div className="panel-surface overflow-hidden">
        <div className="flex items-center justify-between border-b border-border-subtle bg-bg-elevated/40 px-5 py-3">
          <p className="technical-label text-xs text-accent-cyan">{eyebrow}</p>
          <span className="technical-label text-xs text-foreground-muted/30" aria-hidden="true">▸</span>
        </div>
        <div className={cx("space-y-6 p-6 sm:p-8", className)}>
          <div className="space-y-2">
            <h2 id={`${id}-title`} className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              {title}
            </h2>
            {description && (
              <p className="max-w-3xl text-sm leading-7 text-foreground-muted sm:text-base">{description}</p>
            )}
          </div>
          {children}
        </div>
      </div>
    </section>
  );
}
