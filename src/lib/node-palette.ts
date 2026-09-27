/**
 * A fixed 7-color palette cycled by node index across the Blueprint canvas
 * (phase spine + function grid), so the diagram reads as a colorful map at
 * rest instead of only lighting up on selection. Classes are written out in
 * full (not built from a template string) so Tailwind's build-time scan
 * picks them up — see workflow-drilldown.tsx / adoption-lifecycle.tsx for
 * the same pattern used elsewhere in this codebase.
 */
export const NODE_PALETTE = [
  {
    badge: "bg-violet-600",
    border: "border-violet-600",
    borderSoft: "border-violet-600/50",
    glow: "shadow-[0_0_0_3px_rgba(124,58,237,0.18)]",
    tint: "bg-violet-600/5",
  },
  {
    badge: "bg-fuchsia-600",
    border: "border-fuchsia-600",
    borderSoft: "border-fuchsia-600/50",
    glow: "shadow-[0_0_0_3px_rgba(192,38,211,0.18)]",
    tint: "bg-fuchsia-600/5",
  },
  {
    badge: "bg-sky-600",
    border: "border-sky-600",
    borderSoft: "border-sky-600/50",
    glow: "shadow-[0_0_0_3px_rgba(2,132,199,0.18)]",
    tint: "bg-sky-600/5",
  },
  {
    badge: "bg-emerald-600",
    border: "border-emerald-600",
    borderSoft: "border-emerald-600/50",
    glow: "shadow-[0_0_0_3px_rgba(5,150,105,0.18)]",
    tint: "bg-emerald-600/5",
  },
  {
    badge: "bg-orange-600",
    border: "border-orange-600",
    borderSoft: "border-orange-600/50",
    glow: "shadow-[0_0_0_3px_rgba(234,88,12,0.18)]",
    tint: "bg-orange-600/5",
  },
  {
    badge: "bg-rose-600",
    border: "border-rose-600",
    borderSoft: "border-rose-600/50",
    glow: "shadow-[0_0_0_3px_rgba(225,29,72,0.18)]",
    tint: "bg-rose-600/5",
  },
  {
    badge: "bg-cyan-600",
    border: "border-cyan-600",
    borderSoft: "border-cyan-600/50",
    glow: "shadow-[0_0_0_3px_rgba(8,145,178,0.18)]",
    tint: "bg-cyan-600/5",
  },
] as const;

export function nodeTheme(index: number) {
  return NODE_PALETTE[index % NODE_PALETTE.length];
}
