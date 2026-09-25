"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Search, Menu, X } from "lucide-react";
import { navLinks, siteConfig } from "@/lib/site-config";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "cn";

export function SiteHeader() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-4 sm:px-6">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2"
          aria-label={`${siteConfig.name} — home`}
        >
          <span className="flex size-7 items-center justify-center rounded-sm border border-foreground/20 font-data text-[0.65rem] font-bold tracking-tight">
            AI
          </span>
          <span className="font-display text-[0.95rem] font-semibold tracking-tight">
            {siteConfig.shortName}
          </span>
        </Link>

        <nav className="hidden items-center gap-1 sm:flex" aria-label="Primary">
          {navLinks.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-sm px-3 py-1.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={() =>
              document.dispatchEvent(
                new KeyboardEvent("keydown", { key: "k", metaKey: true }),
              )
            }
            className="hidden items-center gap-2 rounded-sm border border-line bg-secondary/50 px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground sm:flex"
            aria-label="Open search (Cmd+K)"
          >
            <Search className="size-3.5" aria-hidden="true" />
            Search
            <kbd className="ml-1 rounded-xs border border-line bg-background px-1 font-data text-[0.65rem]">
              ⌘K
            </kbd>
          </button>
          <ThemeToggle />
          <button
            type="button"
            className="flex size-8 items-center justify-center rounded-sm border border-line sm:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((o) => !o)}
          >
            {mobileOpen ? (
              <X className="size-4" />
            ) : (
              <Menu className="size-4" />
            )}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav
          className="border-t border-line px-4 py-3 sm:hidden"
          aria-label="Primary mobile"
        >
          <ul className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-sm px-3 py-2 text-sm font-medium hover:bg-secondary"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
