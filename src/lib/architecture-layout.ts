// Compact sizing so the whole graph fits on one screen via fitView, with
// no drag/pan needed to see every node at once. Node size is large relative
// to the gap between rows/columns (tight packing) — fitView always
// normalizes to the container, so the lever for bigger-looking boxes isn't
// the node size in isolation, it's how little of the total content extent
// is empty gap versus node.
export const NODE_WIDTH = 244;
export const NODE_HEIGHT = 112;
export const ROW_STEP = 128;
export const PHASE_X = 0;
export const FUNCTION_COLUMN_STEP = 260;
export const FUNCTION_COLUMN_1_X = 288;

/** Phases run down a single vertical spine, top to bottom, in order. */
export function getPhasePosition(index: number) {
  return { x: PHASE_X, y: index * ROW_STEP };
}

/** 14 functions as a 2-column x 7-row grid beside the phase spine. */
export function getFunctionPosition(index: number) {
  const col = index % 2;
  const row = Math.floor(index / 2);
  return { x: FUNCTION_COLUMN_1_X + col * FUNCTION_COLUMN_STEP, y: row * ROW_STEP };
}

/**
 * Total canvas height needed to show every row without shrinking to fit —
 * sized from content (phaseCount/functionRowCount), not a fixed short box,
 * so fitView lands close to 1x zoom instead of cramming everything tiny.
 */
export function getCanvasHeight(phaseCount: number, functionCount: number): number {
  const rows = Math.max(phaseCount, Math.ceil(functionCount / 2));
  return rows * ROW_STEP + NODE_HEIGHT + 80;
}

export type HandleSide = "top" | "bottom" | "left" | "right";

interface HandlePair {
  sourceHandle: `${HandleSide}-source`;
  targetHandle: `${HandleSide}-target`;
}

/** Picks the geometrically sensible handle pair for an edge between two fixed positions. */
export function pickHandles(source: { x: number; y: number }, target: { x: number; y: number }): HandlePair {
  const dx = target.x - source.x;
  const dy = target.y - source.y;
  if (Math.abs(dx) >= Math.abs(dy)) {
    return dx >= 0
      ? { sourceHandle: "right-source", targetHandle: "left-target" }
      : { sourceHandle: "left-source", targetHandle: "right-target" };
  }
  return dy >= 0
    ? { sourceHandle: "bottom-source", targetHandle: "top-target" }
    : { sourceHandle: "top-source", targetHandle: "bottom-target" };
}
