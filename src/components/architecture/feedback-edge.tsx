import { BaseEdge, getBezierPath, type EdgeProps } from "@xyflow/react";

/**
 * A more pronounced bezier than xyflow's default curvature — since source
 * and target sit on the same ("left") side of the spine, a higher
 * curvature reads as a single smooth brace/bracket arcing out and back,
 * rather than the tighter loop the default curvature produces.
 */
export function FeedbackEdge({
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style,
}: EdgeProps) {
  const [path] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    curvature: 0.6,
  });
  return <BaseEdge path={path} style={style} />;
}
