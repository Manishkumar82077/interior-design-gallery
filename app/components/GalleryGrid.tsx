/* eslint-disable @typescript-eslint/no-explicit-any */
// app/components/GalleryGrid.tsx
'use client';

import { useEffect, useState } from 'react';
import Masonry from 'react-masonry-css';
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
  const [, setError] = useState<string | null>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  /* Zustand Store */
  const selectedTags = useGalleryStore((s) => s.selectedTags);
  const toggleTag = useGalleryStore((s) => s.toggleTag);
  const resetTags = useGalleryStore((s) => s.resetTags);
  const hasHydrated = useGalleryStore((s) => s.hasHydrated);

  useEffect(() => {
    const handleScroll = () => setShowScrollButton(window.scrollY > 500);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  /* Fetch tags */
  useEffect(() => {
    if (!hasHydrated) return;
    fetch('/api/tags').then(res => res.json()).then(setTags).catch(() => setError('Failed to load tags'));
  }, [hasHydrated]);

  /* Fetch galleries - Notice the URL change to join selectedTags */
  useEffect(() => {
    if (!hasHydrated) return;
    const controller = new AbortController();
    const fetchGalleries = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Pass tags as a comma separated string
        const tagQuery = selectedTags.length > 0 ? `?tagIds=${selectedTags.join(',')}` : '';
        const res = await fetch(`/api/galleries${tagQuery}`, { signal: controller.signal });
        
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
  }, [selectedTags, hasHydrated]);

  if (!hasHydrated) return <div className="mx-auto max-w-[1600px] px-3 sm:px-4"><GallerySkeleton /></div>;

  return (
    <div className="relative mx-auto max-w-[1600px] px-3 sm:px-4">
      <div className="sticky top-0 z-40 bg-white/90 py-3 backdrop-blur-md border-b border-gray-100 -mx-3 px-3 sm:-mx-4 sm:px-4">
        <TagFilter
          tags={tags}
          selectedTags={selectedTags}
          onTagToggle={toggleTag}
          onClear={resetTags}
        />
      </div>

      <div className="mt-6">
        {loading && <GallerySkeleton />}
        {!loading && galleries.length === 0 && <div className="py-24 text-center text-gray-500">No images found</div>}
        {!loading && galleries.length > 0 && (
          <Masonry breakpointCols={breakpointColumnsObj} className="flex w-auto gap-3" columnClassName="flex flex-col gap-3">
            {galleries.map((gallery) => <GalleryCard key={gallery.id} gallery={gallery} />)}
          </Masonry>
        )}
      </div>

      {showScrollButton && (
        <button onClick={scrollToTop} className="fixed bottom-8 right-8 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-black text-white shadow-xl transition-all hover:scale-110 active:scale-90">
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