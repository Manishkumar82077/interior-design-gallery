import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getProfileWithGalleries } from '@/app/services/profile';

/* ---------------- Utils ---------------- */
function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/* ---------------- Page ---------------- */
export default async function ProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let data;
  try {
    data = await getProfileWithGalleries(id);
  } catch (err) {
    console.error('Profile fetch failed:', err);
    return notFound();
  }

  if (!data) return notFound();

  const { profile, galleries } = data;

  if (!profile) return notFound();

  return (
    <div className="max-w-full mx-auto px-4 py-6 space-y-10">
      {/* ================= PROFILE HEADER ================= */}
      <section className="space-y-6">
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
        {/* Cover Image */}
        {profile.cover_image && (
          <div className="relative h-64 w-full overflow-hidden rounded-xl">
            <Image
              src={profile.cover_image}
              alt={profile.profile_name}
              fill
              priority
              className="object-cover"
            />
          </div>
        )}

        {/* Profile Info */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          {/* Left */}
          <div className="flex items-center gap-4">
            {profile.profile_picture ? (
              <Image
                src={profile.profile_picture}
                alt={profile.profile_name}
                width={80}
                height={80}
                className="rounded-full object-cover ring-1 ring-gray-300"
              />
            ) : (
              <div className="h-20 w-20 rounded-full bg-gray-200" />
            )}

            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                {profile.profile_name}
              </h1>
              <p className="text-sm text-gray-500 break-all">
                Contractor ID: {profile.contractor_uuid}
              </p>
            </div>
          </div>

          {/* Right Stats */}
          <div className="flex gap-8 text-sm">
            <div className="text-center">
              <p className="text-xl font-semibold text-gray-900">
                {profile.total_photo_uploaded}
              </p>
              <p className="text-gray-500">Photos</p>
            </div>

            <div className="text-center">
              <p className="font-medium text-gray-900">
                {formatDate(profile.created_at)}
              </p>
              <p className="text-gray-500">Joined</p>
            </div>

            <div className="text-center">
              <p className="font-medium text-gray-900">
                {formatDate(profile.updated_at)}
              </p>
              <p className="text-gray-500">Last Update</p>
            </div>
          </div>
        </div>

        <div className="h-px bg-gray-200" />
      </section>

      {/* ================= GALLERY ================= */}
      <section>
        {galleries.length === 0 ? (
          <p className="text-center text-gray-500">
            No images uploaded yet.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {galleries.map((item) => (
              <div
                key={item.id}
                className="group relative aspect-square overflow-hidden rounded-lg bg-gray-100"
              >
                <Image
                  src={item.media_url}
                  alt={item.profile_name}
                  fill
                  sizes="(max-width: 640px) 50vw,
                         (max-width: 1024px) 33vw,
                         25vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />

                {/* Tags */}
                {item.tags?.length > 0 && (
                  <div className="absolute bottom-2 left-2 right-2 flex flex-wrap gap-1">
                    {item.tags.map((tag) => (
                      <span
                        key={tag.id}
                        className="bg-black/60 text-white text-xs px-2 py-1 rounded"
                      >
                        {tag.tag_display_name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
