// app/components/GalleryCard.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { GalleryImage } from "@/app/lib/types";

interface GalleryCardProps {
  gallery: GalleryImage;
}

export default function GalleryCard({ gallery }: GalleryCardProps) {
  const [showOverlay, setShowOverlay] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const dateStr = new Date(gallery.created_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    // If overlay is hidden, show it and prevent navigation on the first tap
    if (!showOverlay) {
      e.preventDefault(); 
      setShowOverlay(true);

      // Clear any existing timer before starting a new one
      if (timerRef.current) clearTimeout(timerRef.current);

      // Auto-hide after 1.5 seconds
      timerRef.current = setTimeout(() => {
        setShowOverlay(false);
      }, 1500);
    }
  };

  return (
    <Link
      href={`/gallery/${gallery.id}`}
      className="block"
      onTouchStart={handleTouchStart}
    >
      <div className="group relative overflow-hidden rounded-lg bg-white shadow-sm cursor-pointer">
        <Image
          src={gallery.media_url}
          alt={gallery.profile_name}
          width={500}
          height={700}
          className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
        />

        <div
          className={`
            absolute inset-x-0 bottom-0
            bg-white/95 backdrop-blur
            px-3 py-2
            transition-all duration-300 ease-out
            ${
              showOverlay
                ? "translate-y-0 opacity-100"
                : "translate-y-full opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100"
            }
          `}
        >
          <div className="flex flex-col gap-1">
            <h3 className="text-[12px] font-semibold text-gray-900 truncate">
              {gallery.profile_name}
            </h3>
            <div className="flex items-center justify-between text-[10px] text-gray-500">
              <div className="flex items-center gap-1.5">
                <span>{gallery.total_photos} photos</span>
                <span className="w-1 h-1 rounded-full bg-gray-300" />
                <span>{dateStr}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}