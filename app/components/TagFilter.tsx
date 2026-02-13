'use client';

import { useEffect, useMemo, useRef } from 'react';
import { GalleryTag } from '@/app/lib/types';
import { ArrowLeft, Check, X } from 'lucide-react';

interface TagFilterProps {
  tags: GalleryTag[];
  selectedTags: string[];
  onTagToggle: (tagId: string) => void;
  onClear: () => void;
  onBack?: () => void;
}

export default function TagFilter({
  tags,
  selectedTags,
  onTagToggle,
  onClear,
  onBack,
}: TagFilterProps) {
  const activeTagRef = useRef<HTMLButtonElement | null>(null);
  // This ref ensures we only scroll once per page load
  const hasScrolled = useRef(false);

  // Sort selected tags by visual order (not click order)
  const sortedSelectedTags = useMemo(() => {
    return [...selectedTags].sort((a, b) => {
      const ia = tags.findIndex(t => t.id.toString() === a);
      const ib = tags.findIndex(t => t.id.toString() === b);
      return ia - ib;
    });
  }, [selectedTags, tags]);

  // Scroll ONLY once on initial load/reload
  useEffect(() => {
    // Only proceed if we have tags and haven't scrolled yet in this session
    if (tags.length > 0 && !hasScrolled.current) {
      
      // We use a small timeout to give the browser time to paint 
      // the buttons and calculate their positions in the flex container
      const timer = setTimeout(() => {
        if (activeTagRef.current) {
          activeTagRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'center',
          });
          
          // Mark as scrolled so manual clicks don't cause jumps
          hasScrolled.current = true;
        }
      }, 150); // 150ms is safer for cold reloads

      return () => clearTimeout(timer);
    }
  }, [tags, selectedTags]); // Runs when data arrives or selection is initialized

  return (
    <div className="w-full">
      <div className="flex items-center gap-3 rounded-xl bg-gray-100/80 backdrop-blur px-3 py-2 shadow-sm">

        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center justify-center rounded-full bg-black text-white p-2 hover:bg-gray-800 transition cursor-pointer flex-shrink-0"
          >
            <ArrowLeft size={16} />
          </button>
        )}

        <div className="flex flex-nowrap gap-2 items-center overflow-x-auto py-1 [&::-webkit-scrollbar]:hidden [scrollbar-width:none] [-ms-overflow-style:none]">
          <TagButton
            label="All"
            selected={selectedTags.length === 0}
            onClick={onClear}
            // If "All" is active, it's our scroll target on reload
            buttonRef={selectedTags.length === 0 ? activeTagRef : undefined}
          />

          {tags.map((tag) => {
            const tagId = tag.id.toString();
            const isSelected = selectedTags.includes(tagId);

            // Determine if this is the first selected tag in the horizontal list
            const isScrollTarget =
              isSelected && sortedSelectedTags[0] === tagId;

            return (
              <TagButton
                key={tag.id}
                label={tag.tag_display_name}
                selected={isSelected}
                onClick={() => onTagToggle(tagId)}
                buttonRef={isScrollTarget ? activeTagRef : undefined}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

function TagButton({
  label,
  selected,
  onClick,
  buttonRef,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
  buttonRef?: React.RefObject<HTMLButtonElement | null>;
}) {
  return (
    <button
      ref={buttonRef}
      onClick={onClick}
      className={`flex-shrink-0 flex items-center gap-2 rounded-full px-5 py-1.5 text-sm font-medium transition-all cursor-pointer
        ${
          selected
            ? 'bg-black text-white shadow-md scale-[1.02]'
            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100 hover:border-gray-600'
        }`}
    >
      {selected && label !== 'All' ? <X size={14} /> : selected && <Check size={14} />}
      {label}
    </button>
  );
}