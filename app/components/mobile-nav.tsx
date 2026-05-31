"use client";

import { useEffect, useRef, useState } from "react";

type NavItem = {
  href: string;
  label: string;
  num: string;
};

type MobileNavProps = {
  items: NavItem[];
};

export default function MobileNav({ items }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open]);

  return (
    <div className="relative md:hidden">
      {/* Hamburger button */}
      <button
        ref={buttonRef}
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls="mobile-nav-menu"
        onClick={() => setOpen((v) => !v)}
        className="flex h-8 w-8 flex-col items-center justify-center gap-1.5 border border-border-subtle bg-bg-elevated/50 transition-colors hover:border-accent-cyan/50 hover:text-accent-cyan"
      >
        <span
          className={`block h-px w-4 bg-current transition-transform duration-200 ${open ? "translate-y-[5px] rotate-45" : ""}`}
        />
        <span
          className={`block h-px w-4 bg-current transition-opacity duration-200 ${open ? "opacity-0" : ""}`}
        />
        <span
          className={`block h-px w-4 bg-current transition-transform duration-200 ${open ? "-translate-y-[5px] -rotate-45" : ""}`}
        />
      </button>

      {/* Dropdown menu */}
      {open && (
        <div
          id="mobile-nav-menu"
          ref={menuRef}
          className="absolute right-0 top-full mt-1 w-48 border border-border-subtle bg-bg-elevated/95 backdrop-blur-md"
        >
          <ul className="py-1">
            {items.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex min-h-10 items-center gap-2 border-b border-border-subtle/50 px-4 py-2 text-xs text-foreground-muted transition-colors last:border-b-0 hover:bg-accent-cyan/5 hover:text-accent-cyan"
                  style={{ fontFamily: "var(--font-label)" }}
                >
                  <span className="text-accent-cyan/40">{item.num}_</span>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
