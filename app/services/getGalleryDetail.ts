import { GalleryDetail } from "../lib/types";

export default async function getGalleryDetail(
  id: string
): Promise<GalleryDetail | null> {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    const response = await fetch(`${baseUrl}/api/gallery/${id}`, {
      cache: "no-store",
    });

    if (!response.ok) return null;
    return response.json();
  } catch {
    return null;
  }
}
