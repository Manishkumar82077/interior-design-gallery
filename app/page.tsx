// app/page.tsx
import GalleryGrid from './components/GalleryGrid';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-full px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-4 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900">
            Interior Design Gallery
          </h1>
          <p className="mt-2 text-gray-600">
            Browse through our collection of interior design projects
          </p>
        </header>

        <GalleryGrid />
      </div>
    </main>
  );
}