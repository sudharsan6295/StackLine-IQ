/**
 * The "Layers" mark (option 2 of 6 shown for direct sign-off): three
 * stacked rounded tiers reading literally as "stack," each a step deeper
 * into the brand's blue→violet range. Flat fills, no gradient — colorful
 * enough on its own that it doesn't need a colored badge container behind
 * it (unlike the earlier Zap-in-a-square treatment).
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
      <rect x="8" y="8" width="32" height="9" rx="3" fill="#3559E9" />
      <rect x="8" y="19.5" width="32" height="9" rx="3" fill="#5A7CEC" />
      <rect x="8" y="31" width="32" height="9" rx="3" fill="#6952D8" />
    </svg>
  );
}
