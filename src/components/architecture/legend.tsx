import { MousePointerClick, Move } from "lucide-react";

function DashedSwatch({ className }: { className: string }) {
  return (
    <svg width="24" height="8" viewBox="0 0 24 8" aria-hidden="true" className="shrink-0">
      <line x1="1" y1="4" x2="23" y2="4" strokeWidth="2" strokeDasharray="4 3" strokeLinecap="round" className={className} />
    </svg>
  );
}

export function ArchitectureLegend() {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-line bg-card p-4 text-xs sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-6 sm:gap-y-2">
      <div className="flex items-center gap-2">
        <DashedSwatch className="stroke-amber" />
        Outgoing connections
      </div>
      <div className="flex items-center gap-2">
        <DashedSwatch className="stroke-signal" />
        Feedback loops
      </div>
      <span className="hidden text-muted-foreground sm:inline" aria-hidden="true">
        |
      </span>
      <div className="flex items-center gap-1.5 text-muted-foreground">
        <MousePointerClick className="size-3.5" aria-hidden="true" />
        Click a node to explore its connections
      </div>
      <div className="flex items-center gap-1.5 text-muted-foreground">
        <Move className="size-3.5" aria-hidden="true" />
        Drag to pan
      </div>
    </div>
  );
}
