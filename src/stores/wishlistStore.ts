import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface WishlistStore {
  items: string[]; // product handles
  toggle: (handle: string) => void;
  isFavorite: (handle: string) => boolean;
  clear: () => void;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      toggle: (handle) => {
        const { items } = get();
        set({ items: items.includes(handle) ? items.filter(h => h !== handle) : [...items, handle] });
      },
      isFavorite: (handle) => get().items.includes(handle),
      clear: () => set({ items: [] }),
    }),
    {
      name: 'wishlist',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
