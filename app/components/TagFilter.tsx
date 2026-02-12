// app/components/TagFilter.tsx
'use client';

import { useEffect, useRef } from 'react';
import { GalleryTag } from '@/app/lib/types';
import { ArrowLeft, Check } from 'lucide-react';

interface TagFilterProps {
  tags: GalleryTag[];
  selectedTag: string;
  onTagSelect: (tagId: string) => void;
  onBack?: () => void;
}

export default function TagFilter({
  tags,
  selectedTag,
  onTagSelect,
  onBack,
}: TagFilterProps) {
  // Create a ref for the active tag
  const activeTagRef = useRef<HTMLButtonElement | null>(null);

  // Automatically scroll to the active tag whenever it changes or component mounts
  useEffect(() => {
    if (activeTagRef.current) {
      activeTagRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center', // This centers the active tag in the scroll view
      });
    }
  }, [selectedTag, tags]); // Also listen to 'tags' to ensure they are loaded

  return (
    <div className="mb-6 w-full">
      <div className="flex items-center gap-3 rounded-xl bg-gray-100/80 backdrop-blur px-3 py-2 shadow-sm">
        
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center justify-center rounded-full bg-black text-white p-2 
                       hover:bg-gray-800 transition cursor-pointer flex-shrink-0"
            aria-label="Go back"
          >
            <ArrowLeft size={16} />
          </button>
        )}

        <div
          className="flex flex-nowrap gap-2 items-center overflow-x-auto py-1
                       [&::-webkit-scrollbar]:hidden [scrollbar-width:none] [-ms-overflow-style:none]"
        >
          <TagButton
            label="All"
            selected={selectedTag === 'all'}
            onClick={() => onTagSelect('all')}
            // Attach ref if this is the selected one
            buttonRef={selectedTag === 'all' ? activeTagRef : null}
          />

          {tags.map((tag) => (
            <TagButton
              key={tag.id}
              label={tag.tag_display_name}
              selected={selectedTag === tag.id.toString()}
              onClick={() => onTagSelect(tag.id.toString())}
              // Attach ref if this is the selected one
              buttonRef={selectedTag === tag.id.toString() ? activeTagRef : null}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* Reusable pill button with Ref support */
function TagButton({
  label,
  selected,
  onClick,
  buttonRef, // Receive the ref here
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
  buttonRef: React.RefObject<HTMLButtonElement | null> | null;
}) {
  return (
    <button
      ref={buttonRef} // Apply the ref to the button element
      onClick={onClick}
      className={`flex-shrink-0 flex items-center gap-2 rounded-full px-5 py-1.5 text-sm font-medium
                  transition-all cursor-pointer
                  ${
                    selected
                      ? 'bg-black text-white shadow-md scale-[1.02]'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100 hover:border-gray-600'
                  }`}
    >
      {selected && <Check size={14} />}
      {label}
    </button>
  );
}