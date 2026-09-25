"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useHasMounted } from "@/lib/use-has-mounted";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useHasMounted();
  const isDark = mounted && resolvedTheme === "dark";

  return (
    <Button
      variant="outline"
      size="icon"
      aria-label="Toggle theme"
      className="size-8 shrink-0 rounded-sm"
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {isDark ? (
        <Sun className="size-4" aria-hidden="true" />
      ) : (
        <Moon className="size-4" aria-hidden="true" />
      )}
    </Button>
  );
}
