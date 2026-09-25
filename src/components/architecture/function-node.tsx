import type { NodeProps, Node } from "@xyflow/react";
import { getFunctionIcon } from "@/lib/function-icons";
import type { BusinessFunction } from "@/lib/schema";
import { NodeHandles } from "./node-handles";
import { cn } from "cn";

export type FunctionNodeState = "normal" | "active" | "related" | "dimmed";

export type FunctionNodeData = {
  fn: BusinessFunction;
  toolCount: number;
  state: FunctionNodeState;
};

export type FunctionFlowNode = Node<FunctionNodeData, "function">;

const stateClass: Record<FunctionNodeState, string> = {
  normal: "border-line bg-card",
  active: "border-amber bg-amber/10 shadow-[0_0_0_3px_var(--amber)_/_0.15]",
  related: "border-amber/60 bg-amber/5",
  dimmed: "border-line bg-card opacity-35",
};

export function FunctionNode({ data }: NodeProps<FunctionFlowNode>) {
  const Icon = getFunctionIcon(data.fn.icon);
  return (
    <div
      className={cn(
        "flex h-full w-full flex-col gap-1.5 rounded-md border p-3 text-left transition-opacity",
        stateClass[data.state],
      )}
    >
      <NodeHandles />
      <div className="flex items-center justify-between">
        <span className="flex size-7 items-center justify-center rounded-sm bg-secondary text-foreground">
          {/* eslint-disable-next-line react-hooks/static-components -- stable lookup from a static icon map, not a fresh component definition */}
          <Icon className="size-3.5" aria-hidden="true" />
        </span>
        <span className="font-data text-[0.6rem] text-muted-foreground">
          {data.fn.subtypes.length} subtypes
        </span>
      </div>
      <div className="font-display text-[0.78rem] leading-tight font-semibold">
        {data.fn.shortName ?? data.fn.name}
      </div>
      <div className="mt-auto font-data text-[0.6rem] text-muted-foreground">
        {data.toolCount} tools
      </div>
    </div>
  );
}
