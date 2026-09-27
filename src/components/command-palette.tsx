"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { functions, tools } from "@/lib/data";
import {
  Building2,
  Compass,
  Info,
  LayoutGrid,
  Waypoints,
  Wrench,
} from "lucide-react";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || e.key === "/") {
        if (e.key === "/" && (e.target as HTMLElement)?.tagName === "INPUT")
          return;
        e.preventDefault();
        setOpen((o) => !o);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  function go(href: string) {
    setOpen(false);
    router.push(href);
  }

  return (
    <CommandDialog
      open={open}
      onOpenChange={setOpen}
      title="Search"
      description="Search tools and functions"
    >
      <Command>
        <CommandInput
          autoFocus
          placeholder="Search tools, functions, or jump to a page…"
        />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Pages">
            <CommandItem onSelect={() => go("/")}>
              <LayoutGrid /> Registry (home)
            </CommandItem>
            <CommandItem onSelect={() => go("/architecture")}>
              <Waypoints /> Explore
            </CommandItem>
            <CommandItem onSelect={() => go("/stack-builder")}>
              <Compass /> Build
            </CommandItem>
            <CommandItem onSelect={() => go("/governance")}>
              <Building2 /> Governance
            </CommandItem>
            <CommandItem onSelect={() => go("/about")}>
              <Info /> About
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Functions">
            {functions.map((fn) => (
              <CommandItem
                key={fn.id}
                onSelect={() => go(`/functions/${fn.id}`)}
              >
                <Building2 /> {fn.name}
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Tools">
            {tools.map((tool) => (
              <CommandItem
                key={tool.id}
                onSelect={() => go(`/tools/${tool.id}`)}
              >
                <Wrench />
                <span className="min-w-0 flex-1 truncate">{tool.name}</span>
                <span className="ml-2 max-w-[45%] shrink-0 truncate text-xs text-muted-foreground">
                  {tool.bestFor}
                </span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </CommandDialog>
  );
}
