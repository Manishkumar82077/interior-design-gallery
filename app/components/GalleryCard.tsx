// app/components/GalleryCard.tsx

import Link from 'next/link';
import Image from 'next/image';
import { GalleryImage } from '@/app/lib/types';

interface GalleryCardProps {
  gallery: GalleryImage;
}

export default function GalleryCard({ gallery }: GalleryCardProps) {
  const dateStr = new Date(gallery.created_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <Link
      href={`/gallery/${gallery.id}`}
      className="block"
    >
      <div className="group relative overflow-hidden rounded-lg bg-white shadow-sm cursor-pointer">

        {/* Image */}
        <Image
          src={gallery.media_url}
          alt={gallery.profile_name}
          width={500}
          height={700}
          className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
        />

        {/* Compact overlay strip */}
        <div
          className="
            absolute inset-x-0 bottom-0
            bg-white/95 backdrop-blur
            px-3 py-2
            transition-all duration-300 ease-out
            translate-y-full opacity-0
            group-hover:translate-y-0 group-hover:opacity-100
          "
        >
          <div className="flex flex-col gap-1">

            {/* Title */}
            <h3 className="text-[12px] font-semibold text-gray-900 leading-tight truncate">
              {gallery.profile_name}
            </h3>

            {/* Meta row */}
            <div className="flex items-center justify-between text-[10px] text-gray-500">

              {/* Left: photos + date */}
              <div className="flex items-center gap-1.5">
                <span>{gallery.total_photos} photos</span>
                <span className="w-1 h-1 rounded-full bg-gray-300" />
                <span>{dateStr}</span>
              </div>

              {/* Right: tag */}
              {gallery.tags?.length > 0 && (
                <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[9px] font-semibold text-black">
                  #{gallery.tags[0].tag_display_name}
                </span>
              )}
            </div>

          </div>
        </div>

      </div>
    </Link>
  );
}
