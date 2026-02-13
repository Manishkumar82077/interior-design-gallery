// app/gallery/[id]/page.tsx

import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import SimilarImages from '@/app/components/SimilarImages';
import { getGalleryDetailLogic } from '@/app/api/gallery/[id]/route';

export default async function GalleryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  console.log('Fetching gallery detail for ID:', id);
  const gallery = await getGalleryDetailLogic(id);
  console.log('Gallery Detail:', gallery);

  if (!gallery) notFound();

  const formattedDate = new Date(gallery.created_at).toLocaleDateString(
    'en-US',
    {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }
  );

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b">
        <div className="mx-auto max-w-full px-4 py-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800 transition"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Gallery
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-full px-4 py-8 sm:px-6 lg:px-8">
        {/* Hero Card */}
       {/* Hero Image */}
<section className="overflow-hidden rounded-2xl bg-white shadow-md">
  <div className="relative aspect-video w-full overflow-hidden">
    <Image
      src={gallery.media_url}
      alt={gallery.profile_name}
      fill
      priority
      className="object-cover"
      sizes="(max-width: 1024px) 100vw, 1200px"
    />
  </div>
</section>

 {/* Details BELOW the image */}
<section className="mt-4 rounded-xl bg-white p-4 sm:mt-6 sm:rounded-2xl sm:p-6 lg:p-8 shadow-md">
  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
    {/* Profile */}
    <div className="flex items-center gap-3 sm:gap-4">
      {gallery.profile_picture ? (
        <Image
          src={gallery.profile_picture}
          alt={gallery.profile_name}
          width={48}
          height={48}
          className="rounded-full object-cover ring-2 ring-white shadow-sm sm:h-14 sm:w-14"
        />
      ) : (
        <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-blue-100 text-lg sm:text-xl font-bold text-blue-600">
          {gallery.profile_name.charAt(0)}
        </div>
      )}

      <div>
        <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
          {gallery.profile_name}
        </h1>
        <p className="text-xs sm:text-sm text-gray-500">
          {gallery.total_photos} site photos
        </p>
      </div>
    </div>

    {/* Date */}
    <span className="text-xs sm:text-sm text-gray-400">
      Posted on {formattedDate}
    </span>
  </div>

  {/* Tags */}
  {gallery.tags.length > 0 && (
    <div className="mt-4 sm:mt-6 flex flex-wrap gap-2">
      {gallery.tags.map((tag) => (
        <span
          key={tag.id}
          className="rounded-full bg-indigo-50 px-2.5 py-0.5 sm:px-3 sm:py-1 text-[11px] sm:text-xs font-semibold text-indigo-700"
        >
          #{tag.tag_display_name}
        </span>
      ))}
    </div>
  )}
</section>



        {/* Similar Images */}
        <SimilarImages images={gallery.similar_images} />
      </div>
    </main>
  );
}
