'use client';

import { GalleryTag } from '@/app/lib/types';
import { ArrowLeft, Check } from 'lucide-react';

interface TagFilterProps {
  tags: GalleryTag[];
  selectedTag: string;
  onTagSelect: (tagId: string) => void;
  onBack?: () => void; // optional back action
}

export default function TagFilter({
  tags,
  selectedTag,
  onTagSelect,
  onBack,
}: TagFilterProps) {
  return (
    <div className="mb-6 w-full">
      {/* Background container */}
      <div className="flex items-center gap-3 rounded-xl bg-gray-100/80 backdrop-blur px-3 py-2 shadow-sm">
        
        {/* Back button */}
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center justify-center rounded-full bg-black text-white p-2 
                       hover:bg-gray-800 transition cursor-pointer"
            aria-label="Go back"
          >
            <ArrowLeft size={16} />
          </button>
        )}

        {/* Scrollable tag list */}
        <div
          className="flex flex-nowrap gap-2 items-center overflow-x-auto py-1
                     [&::-webkit-scrollbar]:hidden [scrollbar-width:none] [-ms-overflow-style:none]"
        >
          {/* All button */}
          <TagButton
            label="All"
            selected={selectedTag === 'all'}
            onClick={() => onTagSelect('all')}
          />

          {tags.map((tag) => (
            <TagButton
              key={tag.id}
              label={tag.tag_display_name}
              selected={selectedTag === tag.id.toString()}
              onClick={() => onTagSelect(tag.id.toString())}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* Reusable pill button */
function TagButton({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
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
