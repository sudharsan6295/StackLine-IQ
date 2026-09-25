import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ShortlistState {
  shortlistIds: string[];
  compareIds: string[];
  toggleShortlist: (id: string) => void;
  isShortlisted: (id: string) => boolean;
  toggleCompare: (id: string) => void;
  isComparing: (id: string) => boolean;
  clearCompare: () => void;
  clearShortlist: () => void;
}

const MAX_COMPARE = 4;

export const useShortlistStore = create<ShortlistState>()(
  persist(
    (set, get) => ({
      shortlistIds: [],
      compareIds: [],
      toggleShortlist: (id) =>
        set((state) => ({
          shortlistIds: state.shortlistIds.includes(id)
            ? state.shortlistIds.filter((x) => x !== id)
            : [...state.shortlistIds, id],
        })),
      isShortlisted: (id) => get().shortlistIds.includes(id),
      toggleCompare: (id) =>
        set((state) => {
          if (state.compareIds.includes(id)) {
            return { compareIds: state.compareIds.filter((x) => x !== id) };
          }
          if (state.compareIds.length >= MAX_COMPARE) return state;
          return { compareIds: [...state.compareIds, id] };
        }),
      isComparing: (id) => get().compareIds.includes(id),
      clearCompare: () => set({ compareIds: [] }),
      clearShortlist: () => set({ shortlistIds: [] }),
    }),
    { name: "ai-tools-hub-shortlist" },
  ),
);

export { MAX_COMPARE };
