"use client";

import { Download } from "lucide-react";

export default function ImageDownloadIcon({ url }: { url: string }) {
  const handleDownload = () => {
    window.location.href = `/api/download?url=${encodeURIComponent(url)}`;
  };

  return (
    <button
      onClick={handleDownload}
      aria-label="Download image"
      className="absolute right-3 top-3 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-700 shadow hover:bg-gray-200 active:scale-95 cursor-pointer"
    >
      <Download className="h-5 w-5" />
    </button>
  );
}
