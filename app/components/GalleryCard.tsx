// 'use client';

// import Link from 'next/link';
// import Image from 'next/image';
// import { GalleryImage } from '@/app/lib/types';

// interface GalleryCardProps {
//   gallery: GalleryImage;
// }

// export default function GalleryCard({ gallery }: GalleryCardProps) {
//   const dateStr = new Date(gallery.created_at).toLocaleDateString('en-US', {
//     month: 'short',
//     day: 'numeric',
//     year: 'numeric',
//   });

//   return (
//     <Link href={`/gallery/${gallery.id}`}>
//       {/* Container: Grows in height on hover to show the extra space below */}
//       <div className="group flex flex-col w-full h-auto bg-transparent cursor-pointer rounded-lg overflow-hidden transition-all duration-300">
        
//         {/* Image Section */}
//         <div className="relative overflow-hidden rounded-t-lg">
//           <Image
//             src={gallery.media_url}
//             alt={gallery.profile_name}
//             width={500}
//             height={700}
//             className="h-auto w-full object-cover transition-transform duration-500 group-hover:scale-105"
//             sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
//           />
//         </div>

//         {/* WHITE STRIP UI:
//           - hidden / group-hover:block: Only exists in layout during hover
//           - border-t-0: Seamless connection to the image above
//         */}
//         <div className="hidden group-hover:block w-full bg-white px-4 py-3 border-x border-b border-gray-100 rounded-b-lg shadow-xl animate-in fade-in slide-in-from-top-2">
          
//           <div className="flex flex-col space-y-1.5">
//             {/* 1. Profile Name (Main Title) */}
//             <h3 className="text-[13px] font-bold text-gray-900 leading-none">
//               {gallery.profile_name}
//             </h3>

//             {/* 2. Photo Count and Date (Sub-info) */}
//             <div className="flex items-center gap-2 text-[10px] text-gray-500 font-medium">
//               <span className="flex items-center gap-1 text-gray-400">
//                 <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
//                   <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
//                 </svg>
//                 {gallery.total_photos} photos
//               </span>
//               <span className="w-1 h-1 rounded-full bg-gray-300 border border-gray-700" />
//               <span>{dateStr}</span>
//             </div>

//             {/* 3. Tag Section (Highlight) */}
//             {gallery.tags.length > 0 && (
//               <div className="mt-1 flex items-center gap-1 pt-1.5 border-t border-gray-50">
//                 <span className="text-[10px] font-bold text-indigo-600 tracking-tight">
//                   #{gallery.tags[0].tag_display_name.toUpperCase()}
//                 </span>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </Link>
//   );
// }'use client';

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
