import { MousePointerClick, Move, ZoomIn } from "lucide-react";

export function ArchitectureLegend() {
  return (
    <div className="flex flex-col gap-3 rounded-md border border-line bg-card p-4 text-xs sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-6 sm:gap-y-2">
      <div className="flex items-center gap-2">
        <span className="h-0.5 w-5 bg-signal" aria-hidden="true" />
        Lifecycle sequence
      </div>
      <div className="flex items-center gap-2">
        <span
          className="h-0.5 w-5 border-t border-dashed border-muted-foreground"
          aria-hidden="true"
        />
        Feedback loop
      </div>
      <div className="flex items-center gap-2">
        <span className="h-0.5 w-5 bg-signal" aria-hidden="true" />
        Outgoing connection
      </div>
      <div className="flex items-center gap-2">
        <span className="h-0.5 w-5 bg-amber" aria-hidden="true" />
        Incoming connection
      </div>
      <span
        className="hidden text-muted-foreground sm:inline"
        aria-hidden="true"
      >
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
      <div className="flex items-center gap-1.5 text-muted-foreground">
        <ZoomIn className="size-3.5" aria-hidden="true" />
        Scroll or pinch to zoom
      </div>
    </div>
  );
}
