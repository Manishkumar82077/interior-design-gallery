// app/components/GalleryGrid.tsx
'use client';

import { useEffect, useState } from 'react';
import Masonry from 'react-masonry-css';

import { GalleryImage, GalleryTag } from '@/app/lib/types';
import GalleryCard from './GalleryCard';
import TagFilter from './TagFilter';

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
  const [selectedTag, setSelectedTag] = useState('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* Fetch tags (runs once) */
  useEffect(() => {
    fetch('/api/tags')
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(setTags)
      .catch(() => setError('Failed to load tags'));
  }, []);

  /* Trigger loading BEFORE effect */
  useEffect(() => {
    setLoading(true);
  }, [selectedTag]);

  /* Fetch galleries (side effect only) */
  useEffect(() => {
    let cancelled = false;

    const fetchGalleries = async () => {
      try {
        setError(null);

        const url =
          selectedTag === 'all'
            ? '/api/galleries'
            : `/api/galleries?tagId=${selectedTag}`;

        const res = await fetch(url);
        if (!res.ok) throw new Error();

        const data = await res.json();

        if (!cancelled) {
          setGalleries(data);
          setLoading(false);
        }
      } catch {
        if (!cancelled) {
          setError('Failed to load galleries');
          setLoading(false);
        }
      }
    };

    fetchGalleries();

    return () => {
      cancelled = true;
    };
  }, [selectedTag]);

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

