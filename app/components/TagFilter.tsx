// app/components/TagFilter.tsx
'use client';

import { useEffect, useRef } from 'react';
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

  // Auto-scroll logic: finds the first tag that is currently selected
  useEffect(() => {
    if (activeTagRef.current) {
      activeTagRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center', 
      });
    }
  }, [selectedTags, tags]); 

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
            // If nothing is selected, "All" is our scroll target
            buttonRef={selectedTags.length === 0 ? activeTagRef : null}
          />

          {tags.map((tag) => {
            const isSelected = selectedTags.includes(tag.id.toString());
            
            // We attach the ref to the first selected tag we encounter in the map
            // This ensures the scroll bar moves to the first active filter
            const isFirstSelected = isSelected && selectedTags[0] === tag.id.toString();

            return (
              <TagButton
                key={tag.id}
                label={tag.tag_display_name}
                selected={isSelected}
                onClick={() => onTagToggle(tag.id.toString())}
                buttonRef={isFirstSelected ? activeTagRef : null}
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
  buttonRef: React.RefObject<HTMLButtonElement | null> | null;
}) {
  return (
    <button
      ref={buttonRef}
      onClick={onClick}
      className={`flex-shrink-0 flex items-center gap-2 rounded-full px-5 py-1.5 text-sm font-medium transition-all cursor-pointer
        ${selected
          ? 'bg-black text-white shadow-md scale-[1.02]'
          : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100 hover:border-gray-600'
        }`}
    >
      {/* If it's selected and not the "All" button, show an X to remove it */}
      {selected && label !== "All" ? <X size={14} /> : selected && <Check size={14} />}
      {label}
    </button>
  );
}