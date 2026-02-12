'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import { GalleryImage } from '@/app/lib/types';

interface SimilarImagesProps {
  images: GalleryImage[];
  isLoading?: boolean;
}

// --- Skeleton Loader ---
function SimilarImagesSkeleton() {
  return (
    <section className="mt-14 animate-pulse">
      <div className="h-7 w-48 bg-gray-200 rounded mb-6" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="rounded-lg bg-gray-50 overflow-hidden border border-gray-100">
            <div className="aspect-square bg-gray-200" />
            <div className="p-2 space-y-2">
              <div className="h-2.5 w-2/3 bg-gray-200 rounded" />
              <div className="h-2 w-1/2 bg-gray-200 rounded" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function SimilarImages({ images, isLoading }: SimilarImagesProps) {
  const [activeId, setActiveId] = useState<string | number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  if (isLoading) return <SimilarImagesSkeleton />;
  if (!images || images.length === 0) return null;

  const handleTouch = (e: React.TouchEvent, id: string | number) => {
    if (activeId !== id) {
      e.preventDefault(); 
      setActiveId(id);

      if (timerRef.current) clearTimeout(timerRef.current);

      timerRef.current = setTimeout(() => {
        setActiveId(null);
      }, 1500);
    }
  };

  return (
    <section className="mt-14">
      <h2 className="mb-6 text-xl sm:text-2xl font-bold text-gray-900">
        Similar Images
      </h2>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {images.map((image) => {
          const isVisible = activeId === image.id;
          
          // Format date like the main card
          const dateStr = new Date(image.created_at).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          });

          return (
            <Link
              key={image.id}
              href={`/gallery/${image.id}`}
              className="block group"
              onTouchStart={(e) => handleTouch(e, image.id)}
            >
              <div className="relative overflow-hidden rounded-lg bg-white shadow-sm border border-gray-100">
                
                {/* Image */}
                <div className="relative aspect-square overflow-hidden bg-gray-50">
                  <Image
                    src={image.media_url}
                    alt={image.profile_name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                  />
                </div>

                {/* Smaller Overlay Details */}
                <div
                  className={`
                    absolute inset-x-0 bottom-0
                    bg-white/95 backdrop-blur-sm
                    px-2 py-1.5
                    transition-all duration-300 ease-out
                    ${isVisible 
                      ? "translate-y-0 opacity-100" 
                      : "translate-y-full opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100"
                    }
                  `}
                >
                  <div className="flex  gap-3 justify-between">
                    <h3 className="text-[10px] font-bold text-gray-900 truncate leading-tight">
                      {image.profile_name}
                    </h3>

                    <div className="flex items-center gap-1 text-[8px] text-gray-500 font-medium">
                      <span>{image.total_photos} photos</span>
                      <span className="w-0.5 h-0.5 rounded-full bg-gray-300" />
                      <span>{dateStr}</span>
                    </div>
                  </div>
                </div>

              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}