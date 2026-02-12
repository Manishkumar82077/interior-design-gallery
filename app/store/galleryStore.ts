import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface GalleryState {
  selectedTag: string;
  setSelectedTag: (tagId: string) => void;

  hasHydrated: boolean;
  setHasHydrated: (value: boolean) => void;
}

export const useGalleryStore = create<GalleryState>()(
  persist(
    (set) => ({
      selectedTag: 'all',
      setSelectedTag: (tagId) => set({ selectedTag: tagId }),

      hasHydrated: false,
      setHasHydrated: (value) => set({ hasHydrated: value }),
    }),
    {
      name: 'gallery-filter',
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
