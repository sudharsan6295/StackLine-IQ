import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import { stats } from "@/lib/data";

export function SiteFooter() {
  return (
    <footer className="border-t border-line py-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-center gap-2 font-data text-xs text-muted-foreground">
          <span>{siteConfig.name}</span>
          <span aria-hidden="true">·</span>
          <span>
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
          <Link href="/stack-builder" className="hover:text-foreground">
            Stack Builder
          </Link>
          <a href="/sitemap.xml" className="hover:text-foreground">
            Sitemap
          </a>
        </nav>
      </div>
    </footer>
  );
}
