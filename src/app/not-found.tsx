import Link from "next/link";
import { Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-24 text-center sm:px-6">
      <span className="flex size-12 items-center justify-center rounded-sm border border-line font-data text-sm font-semibold">
        404
      </span>
      <h1 className="mt-4 font-display text-2xl font-bold">Page not found</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        This page doesn&apos;t exist — the tool or function you&apos;re looking
        for may have been renamed or removed.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex h-10 items-center gap-2 rounded-sm bg-primary px-4 text-sm font-medium text-primary-foreground hover:opacity-90"
      >
        <Compass className="size-4" aria-hidden="true" />
        Back to the registry
      </Link>
    </div>
  );
}
