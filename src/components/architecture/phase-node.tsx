import type { NodeProps, Node } from "@xyflow/react";
import { getPhaseIcon } from "@/lib/phase-icons";
import type { LifecyclePhase } from "@/lib/schema";
import { NodeHandles } from "./node-handles";
import { nodeTheme } from "@/lib/node-palette";
import { cn } from "cn";

export type PhaseNodeState = "normal" | "active" | "related" | "dimmed";

export type PhaseNodeData = {
  phase: LifecyclePhase;
  index: number;
  toolCount: number;
  state: PhaseNodeState;
};

export type PhaseFlowNode = Node<PhaseNodeData, "phase">;

export function PhaseNode({ data }: NodeProps<PhaseFlowNode>) {
  const Icon = getPhaseIcon(data.phase.id);
  const theme = nodeTheme(data.index);

  const stateClass: Record<PhaseNodeState, string> = {
    normal: "border-line bg-card shadow-sm",
    active: cn(theme.border, theme.tint, theme.glow),
    related: cn(theme.borderSoft, theme.tint, "shadow-sm"),
    dimmed: "border-line bg-card opacity-30",
  };

  return (
    <div
      className={cn(
        "flex h-full w-full flex-col gap-1.5 rounded-lg border p-3 text-left transition-all",
        stateClass[data.state],
      )}
    >
      <NodeHandles />
      <div className="flex items-center justify-between">
        <span
          className={cn(
            "flex size-8 items-center justify-center rounded-md text-white",
            theme.badge,
          )}
        >
          {/* eslint-disable-next-line react-hooks/static-components -- stable lookup from a static icon map, not a fresh component definition */}
          <Icon className="size-4" aria-hidden="true" />
        </span>
        <span className="font-data text-[0.65rem] text-muted-foreground">
          {String(data.index + 1).padStart(2, "0")}/07
        </span>
      </div>
      <div className="font-display text-[0.85rem] leading-tight font-semibold">
        {data.phase.name}
      </div>
      <div className="mt-auto font-data text-[0.65rem] text-muted-foreground">
        {data.toolCount} tools
      </div>
    </div>
  );
}
