"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Search, Menu, X } from "lucide-react";
import { navLinks, siteConfig } from "@/lib/site-config";
import { LogoMark } from "@/components/logo-mark";
import { cn } from "cn";

export function SiteHeader() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="gradient-bg h-[2px] w-full" aria-hidden="true" />
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-4 sm:px-6">
        <Link
          href="/about"
          className="group flex shrink-0 items-center gap-2"
          aria-label={`About ${siteConfig.name}`}
        >
          <LogoMark className="h-8 w-8 shrink-0 transition-transform group-hover:scale-105" />
          <span className="font-logo text-2xl font-black tracking-tight">
            <span className="text-foreground">Stackline</span>
            <span className="text-signal">IQ</span>
          </span>
        </Link>

        <nav
          className="hidden flex-1 items-center justify-center gap-1 sm:flex"
          aria-label="Primary"
        >
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
                  "rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors",
                  active
                    ? "gradient-bg text-white shadow-sm"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground",
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
            className="hidden items-center gap-2 rounded-full border border-line bg-secondary/50 px-3.5 py-1.5 text-sm text-muted-foreground transition-all hover:border-signal/40 hover:text-foreground hover:shadow-sm sm:flex"
            aria-label="Open search (Cmd+K)"
          >
            <Search className="size-3.5 text-signal" aria-hidden="true" />
            Search
            <kbd className="ml-1 rounded-full border border-line bg-background px-1.5 font-data text-[0.65rem]">
              ⌘K
            </kbd>
          </button>
          <button
            type="button"
            className="flex size-8 items-center justify-center rounded-full border border-line transition-colors hover:border-signal/40 sm:hidden"
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
