// app/components/GalleryGrid.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import Masonry from 'react-masonry-css';
// Import the icon from lucide-react
import { ChevronUp } from 'lucide-react';

import { GalleryImage, GalleryTag } from '@/app/lib/types';
import GalleryCard from './GalleryCard';
import TagFilter from './TagFilter';
import { useGalleryStore } from '@/app/store/galleryStore';

const breakpointColumnsObj = {
  default: 5,
  1536: 5,
  1280: 4,
  1024: 3,
  640: 2,
};

export default function GalleryGrid() {
  const [galleries, setGalleries] = useState<GalleryImage[]>([]);
  const [tags, setTags] = useState<GalleryTag[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  /* State for Back to Top visibility */
  const [showScrollButton, setShowScrollButton] = useState(false);

  /* Zustand Store */
  const selectedTag = useGalleryStore((s) => s.selectedTag);
  const setSelectedTag = useGalleryStore((s) => s.setSelectedTag);
  const hasHydrated = useGalleryStore((s) => s.hasHydrated);

  /* 1. Logic to show/hide the arrow button based on scroll position */
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 500) {
        setShowScrollButton(true);
      } else {
        setShowScrollButton(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /* 2. Scroll to top function */
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  /* Fetch tags */
  useEffect(() => {
    if (!hasHydrated) return;
    const controller = new AbortController();
    const fetchTags = async () => {
      try {
        const res = await fetch('/api/tags', { signal: controller.signal });
        if (!res.ok) throw new Error();
        setTags(await res.json());
      } catch (err: any) {
        if (err.name !== 'AbortError') setError('Failed to load tags');
      }
    };
    fetchTags();
    return () => controller.abort();
  }, [hasHydrated]);

  /* Fetch galleries */
  useEffect(() => {
    if (!hasHydrated) return;
    const controller = new AbortController();
    const fetchGalleries = async () => {
      try {
        setLoading(true);
        setError(null);
        const url = selectedTag === 'all' ? '/api/galleries' : `/api/galleries?tagId=${selectedTag}`;
        const res = await fetch(url, { signal: controller.signal });
        if (!res.ok) throw new Error();
        setGalleries(await res.json());
      } catch (err: any) {
        if (err.name !== 'AbortError') setError('Failed to load galleries');
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };
    fetchGalleries();
    return () => controller.abort();
  }, [selectedTag, hasHydrated]);

  if (!hasHydrated) return <div className="mx-auto max-w-[1600px] px-3 sm:px-4"><GallerySkeleton /></div>;
  if (error) return <div className="py-20 text-center text-red-600 font-medium">{error}</div>;

  return (
    <div className="relative mx-auto max-w-[1600px] px-3 sm:px-4">
      
      {/* STICKY TAB BAR: 
          'sticky top-0' keeps it at the top when scrolling.
          'z-40' ensures it stays above the images.
          'bg-white/90' with 'backdrop-blur' makes it look premium. 
      */}
      <div className="sticky top-0 z-40 bg-white/90 py-3 backdrop-blur-md border-b border-gray-100 -mx-3 px-3 sm:-mx-4 sm:px-4">
        <TagFilter
          tags={tags}
          selectedTag={selectedTag}
          onTagSelect={setSelectedTag}
        />
      </div>

      <div className="mt-6">
        {loading && <GallerySkeleton />}

        {!loading && galleries.length === 0 && (
          <div className="py-24 text-center text-gray-500">No images found</div>
        )}

        {!loading && galleries.length > 0 && (
          <Masonry
            breakpointCols={breakpointColumnsObj}
            className="flex w-auto gap-3"
            columnClassName="flex flex-col gap-3"
          >
            {galleries.map((gallery) => (
              <GalleryCard key={gallery.id} gallery={gallery} />
            ))}
          </Masonry>
        )}
      </div>

      {/* BACK TO TOP BUTTON:
          Only renders if showScrollButton is true.
          Fixed to bottom right.
      */}
      {showScrollButton && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-black text-white shadow-xl transition-all hover:scale-110 active:scale-90"
          aria-label="Scroll to top"
        >
          <ChevronUp size={24} />
        </button>
      )}
    </div>
  );
}

function GallerySkeleton() {
  return (
    <Masonry breakpointCols={breakpointColumnsObj} className="flex w-auto gap-3" columnClassName="flex flex-col gap-3">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="h-64 rounded-lg bg-gray-200 animate-pulse" />
      ))}
    </Masonry>
  );
}