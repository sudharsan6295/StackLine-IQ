"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-24 text-center sm:px-6">
      <AlertTriangle className="size-10 text-destructive" aria-hidden="true" />
      <h1 className="mt-4 font-display text-2xl font-bold">
        Something went wrong
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        The registry hit an unexpected error loading this page. Try again, or
        head back to the homepage.
      </p>
      <div className="mt-6 flex gap-3">
        <Button onClick={reset} className="rounded-sm">
          Try again
        </Button>
        <Button variant="outline" asChild className="rounded-sm">
          <Link href="/">Back to registry</Link>
        </Button>
      </div>
    </div>
  );
}
