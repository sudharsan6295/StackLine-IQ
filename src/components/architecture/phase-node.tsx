import type { NodeProps, Node } from "@xyflow/react";
import { getPhaseIcon } from "@/lib/phase-icons";
import type { LifecyclePhase } from "@/lib/schema";
import { NodeHandles } from "./node-handles";
import { cn } from "cn";

export type PhaseNodeState = "normal" | "active" | "related" | "dimmed";

export type PhaseNodeData = {
  phase: LifecyclePhase;
  index: number;
  toolCount: number;
  state: PhaseNodeState;
};

export type PhaseFlowNode = Node<PhaseNodeData, "phase">;

const stateClass: Record<PhaseNodeState, string> = {
  normal: "border-line bg-card",
  active: "border-signal bg-signal/10 shadow-[0_0_0_3px_var(--signal)_/_0.15]",
  related: "border-signal/60 bg-signal/5",
  dimmed: "border-line bg-card opacity-35",
};

export function PhaseNode({ data }: NodeProps<PhaseFlowNode>) {
  const Icon = getPhaseIcon(data.phase.id);
  return (
    <div
      className={cn(
        "flex h-full w-full flex-col gap-1.5 rounded-md border p-3 text-left transition-opacity",
        stateClass[data.state],
      )}
    >
      <NodeHandles />
      <div className="flex items-center justify-between">
        <span className="flex size-7 items-center justify-center rounded-sm bg-secondary text-signal">
          {/* eslint-disable-next-line react-hooks/static-components -- stable lookup from a static icon map, not a fresh component definition */}
          <Icon className="size-3.5" aria-hidden="true" />
        </span>
        <span className="font-data text-[0.6rem] text-muted-foreground">
          {String(data.index + 1).padStart(2, "0")}/07
        </span>
      </div>
      <div className="font-display text-[0.8rem] leading-tight font-semibold">
        {data.phase.name}
      </div>
      <div className="mt-auto font-data text-[0.6rem] text-muted-foreground">
        {data.toolCount} tools
      </div>
    </div>
  );
}
