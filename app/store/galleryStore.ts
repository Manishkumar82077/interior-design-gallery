import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface GalleryState {
  selectedTag: string;
  setSelectedTag: (tagId: string) => void;
}

export const useGalleryStore = create<GalleryState>()(
  persist(
    (set) => ({
      selectedTag: 'all',
      setSelectedTag: (tagId) => set({ selectedTag: tagId }),
    }),
    {
      name: 'gallery-filter', // key in localStorage
    }
  )
);