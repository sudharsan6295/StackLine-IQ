"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * True only after client hydration. Uses useSyncExternalStore (not
 * useState+useEffect) so there's no synchronous setState-in-effect, and no
 * extra render is needed to flip it — React resolves the client/server
 * snapshot mismatch during hydration itself, the same mechanism the docs
 * recommend for theme-dependent UI that must differ from the SSR output.
 */
export function useHasMounted(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
