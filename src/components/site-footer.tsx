import Link from "next/link";
import { LogoMark } from "@/components/logo-mark";
import { siteConfig } from "@/lib/site-config";
import { stats } from "@/lib/data";

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-secondary/30 py-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-5 px-4 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <LogoMark className="h-5 w-5 shrink-0" />
            <span className="font-data text-xs text-muted-foreground">
              <span className="font-semibold text-foreground">
                {siteConfig.name}
              </span>
              <span className="mx-2 text-line" aria-hidden="true">
                ·
              </span>
              {stats.functionCount} functions · {stats.toolCount} tools tracked
            </span>
          </div>
          <nav
            className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground"
            aria-label="Footer"
          >
            <Link href="/governance" className="hover:text-foreground">
              Governance
            </Link>
            <Link href="/about" className="hover:text-foreground">
              About
            </Link>
            <Link href="/privacy" className="hover:text-foreground">
              Privacy
            </Link>
          </nav>
        </div>
        <p className="font-data text-[0.7rem] text-muted-foreground/70">
          © {new Date().getFullYear()} {siteConfig.name}. Pricing sourced and
          re-verified regularly — see each tool&apos;s checked date.
        </p>
      </div>
    </footer>
  );
}
