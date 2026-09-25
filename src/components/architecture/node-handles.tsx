import { Handle, Position } from "@xyflow/react";

const invisible = {
  opacity: 0,
  width: 1,
  height: 1,
  minWidth: 1,
  minHeight: 1,
  border: "none",
};

/**
 * Every node gets a source + target handle on all four sides so the
 * (fixed, hand-laid-out) graph can route an edge in whichever direction
 * actually makes sense for that pair of nodes — see pickHandles() in
 * lib/architecture-layout.ts. Handles are invisible; nodesConnectable is
 * off, so they're purely anchor points, never interactive themselves.
 */
export function NodeHandles() {
  return (
    <>
      <Handle
        id="top-target"
        type="target"
        position={Position.Top}
        style={invisible}
        isConnectable={false}
      />
      <Handle
        id="top-source"
        type="source"
        position={Position.Top}
        style={invisible}
        isConnectable={false}
      />
      <Handle
        id="bottom-target"
        type="target"
        position={Position.Bottom}
        style={invisible}
        isConnectable={false}
      />
      <Handle
        id="bottom-source"
        type="source"
        position={Position.Bottom}
        style={invisible}
        isConnectable={false}
      />
      <Handle
        id="left-target"
        type="target"
        position={Position.Left}
        style={invisible}
        isConnectable={false}
      />
      <Handle
        id="left-source"
        type="source"
        position={Position.Left}
        style={invisible}
        isConnectable={false}
      />
      <Handle
        id="right-target"
        type="target"
        position={Position.Right}
        style={invisible}
        isConnectable={false}
      />
      <Handle
        id="right-source"
        type="source"
        position={Position.Right}
        style={invisible}
        isConnectable={false}
      />
    </>
  );
}
