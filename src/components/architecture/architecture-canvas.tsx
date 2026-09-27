"use client";

import { useCallback, useMemo, useState } from "react";
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  type Edge,
  type Node,
  type NodeMouseHandler,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import {
  functions,
  phases,
  functionConnections,
  getToolsForCell,
  getToolsForFunction,
} from "@/lib/data";
import {
  getPhasePosition,
  getFunctionPosition,
  pickHandles,
  NODE_WIDTH,
  NODE_HEIGHT,
} from "@/lib/architecture-layout";
import {
  PhaseNode,
  type PhaseFlowNode,
  type PhaseNodeState,
} from "./phase-node";
import {
  FunctionNode,
  type FunctionFlowNode,
  type FunctionNodeState,
} from "./function-node";
import { DetailPanel, type Selection } from "./detail-panel";
import { WorkflowDrilldown } from "./workflow-drilldown";
import { FeedbackEdge } from "./feedback-edge";
import { RotateCcw } from "lucide-react";

const nodeTypes = { phase: PhaseNode, function: FunctionNode };
const edgeTypes = { feedback: FeedbackEdge };

const SIGNAL = "var(--signal)";
const AMBER = "var(--amber)";

export function ArchitectureCanvas() {
  const [selection, setSelection] = useState<Selection>(null);

  const relatedFunctionIds = useMemo(() => {
    if (!selection) return new Set<string>();
    if (selection.type === "function") {
      const ids = new Set<string>();
      for (const c of functionConnections) {
        if (c.from === selection.id) ids.add(c.to);
        if (c.to === selection.id) ids.add(c.from);
      }
      return ids;
    }
    // phase selected: functions active in that phase
    return new Set(
      functions
        .filter((f) => getToolsForCell(f.id, selection.id).length > 0)
        .map((f) => f.id),
    );
  }, [selection]);

  const relatedPhaseIds = useMemo(() => {
    if (!selection) return new Set<string>();
    if (selection.type === "phase") return new Set([selection.id]);
    const ids = new Set<string>();
    for (const p of phases) {
      if (getToolsForCell(selection.id, p.id).length > 0) ids.add(p.id);
    }
    return ids;
  }, [selection]);

  function phaseState(phaseId: string): PhaseNodeState {
    if (!selection) return "normal";
    if (selection.type === "phase")
      return selection.id === phaseId ? "active" : "normal";
    return relatedPhaseIds.has(phaseId) ? "related" : "dimmed";
  }

  function functionState(functionId: string): FunctionNodeState {
    if (!selection) return "normal";
    if (selection.type === "function") {
      if (selection.id === functionId) return "active";
      return relatedFunctionIds.has(functionId) ? "related" : "dimmed";
    }
    return relatedFunctionIds.has(functionId) ? "related" : "dimmed";
  }

  const nodes: Node[] = useMemo(() => {
    const phaseNodes: PhaseFlowNode[] = phases.map((phase, i) => ({
      id: `phase:${phase.id}`,
      type: "phase",
      position: getPhasePosition(i),
      data: {
        phase,
        index: i,
        toolCount: functions.reduce(
          (sum, f) => sum + getToolsForCell(f.id, phase.id).length,
          0,
        ),
        state: phaseState(phase.id),
      },
      width: NODE_WIDTH,
      height: NODE_HEIGHT,
      draggable: false,
    }));

    const functionNodes: FunctionFlowNode[] = functions.map((fn, i) => ({
      id: `function:${fn.id}`,
      type: "function",
      position: getFunctionPosition(i),
      data: {
        fn,
        index: i,
        toolCount: getToolsForFunction(fn.id).length,
        state: functionState(fn.id),
      },
      width: NODE_WIDTH,
      height: NODE_HEIGHT,
      draggable: false,
    }));

    return [...phaseNodes, ...functionNodes];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selection]);

  const edges: Edge[] = useMemo(() => {
    const result: Edge[] = [];
    const dim = selection !== null;

    // Lifecycle sequence
    for (let i = 0; i < phases.length - 1; i++) {
      const a = phases[i];
      const b = phases[i + 1];
      const { sourceHandle, targetHandle } = pickHandles(
        getPhasePosition(i),
        getPhasePosition(i + 1),
      );
      result.push({
        id: `seq:${a.id}-${b.id}`,
        source: `phase:${a.id}`,
        target: `phase:${b.id}`,
        sourceHandle,
        targetHandle,
        style: { stroke: SIGNAL, strokeWidth: 2, opacity: dim ? 0.15 : 0.8 },
      });
    }

    // Feedback loop: last phase back to first, arcing out to the left of
    // the vertical spine (functions sit to the right, so looping left
    // keeps this line clear of everything else).
    const first = phases[0];
    const last = phases[phases.length - 1];
    result.push({
      id: "feedback-loop",
      type: "feedback",
      source: `phase:${last.id}`,
      target: `phase:${first.id}`,
      sourceHandle: "left-source",
      targetHandle: "left-target",
      style: {
        stroke: SIGNAL,
        strokeWidth: 1.5,
        strokeDasharray: "5 4",
        opacity: dim ? 0.15 : 0.7,
      },
      animated: true,
    });

    // Phase <-> function membership
    for (const phase of phases) {
      const phaseIdx = phases.indexOf(phase);
      for (const fn of functions) {
        if (getToolsForCell(fn.id, phase.id).length === 0) continue;
        const fnIdx = functions.indexOf(fn);
        const visible =
          selection?.type === "phase"
            ? selection.id === phase.id
            : selection?.type === "function"
              ? selection.id === fn.id
              : false;
        if (!visible) continue;
        const { sourceHandle, targetHandle } = pickHandles(
          getPhasePosition(phaseIdx),
          getFunctionPosition(fnIdx),
        );
        result.push({
          id: `mem:${phase.id}-${fn.id}`,
          source: `phase:${phase.id}`,
          target: `function:${fn.id}`,
          sourceHandle,
          targetHandle,
          style: { stroke: AMBER, strokeWidth: 1.75, opacity: 0.9 },
          animated: true,
        });
      }
    }

    // Cross-function connections
    for (const conn of functionConnections) {
      const visible =
        selection?.type === "function" &&
        (selection.id === conn.from || selection.id === conn.to);
      if (!visible) continue;
      const fromIdx = functions.findIndex((f) => f.id === conn.from);
      const toIdx = functions.findIndex((f) => f.id === conn.to);
      const { sourceHandle, targetHandle } = pickHandles(
        getFunctionPosition(fromIdx),
        getFunctionPosition(toIdx),
      );
      result.push({
        id: `conn:${conn.from}-${conn.to}`,
        source: `function:${conn.from}`,
        target: `function:${conn.to}`,
        sourceHandle,
        targetHandle,
        style: { stroke: AMBER, strokeWidth: 1.75, opacity: 0.9 },
        animated: true,
      });
    }

    return result;
  }, [selection]);

  const onNodeClick: NodeMouseHandler = useCallback((_event, node) => {
    const [type, id] = node.id.split(":") as ["phase" | "function", string];
    setSelection((prev) =>
      prev?.type === type && prev.id === id ? null : { type, id },
    );
  }, []);

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_340px]">
        <div className="relative h-[calc(100vh-160px)] min-h-[640px] overflow-hidden rounded-xl border border-line bg-card">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            onNodeClick={onNodeClick}
            onPaneClick={() => setSelection(null)}
            nodesDraggable={false}
            nodesConnectable={false}
            elementsSelectable={true}
            fitView
            fitViewOptions={{ padding: 0.06 }}
            minZoom={0.15}
            maxZoom={1.5}
            zoomOnScroll={false}
            zoomOnPinch={false}
            zoomOnDoubleClick={false}
            proOptions={{ hideAttribution: true }}
          >
            <Background
              variant={BackgroundVariant.Dots}
              gap={20}
              size={1}
              color="var(--line)"
            />
          </ReactFlow>

          {selection && (
            <button
              type="button"
              onClick={() => setSelection(null)}
              className="absolute top-3 right-3 z-10 flex items-center gap-1.5 rounded-full border border-line bg-card px-2.5 py-1.5 text-xs font-medium shadow-sm hover:border-signal hover:text-signal"
            >
              <RotateCcw className="size-3.5" aria-hidden="true" />
              Reset view
            </button>
          )}
        </div>

        <div
          data-testid="architecture-detail-panel"
          className="h-[420px] overflow-hidden rounded-xl border border-line bg-card xl:h-[calc(100vh-160px)]"
        >
          <DetailPanel selection={selection} onSelect={setSelection} />
        </div>
      </div>

      {selection?.type === "function" && (
        <WorkflowDrilldown
          functionId={selection.id}
          onClose={() => setSelection(null)}
        />
      )}
    </div>
  );
}
