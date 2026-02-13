"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef } from "react";
import { GalleryImage } from "@/app/lib/types";
import { Hash, User } from "lucide-react";
import { useRouter } from "next/navigation";

interface GalleryCardProps {
  gallery: GalleryImage;
}

export default function GalleryCard({ gallery }: GalleryCardProps) {
  const router = useRouter();

  const [showOverlay, setShowOverlay] = useState(false);
  const lastTapRef = useRef<number>(0);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const dateStr = new Date(gallery.created_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const handleCardTap = () => {
    // Desktop → normal navigation
    if (window.innerWidth >= 1024) {
      router.push(`/gallery/${gallery.id}`);
      return;
    }

    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;

    // ✅ Double tap → navigate
    if (now - lastTapRef.current < DOUBLE_TAP_DELAY) {
      router.push(`/gallery/${gallery.id}`);
      return;
    }

    // ❌ Single tap → show overlay only
    lastTapRef.current = now;
    setShowOverlay(true);

    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    hideTimerRef.current = setTimeout(() => {
      setShowOverlay(false);
    }, 1500);
  };

  return (
    <div
      role="button"
      onClick={handleCardTap}
      className="group relative overflow-hidden rounded-lg bg-white shadow-sm cursor-pointer"
    >
      <Image
        src={gallery.media_url}
        alt={gallery.profile_name}
        width={500}
        height={700}
        className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
      />

      {/* Overlay */}
      <div
        className={`
    absolute inset-x-0 bottom-0
    bg-white/95 backdrop-blur
    px-2 py-1.5
    transition-all duration-300 ease-out
    ${showOverlay
            ? "translate-y-0 opacity-100"
            : "translate-y-full opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100"
          }
  `}
      >
        <div className="flex flex-col gap-1">
          {/* Top row: Profile | Photos • Date */}
          <div className="flex items-center justify-between gap-2">
            {/* Profile */}
            <Link
              href={`/profile/${gallery.created_by_user_id}`}
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1 group/profile cursor-pointer min-w-0"
            >
              <User
                size={11}
                className="text-gray-500 group-hover/profile:text-gray-900 transition"
              />
              <span className="text-[11px] font-semibold text-gray-900 truncate group-hover/profile:underline">
                {gallery.profile_name}
              </span>
            </Link>

            {/* Photos • Date */}
            <div className="flex items-center gap-3 text-[9px] text-gray-500 shrink-0">
              <div className="gap-1">              
                <span>•</span>
                <span>{gallery.total_photos} photos</span>
              </div>
              <div className="gap-1">              
                <span>•</span>
                <span>{dateStr}</span>
              </div>
            </div>
          </div>

          {/* Tags */}
          {gallery.tags?.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {gallery.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag.id}
                  className="inline-flex items-center gap-0.5 rounded bg-gray-100 px-1.5 py-[1px] text-[9px] font-medium text-gray-700"
                >
                  <Hash size={9} className="text-gray-500" />
                  {tag.tag_display_name}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>


    </div>
  );
}
