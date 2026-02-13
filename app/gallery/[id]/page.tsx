// app/gallery/[id]/page.tsx

import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import SimilarImages from '@/app/components/SimilarImages';
import { getGalleryDetailLogic } from '@/app/api/gallery/[id]/route';
import ImageDownloadIcon from '@/app/components/ImageDownloadIcon';
import { Calendar, Hash, ImageIcon, User } from 'lucide-react';
export default async function GalleryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  console.log('Fetching gallery detail for ID:', id);
  const gallery = await getGalleryDetailLogic(id);

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
        <section className="relative rounded-2xl bg-black overflow-hidden">
          <ImageDownloadIcon url={gallery.media_url} />

          <div className="relative w-full h-[220px] sm:h-[360px] lg:h-[480px] pointer-events-none">
            <Image
              src={gallery.media_url}
              alt={gallery.profile_name}
              fill
              priority
              className="object-contain select-none"
              sizes="100vw"
            />
          </div>
        </section>

        {/* Details BELOW the image – Labeled, Monochrome, Compact */}
        <section className="mt-4 rounded-xl bg-white px-4 py-4 sm:mt-6 sm:px-6 sm:py-5 lg:px-8 shadow-sm space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            {/* Profile */}
            <Link
              href={`/profile/${gallery.created_by_user_id}`}
              className="flex items-center gap-3 group"
            >
              {gallery.profile_picture ? (
                <Image
                  src={gallery.profile_picture}
                  alt={gallery.profile_name}
                  width={44}
                  height={44}
                  className="h-11 w-11 rounded-full object-cover ring-1 ring-gray-300 group-hover:ring-blue-500 transition"
                />
              ) : (
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-200 text-sm font-semibold text-gray-800">
                  {gallery.profile_name.charAt(0)}
                </div>
              )}

              <div>
                <div className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
                  <User className="h-4 w-4" />
                  Profile
                </div>

                <h1 className="text-base sm:text-lg font-semibold text-gray-900 leading-tight group-hover:underline">
                  {gallery.profile_name}
                </h1>

                <p className="text-sm text-gray-600">
                  {gallery.total_photos} photos
                </p>
              </div>
            </Link>


            {/* Posted Date */}
            <div className="text-right">
              <div className="flex items-center justify-end gap-1.5 text-sm font-medium text-gray-700">
                <Calendar className="h-4 w-4" />
                Posted
              </div>
              <p className="text-sm text-gray-900 whitespace-nowrap">
                {formattedDate}
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gray-200" />

          {/* Meta Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Image ID */}
            <div>
              <div className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
                <ImageIcon className="h-4 w-4" />
                Image ID
              </div>
              <p className="text-sm font-semibold text-gray-900">
                {gallery.id}
              </p>
            </div>

            {/* Updated */}
            <div>
              <p className="text-sm font-medium text-gray-700">
                Last Updated
              </p>
              <p className="text-sm font-semibold text-gray-900">
                {new Date(gallery.updated_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>

            {/* Similar Images */}
            <div>
              <p className="text-sm font-medium text-gray-700">
                Similar Images
              </p>
              <p className="text-sm font-semibold text-gray-900">
                {gallery.similar_images.length}
              </p>
            </div>

            {/* Created By */}
            <div className="lg:col-span-3">
              <p className="text-sm font-medium text-gray-700">
                Created By User
              </p>
              <p className="text-sm font-semibold text-gray-900 break-all">
                {gallery.created_by_user_id}
              </p>
            </div>
          </div>

          {/* Hashtags */}
          {/* Hashtags */}
          {gallery.tags.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">
                Hashtags
              </p>

              <div className="flex flex-wrap gap-2">
                {gallery.tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="inline-flex items-center gap-1.5 rounded-md border border-gray-400 px-3 py-1 text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100 transition"
                  >
                    <Hash className="h-4 w-4" />
                    {tag.tag_display_name}
                  </span>
                ))}
              </div>
            </div>
          )}

        </section>

        {/* Similar Images */}
        <SimilarImages images={gallery.similar_images} />
      </div>
    </main>
  );
}
