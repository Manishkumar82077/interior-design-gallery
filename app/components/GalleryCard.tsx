"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef } from "react";
import { GalleryImage } from "@/app/lib/types";

interface GalleryCardProps {
  gallery: GalleryImage;
}

export default function GalleryCard({ gallery }: GalleryCardProps) {
  const [showOverlay, setShowOverlay] = useState(false);
  const lastTapRef = useRef<number>(0);
  const hideTimerRef = useRef<NodeJS.Timeout | null>(null);

  const dateStr = new Date(gallery.created_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Desktop → normal navigation
    if (window.innerWidth >= 1024) return;

    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;

    // ✅ Double tap → allow navigation
    if (now - lastTapRef.current < DOUBLE_TAP_DELAY) {
      return;
    }

    // ❌ Single tap → prevent navigation
    e.preventDefault();
    lastTapRef.current = now;

    setShowOverlay(true);

    // Auto-hide overlay
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    hideTimerRef.current = setTimeout(() => {
      setShowOverlay(false);
    }, 1500);
  };

  return (
    <Link
      href={`/gallery/${gallery.id}`}
      className="block"
      onClick={handleClick}
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
