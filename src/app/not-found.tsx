import type { Metadata } from "next";
import Link from "next/link";
import { Compass } from "lucide-react";

export const metadata: Metadata = {
  title: "Page not found",
  description:
    "This page doesn't exist — the tool or function you're looking for may have been renamed or removed.",
};

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-24 text-center sm:px-6">
      <span className="gradient-bg flex size-14 items-center justify-center rounded-2xl font-data text-sm font-bold text-white">
        404
      </span>
      <h1 className="mt-4 font-display text-2xl font-extrabold">
        Page not found
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        This page doesn&apos;t exist — the tool or function you&apos;re looking
        for may have been renamed or removed.
      </p>
      <Link
        href="/"
        className="gradient-bg mt-6 inline-flex h-10 items-center gap-2 rounded-full px-5 text-sm font-semibold text-white hover:opacity-90"
      >
        <Compass className="size-4" aria-hidden="true" />
        Back to StacklineIQ
      </Link>
    </div>
  );
}
