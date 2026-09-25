"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import { defaultFilters, type ToolFilters } from "@/lib/filter-tools";

function parseList(value: string | null): string[] {
  if (!value) return [];
  return value.split(",").filter(Boolean);
}

/**
 * Reads/writes tool filters directly from the URL query string so any
 * filtered view can be copied and shared as a link.
 */
export function useUrlFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filters: ToolFilters = useMemo(
    () => ({
      q: searchParams.get("q") ?? defaultFilters.q,
      functions: parseList(searchParams.get("fn")),
      phases: parseList(searchParams.get("ph")),
      badges: parseList(searchParams.get("badge")),
      maxPrice: searchParams.get("price")
        ? Number(searchParams.get("price"))
        : null,
      enterpriseOnly: searchParams.get("ent") === "1",
    }),
    [searchParams],
  );

  const view =
    (searchParams.get("view") as "function" | "phase" | null) ?? "function";

  const update = useCallback(
    (partial: Partial<ToolFilters> & { view?: "function" | "phase" }) => {
      const params = new URLSearchParams(searchParams.toString());
      const next = { ...filters, ...partial };

      if (next.q) params.set("q", next.q);
      else params.delete("q");

      if (next.functions.length) params.set("fn", next.functions.join(","));
      else params.delete("fn");

      if (next.phases.length) params.set("ph", next.phases.join(","));
      else params.delete("ph");

      if (next.badges.length) params.set("badge", next.badges.join(","));
      else params.delete("badge");

      if (next.maxPrice !== null && next.maxPrice !== undefined)
        params.set("price", String(next.maxPrice));
      else params.delete("price");

      if (next.enterpriseOnly) params.set("ent", "1");
      else params.delete("ent");

      if (partial.view) params.set("view", partial.view);

      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [filters, pathname, router, searchParams],
  );

  const toggleListValue = useCallback(
    (key: "functions" | "phases" | "badges", value: string) => {
      const current = filters[key];
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      update({ [key]: next } as Partial<ToolFilters>);
    },
    [filters, update],
  );

  const clearAll = useCallback(() => {
    router.replace(pathname, { scroll: false });
  }, [pathname, router]);

  return { filters, view, update, toggleListValue, clearAll };
}
