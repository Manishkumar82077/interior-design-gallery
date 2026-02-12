import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface GalleryState {
  selectedTag: string;
  setSelectedTag: (tagId: string) => void;
  hasHydrated: boolean;
}

export const useGalleryStore = create<GalleryState>()(
  persist(
    (set) => ({
      selectedTag: 'all',
      setSelectedTag: (tagId) => set({ selectedTag: tagId }),
      hasHydrated: false,
    }),
    {
      name: 'gallery-filter',
      onRehydrateStorage: () => (state) => {
        if (state) state.hasHydrated = true;
      },
    }
  )
);