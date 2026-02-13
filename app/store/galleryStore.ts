// app/store/galleryStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface GalleryState {
  selectedTags: string[]; 
  toggleTag: (tagId: string) => void;
  resetTags: () => void;
  hasHydrated: boolean;
  setHasHydrated: (value: boolean) => void;
}

export const useGalleryStore = create<GalleryState>()(
  persist(
    (set) => ({
      selectedTags: [], 
      toggleTag: (tagId) => 
        set((state) => ({
          selectedTags: state.selectedTags.includes(tagId)
            ? state.selectedTags.filter((id) => id !== tagId) 
            : [...state.selectedTags, tagId], 
        })),
      resetTags: () => set({ selectedTags: [] }),
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