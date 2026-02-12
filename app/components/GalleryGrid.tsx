/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import Masonry from 'react-masonry-css';

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

  /* Zustand */
  const selectedTag = useGalleryStore((s) => s.selectedTag);
  const setSelectedTag = useGalleryStore((s) => s.setSelectedTag);
  const hasHydrated = useGalleryStore((s) => s.hasHydrated);

  /* ✅ Fetch tags (once, after hydration) */
  useEffect(() => {
    if (!hasHydrated) return;

    const controller = new AbortController();

    const fetchTags = async () => {
      try {
        const res = await fetch('/api/tags', {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error();
        setTags(await res.json());
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          setError('Failed to load tags');
        }
      }
    };

    fetchTags();
    return () => controller.abort();
  }, [hasHydrated]);

  /* ✅ Fetch galleries (ONLY when tag changes & hydrated) */
  useEffect(() => {
    if (!hasHydrated) return;

    const controller = new AbortController();

    const fetchGalleries = async () => {
      try {
        setLoading(true);
        setError(null);

        const url =
          selectedTag === 'all'
            ? '/api/galleries'
            : `/api/galleries?tagId=${selectedTag}`;

        const res = await fetch(url, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error();

        setGalleries(await res.json());
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          setError('Failed to load galleries');
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchGalleries();
    return () => controller.abort();
  }, [selectedTag, hasHydrated]);

  /* ✅ Safe render guards (AFTER hooks) */
  if (!hasHydrated) {
    return (
      <div className="mx-auto max-w-[1600px] px-3 sm:px-4">
        <GallerySkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-20 text-center text-red-600 font-medium">
        {error}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1600px] px-3 sm:px-4">
      <TagFilter
        tags={tags}
        selectedTag={selectedTag}
        onTagSelect={setSelectedTag}
      />

      {loading && <GallerySkeleton />}

      {!loading && galleries.length === 0 && (
        <div className="py-24 text-center text-gray-500">
          No images found
        </div>
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
  );
}

/* Skeleton loader */
function GallerySkeleton() {
  return (
    <Masonry
      breakpointCols={breakpointColumnsObj}
      className="flex w-auto gap-3"
      columnClassName="flex flex-col gap-3"
    >
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          className="h-64 rounded-lg bg-gray-200 animate-pulse"
        />
      ))}
    </Masonry>
  );
}
