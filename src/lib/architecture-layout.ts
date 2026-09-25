export const NODE_WIDTH = 200;
export const NODE_HEIGHT = 96;
export const COLUMN_STEP = 260;
export const PHASE_Y = 0;
export const FUNCTION_ROW_1_Y = 260;
export const FUNCTION_ROW_2_Y = 480;

export function getPhasePosition(index: number) {
  return { x: index * COLUMN_STEP, y: PHASE_Y };
}

/** 14 functions laid out as 7 columns x 2 rows, under the phase row. */
export function getFunctionPosition(index: number) {
  const col = index % 7;
  const row = Math.floor(index / 7);
  return {
    x: col * COLUMN_STEP,
    y: row === 0 ? FUNCTION_ROW_1_Y : FUNCTION_ROW_2_Y,
  };
}

export type HandleSide = "top" | "bottom" | "left" | "right";

interface HandlePair {
  sourceHandle: `${HandleSide}-source`;
  targetHandle: `${HandleSide}-target`;
}

/** Picks the geometrically sensible handle pair for an edge between two fixed positions. */
export function pickHandles(
  source: { x: number; y: number },
  target: { x: number; y: number },
): HandlePair {
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
