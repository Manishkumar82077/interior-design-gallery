// app/components/SimilarImages.tsx

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { GalleryImage } from '@/app/lib/types';

interface SimilarImagesProps {
  images: GalleryImage[];
}

export default function SimilarImages({ images }: SimilarImagesProps) {
  if (images.length === 0) return null;

  return (
    <section className="mt-14">
      <h2 className="mb-6 text-xl sm:text-2xl font-bold text-gray-900">
        Similar Images
      </h2>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {images.map((image) => (
          <Link
            key={image.id}
            href={`/gallery/${image.id}`}
            className="block group"
          >
            <div className="relative overflow-hidden rounded-lg bg-white shadow-sm transition-all duration-300 hover:shadow-lg">

              {/* Image */}
              <div className="relative aspect-square overflow-hidden">
                <Image
                  src={image.media_url}
                  alt={image.profile_name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                />
              </div>

              {/* Gradient overlay */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              {/* Title */}
              <div className="absolute bottom-0 left-0 right-0 px-3 py-2">
                <h3 className="text-xs font-semibold text-white truncate opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  {image.profile_name}
                </h3>
              </div>

            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
